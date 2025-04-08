import { useDropzone } from "react-dropzone"


type FileUploadPorps = {
    onChange: (file: File) => void
}
function FileUpload(props: FileUploadPorps) {
    const { onChange } = props

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: (acceptedFiles) => {
            const file = acceptedFiles.at(0)!
            onChange(file)
        }
    })

    return (
        <div {...getRootProps()} className="dropzone">
            <input {...getInputProps()} />
            {
                isDragActive ?
                    <p>Drop the files here ...</p> :
                    <p>Drag 'n' drop some files here, or click to select files</p>
            }
        </div>
    )
}

export default FileUpload 