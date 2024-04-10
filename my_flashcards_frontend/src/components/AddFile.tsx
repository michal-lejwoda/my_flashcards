import {FileWithPath, useDropzone} from 'react-dropzone';
import "../sass/addfile.css"
import {useTranslation} from "react-i18next";
import withAuth from "../context/withAuth.tsx";

const AddFile = () => {
    const {t} = useTranslation();
    // const handleDrop = (acceptedFiles) =>{
    //     const txtFiles = acceptedFiles.filter(file => file.name.endsWith('.txt'));
    //     console.log(txtFiles)
    // }
    // accept: {
    //     "image/*": [".png", ".gif", ".jpeg", ".jpg"],
    //   },
    const {acceptedFiles, getRootProps, getInputProps} = useDropzone({
        // onDrop: handleDrop,
        maxFiles: 1,
        minSize: 0,
        maxSize: 5242880
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
                    <p>{t('drag_and_drop_file')}</p>
            </div>
            <p>{t('max_size_file')}: 5mb</p>
{/*TODO Remove this later*/}
            <aside>
                <h4>Files</h4>
                <ul>{files}</ul>
            </aside>
        </section>
    );
};

export default withAuth(AddFile);
