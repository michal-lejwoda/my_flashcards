import {FileWithPath, useDropzone} from 'react-dropzone';
import "../sass/addfile.css"
import {useTranslation} from "react-i18next";
import withAuth from "../context/withAuth.tsx";
import {getTaskResult, postFile} from "../api.tsx";
import {ErrorAddFileMessage, ErrorResponse, FileRowData, Response} from "../interfaces.tsx";
import {useContext, useState} from "react";
import AuthContext from "../context/AuthContext.tsx";
import FileResultTable from "../table/FileResultTable.tsx";
import "../sass/fileresult.css";

const AddFile = () => {
    const {token} = useContext(AuthContext);
    const {t} = useTranslation();
    const [fileData, setFileData] = useState<FileRowData[] | null>(null);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const [errorFileData, setErrorFileData] = useState("")
    const [loadingFileData, setLoadingFileData] = useState(false)

    async function executeForTwoMinutes(action: (task_id: string, token: string | null) => Promise<Response>, task_id: string, token: string | null): Promise<void> {
        return new Promise((resolve, reject) => {
            const interval = setInterval(async () => {
                try {
                    const response = await action(task_id, token);
                    if (response && response.status === 200 && response.data.message.result) {
                        setLoadingFileData(false)
                        setFileData(response.data.message.result);
                        clearInterval(interval);
                        resolve();
                    }
                } catch (err) {
                    const error = err as ErrorResponse
                    const errorMessage = error.response.data.message as ErrorAddFileMessage;
                    setLoadingFileData(false)
                    setErrorFileData(errorMessage.status)
                    clearInterval(interval);
                    reject(error);
                }
            }, 5000);

            setTimeout(() => {
                clearInterval(interval);
                resolve();
            }, 12000);
        });
    }


    const handleSendFile = async (file: File) => {
        const form = new FormData()
        form.append("file", file)
        try {
            const post_file_data = await postFile(form, token)
            if (post_file_data.message && post_file_data.message.task_id) {
                setLoadingFileData(true)
                setErrorFileData("")
                executeForTwoMinutes(() => getTaskResult(post_file_data.message.task_id, token), post_file_data.message.task_id, token);
            }

        } catch (err: unknown) {
            // #TODO Back HEre
            // const error = err as ErrorResponse
            setErrorFileData(t("try_again"))
        }
    }

    const handleDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles[0] !== undefined) {
            handleSendFile(acceptedFiles[0])
        }
    }
    const {acceptedFiles, getRootProps, getInputProps} = useDropzone({
        // TODO Try without extension
        onDrop: handleDrop,
        maxFiles: 1,
        minSize: 0,
        maxSize: 2097152,
        accept: {
            'text/plain': ['.txt', '.docx'],
        }
    });

    const files = acceptedFiles.map((file: FileWithPath) => (

        <p className="addfile__fieldname--list" key={file.path}>
            {file.path} - {file.size} bytes
        </p>


    ));


    return (
        <section className="addfile">
            <h1 className="title">{t('add_file')}</h1>
            <div className="dropzone__container">
                <div {...getRootProps({className: 'addfile__dropzone'})}>
                    <input {...getInputProps()} />
                    <p>{t('drag_and_drop_file')}(.txt, .docx)</p>
                </div>
            </div>
            <p></p>

            <p className="file-result__words-num">{t('max_size_file')}: 2mb</p>
            <div className="addfile__filename">{files}</div>

            {!fileData &&
                <>
                    <p>{t("file_example")}</p>
                    <img className="addfile__example" src="/public/example.png" alt="example"/>
                </>
            }
            {errorFileData !== "" ? (
                <p>{errorFileData}</p>
            ) : (
                loadingFileData ? (
                    <p>Loading...</p>
                ) : (
                    fileData && (
                        <FileResultTable
                            fileData={fileData}
                            setFileData={setFileData}
                            pagination={pagination}
                            setPagination={setPagination}
                        />
                    )
                )
            )}


        </section>
    );
};

export default withAuth(AddFile);
