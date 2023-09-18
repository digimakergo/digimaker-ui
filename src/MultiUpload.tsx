import React from 'react';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { FetchWithAuth } from './util';

export interface FileUploadProps {
  /** Form field name, similar to input name attribute */
  name: string;
  /** Service, eg. content */
  service: string;

  /** Accept format by browser, eg. image/\* or png,jpg. Check file input 'accept' in html */
  format: string;

  /** Default value, eg. file relative path */
  value: any;

  /** support multi select */
  multi?: boolean;

  /** success callback. fileInfo{nameUploaded - uploaded name} object as parameter */
  onSuccess?: any;
  onSubmit?:any;
  parent?:any;
  afterAction?:any
}

const MultiUpload = ({name, service, format, value, multi, onSuccess,onSubmit,parent,afterAction}: FileUploadProps) => {
  const [uploadState, setUploadState] = useState(0);
  const [filename, setFilename] = useState(value?value.map(file=>file.nameUploaded):[]);
  const [uploadFiles, setUploadFiles] = useState(value?value:[])
  const [error, setError] = useState('');

  useEffect(() => {
      setUploadFiles((value??'')==''?[]:(value.length>0?value:[]));
      setFilename((value??'')==''?[]:(value.length>0?value.map(file=>file.nameUploaded):[]));
  }, [value]);

  const fileUploadBtn = ()=>{
    let btn=document.getElementById('fieldInput');
    btn.click()
  }

  const uploadFile = (files: any) => {
    setFilename([])
    let newUploadFiles=[];
    setUploadFiles([])
    if (files.length == 0) {
      return;
    }
    let proms:Array<Promise<any>> = [];
    for (let i=0;i<files.length;i++){
      let data = new FormData();
      let file = files[i];
      data.append('file', file);
      setUploadState(1);
      file.uploadState=1;
      let p = new Promise((resolve, reject)=>{
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
            // 
            file.nameUploaded = data.data;
            file.uploadState=2;
            resolve(file)
          } else {
            throw data.data;
          }
        })
        .catch((error) => {
          file.uploadState=3;
          file.error=error;
          setUploadState(3);
          // setError(error);
          reject(file)
        });
      })
      proms=[...proms,p];

    }

    Promise.all(proms).then((res)=>{
      setUploadState(2);
      setUploadFiles(res)
      setFilename(res.map(file=>file.nameUploaded));
      if (onSuccess){
        onSuccess(res);
      }
    })
    
  };

  const deleteFileName = (index?:any) => {
    if(index>-1){
      let newUploadFiles=[...uploadFiles];
      newUploadFiles.splice(index,1);
      setUploadFiles([...newUploadFiles]);

      let newFilename=[...filename];
      newFilename.splice(index,1);
      setFilename([...newFilename]);
      if (onSuccess) {
        onSuccess(newUploadFiles);
      }
    }else{
      if (onSuccess) {
        setUploadFiles([]);
        onSuccess([]);
      }
      setFilename([]);
    }
    
  }

  const submitfile = ()=>{
    if(onSubmit){
      onSubmit('1')
    }
    let files=[...uploadFiles];
    let proms:Array<Promise<any>> = [];
    for (let i=0;i<files.length;i++){
      let p = new Promise((resolve, reject)=>{
        let dataObject={'name': files[i].name.split('.')[0], 'image': files[i].nameUploaded}
        FetchWithAuth(`${process.env.REACT_APP_REMOTE_URL}/content/create/image/${parent||461}`, {
          method: 'POST',
          body: JSON.stringify(dataObject),
        }).then((data) => {
            if (data.error===false) {
              resolve(data)
            } else {
              reject(data)
            }
        });
      })
      proms=[...proms,p];
    }
    Promise.all(proms).then((res)=>{
      if(onSubmit){
        onSubmit('2')
      }
      if(afterAction){
        afterAction(1)
      }
    }).catch((err)=>{
      console.log(err)
    })
  }

  return (
    <div className='file-upload'>
      <button className='btn btn-light' onClick={fileUploadBtn}>Select files</button>
      <input
          id="fieldInput"
          type='file'
          className='field-input'
          accept={format}
          multiple={multi ? true : false}
          onChange={(e) => {
            uploadFile(e.target.files);
          }}
          style={{opacity:0}}
        />
      {uploadState == 1 && <span className='loading'></span>}
      {uploadFiles.length>0&&
       <table>
          {uploadFiles.map((file,index)=>{
            return <tr key={file.name+file.nameUploaded}>
                <td>{file.name}</td>
                <td>
                {file.uploadState == 1 && <span className='loading'></span>}
                {file.uploadState == 2 && <span className='success'></span>}
                {file.uploadState == 3 && (
                  <span className='error'>{error}</span>
                )}
                    <span className='fileupload-path'>{file.nameUploaded}</span>
                    <a
                      className='fileupload-delete'
                      href='#'
                      onClick={(e) => {
                        e.preventDefault();
                        deleteFileName(index);
                      }}
                    >
                      <i className='far fa-trash-alt'></i>
                    </a>
                 
                
                </td>
            </tr>
          })}
       </table>
      }
        <input
          name={name}
          type='hidden'
          value={filename}
        />
        {uploadFiles.length>0&&<Button onClick={() => submitfile()} variant="primary" size="sm"><i className="fas fa-check-circle"></i> Submit</Button>}
    </div>
  )
};

export default MultiUpload;