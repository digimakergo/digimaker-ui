import * as React from 'react';

interface FileUploadProps {
  name: string;
  service: string;
  format: string;
  value: string;
  multi?: boolean;
  onSuccess?: any;
}

function FileUpload({name, service, format, value, multi, onSuccess}: FileUploadProps) {
  const [uploadState, setUploadState] = React.useState(0);
  const [filename, setFilename] = React.useState('');
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    setFilename(value);
  }, [value]);

  const uploadFile = (files: any) => {
    let data = new FormData();

     if (files.length == 0) {
      return;
    }
    let file = files[0];
    data.append('file', file);
    setUploadState(1);
    fetch(
      process.env.REACT_APP_REMOTE_URL +
        '/util/uploadfile?service=' +
        service,
      {
        method: 'POST',
        body: data,
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw response.statusText;
        }
        return response.json();
      })
      .then((data) => {
        if (data.error === false) {
          setFilename(data.data);
          setUploadState(2);
          if (onSuccess) {
            file.nameUploaded = data.data;
            onSuccess(file);
          }
        } else {
          throw data.data;
        }
      })
      .catch((error) => {
        console.log(error);
        setUploadState(3);
        setError(error);
      });
  };

  const deleteFileName = () => {
    if (onSuccess) {
      onSuccess('');
    }
    setFilename('');
  }

  return (
    <span className='file-upload'>
      <input
          type='file'
          className='field-input'
          accept={format}
          multiple={multi ? true : false}
          onChange={(e) => {
            uploadFile(e.target.files);
          }}
        />
        {uploadState == 1 && <span className='loading'></span>}
        {uploadState == 2 && <span className='success'></span>}
        {uploadState == 3 && (
          <span className='error'>{error}</span>
        )}
        {filename && (
          <>
            <span className='fileupload-path'>{filename}</span>
            <a
              className='fileupload-delete'
              href='#'
              onClick={(e) => {
                e.preventDefault();
                deleteFileName();
              }}
            >
              <i className='far fa-trash-alt'></i>
            </a>
          </>
        )}
        <input
          name={name}
          type='hidden'
          value={filename}
        />
    </span>
  )
}

export default FileUpload;