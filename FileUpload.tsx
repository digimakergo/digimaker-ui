import * as React from 'react';

export default class FileUpload extends React.Component<{name: string, service:string, format:string, value:string, multi?:boolean, onSuccess?:any},{uploadState:number, filename:string, error:string}> {

constructor(props:any) {
      super(props);
      this.state = {uploadState:0,filename: '', error: ''}; // 0 - default, 1 - uploading, 2 - uploaded, 3 - error
    }


    uploadFile(files:any){
      let data = new FormData();
      //todo: support multiple.
      let file = files[0];
      data.append( 'file', file );
      this.setState({uploadState: 1});
      fetch(process.env.REACT_APP_REMOTE_URL + '/util/uploadfile?service='+this.props.service, {
        method: 'POST',
        body: data
      }).then(
        //todo: use json if succeeds.
        response => response.text()
      ).then(
        (text) => {
          this.setState( {filename: text, uploadState: 2 } );
          if( this.props.onSuccess ){
            file.nameUploaded = text;
            this.props.onSuccess(file);
          }
        }
      ).catch(
        (error) => {
          this.setState( {uploadState: 3, error: error } );
        }
      );
    }

    render(){
        return (
              <span className="file-upload">
                  <input type="file" className="field-input" accept={this.props.format} multiple={this.props.multi?true:false} onChange={(e)=>{this.uploadFile(e.target.files)}}/>
                  {this.state.uploadState==1&&<span className="loading"></span>}
                  {this.state.uploadState==2&&<span className="success"></span>}
                  {this.state.uploadState==3&&<span className="error">{this.state.error}</span>}
                  <input name={this.props.name} type="hidden" value={this.state.filename} defaultValue={this.props.value} />
             </span>
        )
    }
}
