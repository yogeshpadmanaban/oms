import React, { useCallback } from 'react'
import { useDropzone } from "react-dropzone";

const UploadComponent = props => {
  const { setFieldValue, set_orderImage } = props;

  const onDrop = useCallback((acceptedFiles) => {
    let array = [];
    acceptedFiles.forEach((file, index) => {
      const reader = new FileReader()
      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
        // Do whatever you want with the file contents
        array.push(reader.result);
        if (acceptedFiles.length == index + 1) {
          set_orderImage(array);
        }
      }
      reader.readAsDataURL(file)
    })
    setFieldValue("order_image", acceptedFiles);

  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ accept: "image/*", onDrop });


  return (
    <div>
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} name="multi" />
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