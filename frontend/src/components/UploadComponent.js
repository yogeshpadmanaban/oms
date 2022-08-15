import { useDropzone } from "react-dropzone";

const UploadComponent = props => {
    const { setFieldValue } = props;
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      accept: "image/*",
      onDrop: acceptedFiles => {
        setFieldValue("files", acceptedFiles);
      }
    });
    return (
      <div>
        {}
        <div {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} name="multi"/>
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag 'n' drop some files here, or click to select files</p>
          )}
        </div>
      </div>
    );
  };

export default UploadComponent;
