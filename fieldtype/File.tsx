import * as React from 'react';
import Moment from 'react-moment';
import ReactTooltip from 'react-tooltip'

export default class File extends React.Component<{definition:any, validation:any, data:any},{uploadState: number, filename:string}> {

constructor(props:any) {
      super(props);
      this.state = {uploadState:0,filename: ''}; // 0 - default, 1 - uploading, 2 - uploaded, 3 - error
    }


    uploadFile(files){
      let data = new FormData();
      data.append( 'file', files[0] );
      this.setState({uploadState: 1});
      fetch(process.env.REACT_APP_REMOTE_URL + '/util/uploadfile', {
        method: 'POST',
        body: data
      }).then(
        response => response.text()
      ).then(
        text => this.setState( {filename: text, uploadState: 2 } )
      ).catch(
        (error) => {
          this.setState( {uploadState: 3 } );
          console.log(error);}
      );

    }

    render(){
        return (
            <div className={'field file'+(this.props.definition.required?'required':'')+(this.props.validation=='1'?' result-required':'')}>
                <label htmlFor={this.props.definition.identifier}>{this.props.definition.name}
                    {this.props.definition.description&&<i className="icon-info" data-tip={this.props.definition.description}></i>}
                :</label>
                <ReactTooltip effect="solid" place="right" clickable={true} multiline={true} delayHide={500} className="tip" />
                <div>
                  <input type="file" className="field-input" onChange={(e)=>{this.uploadFile(e.target.files)}}/>
                  {this.state.uploadState==1&&<div className="loading"></div>}
                  {this.state.uploadState==2&&<div>Success</div>}
                  {this.state.uploadState==3 &&<div>Error</div>}
                  <input type="hidden" id={this.props.definition.identifier} name={this.props.definition.identifier} defaultValue={this.props.data} value={this.state.filename} />
                </div>
                <div className="field-description">{this.props.definition.description}</div>
            </div>
        )
    }
}
