import * as React from 'react';

export default class FileUpload extends React.Component<{name: string, service:string, format:string, value:string, multi?:boolean, onSuccess?:any},{uploadState:number, filename:string, error:string}> {

constructor(props:any) {
      super(props);
      this.state = {uploadState:0,filename: '', error: ''}; // 0 - default, 1 - uploading, 2 - uploaded, 3 - error
    }

    componentDidMount(){
      this.setState( {filename:this.props.value} );
    }

    componentDidUpdate(prevProps:any){
      if( this.props.value != prevProps.value ){
        this.setState( {filename:this.props.value} );
      }
    }

    uploadFile(files:any){
      let data = new FormData();
      //todo: support multiple.
      if( files.length == 0 ){
        return;
      }
      let file = files[0];
      data.append( 'file', file );
      this.setState({uploadState: 1});
      fetch(process.env.REACT_APP_REMOTE_URL + '/util/uploadfile?service='+this.props.service, {
        method: 'POST',
        body: data
      }).then((response)=>{
        if (!response.ok) {
            throw response.statusText;
        }
        return response.json()
      })
      .then(
        (data) => {
          if( data.error === false ){
            this.setState( {filename: data.data, uploadState: 2 } );
            if( this.props.onSuccess ){
              file.nameUploaded = data.data;
              this.props.onSuccess(file);
            }
          }else{
            throw data.data;
          }          
        }
      ).catch(
        (error) => {
          console.log(error);
          this.setState( {uploadState: 3, error: error } );
        }
      );
    }


    delete(){
      if( this.props.onSuccess ){
          this.props.onSuccess('');
      }
      this.setState({filename:''});
    }

    render(){
        return (
              <span className="file-upload">
                  <input type="file" className="field-input" accept={this.props.format} multiple={this.props.multi?true:false} onChange={(e)=>{this.uploadFile(e.target.files)}}/>
                  {this.state.uploadState==1&&<span className="loading"></span>}
                  {this.state.uploadState==2&&<span className="success"></span>}
                  {this.state.uploadState==3&&<span className="error">{this.state.error}</span>}
                  {this.state.filename&&<><span className="fileupload-path">{this.state.filename}</span><a className="fileupload-delete" href="#" onClick={(e)=>{e.preventDefault();this.delete();}}><i className="far fa-trash-alt"></i></a></>}
                  <input name={this.props.name} type="hidden" value={this.state.filename} />
             </span>
        )
    }
}
