import {FileWithPath, useDropzone} from 'react-dropzone';
import "../sass/addfile.css"
import {useTranslation} from "react-i18next";
import withAuth from "../context/withAuth.tsx";
import {postFile} from "../api.tsx";
import {ErrorResponse} from "../interfaces.tsx";
import {useContext, useState} from "react";
import AuthContext from "../context/AuthContext.tsx";

const AddFile = () => {
    const { token } = useContext(AuthContext);
    const {t} = useTranslation();
    const [taskId, setTaskId] = useState<string | null>(null)
    const handleSendFile = async (file: File) => {
        console.log("handleSendFile")
        const form = new FormData()
        form.append("file", file)
        try {
            const post_file_data = await postFile(form, token)
            console.log("post_file_data")
            console.log(post_file_data)
            if (post_file_data.message && post_file_data.message.task_id) {
                console.log(post_file_data.message)
                setTaskId(post_file_data.message.task_id)
            }

        } catch (err: unknown) {
            const error = err as ErrorResponse
            console.log("error")
            console.log(error)
        }
    }
    console.log("taskId")
    console.log(taskId)

    const handleDrop = (acceptedFiles: File[]) => {
        console.log("acceptedFiles")
        if (acceptedFiles[0] !== undefined) {
            console.log(acceptedFiles[0])
            handleSendFile(acceptedFiles[0])
        }
        // const txtFiles = acceptedFiles.filter(file => file.name.endsWith('.txt'));
        // console.log(txtFiles)
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
        </section>
    );
};

export default withAuth(AddFile);
