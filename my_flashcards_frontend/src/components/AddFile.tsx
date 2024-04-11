import {FileWithPath, useDropzone} from 'react-dropzone';
import "../sass/addfile.css"
import {useTranslation} from "react-i18next";
import withAuth from "../context/withAuth.tsx";
import {getTaskResult, postFile} from "../api.tsx";
import {ErrorResponse} from "../interfaces.tsx";
import {useContext, useState} from "react";
import AuthContext from "../context/AuthContext.tsx";

const AddFile = () => {
    const {token} = useContext(AuthContext);
    const {t} = useTranslation();
    const [fileData, setFileData] = useState<[string, string][] | null>(null)
    console.log(fileData)

    interface Response {
        status: number;
        data: {
            message: {
                status: string;
                result: [string, string][];
            };
        };
        // inne właściwości
    }

    async function executeForTwoMinutes(action: (task_id: string, token: string | null) => Promise<Response>, task_id: string, token: string | null): Promise<void> {
        return new Promise((resolve, reject) => {
            const interval = setInterval(async () => {
                console.log("wywołanie")
                try {
                    const response = await action(task_id, token);
                    if (response && response.status === 200 && response.data.message.result) {
                        setFileData(response.data.message.result);
                        clearInterval(interval);
                        resolve();
                    }
                } catch (error) {
                    // TODO Back Here
                    console.error(error);
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
            console.log("post_file_data")
            console.log(post_file_data)
            if (post_file_data.message && post_file_data.message.task_id) {
                executeForTwoMinutes(() => getTaskResult(post_file_data.message.task_id, token), post_file_data.message.task_id, token);
            }

        } catch (err: unknown) {
            const error = err as ErrorResponse
            console.log("error")
            console.log(error)
        }
    }

    const handleDrop = (acceptedFiles: File[]) => {
        console.log("acceptedFiles")
        if (acceptedFiles[0] !== undefined) {
            console.log(acceptedFiles[0])
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
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));

    return (
        <section className="addfile">
            <h1 className="title">{t('add_file')}</h1>
            <div {...getRootProps({className: 'addfile__dropzone'})}>
                <input {...getInputProps()} />
                <p>{t('drag_and_drop_file')}(.txt, .docx)</p>
            </div>
            <p>{t('max_size_file')}: 2mb</p>
            {/*TODO Remove this later*/}
            <aside>
                <h4>Files</h4>
                <ul>{files}</ul>
            </aside>
            <div>
                {fileData && fileData.map((el) => {
                    return(
                    <p>{el[0]} - {el[1]}</p>
                    )})}
            </div>
            <p></p>
        </section>
    );
};

export default withAuth(AddFile);
