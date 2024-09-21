import * as React from 'react';
import Moment from 'react-moment';
import FileUpload from '../FileUpload'
import ReactTooltip from 'react-tooltip';
import util from '../util';
import { serverConfig } from '../serverConfig';

export default class Image extends React.Component<{definition:any, validation:any, mode: string, data:any},{data:any}> {

  constructor(props:any) {
      super(props);
      this.state = {data:props.data};
    }

    updated(data){
      this.setState({data:data.nameUploaded});
    }

    inline(){
      if(this.state.data){
        let thumbnailPath = this.state.data;
        if( !( thumbnailPath.startsWith('http://') || thumbnailPath.startsWith('https://') ) ){
           let vars = {...util._vars, 'imagepath':this.state.data}; 
           thumbnailPath =  util.washVariables(serverConfig.imageThumbnailUrl, vars);
        }
        return <img className="fieldtype-image-img" src={thumbnailPath} />;
      }else{
        return '';
      }
    }

    view(){
      return (<>
              <label className="field-label">{this.props.definition.name}: </label>
              <div className="field-value">
                  {this.inline()}
              </div></>)
    }

    edit(){
        return (
            <>
                <label className="field-label" htmlFor={this.props.definition.identifier}>{this.props.definition.name}
                    {this.props.definition.description&&<i className="icon-info" data-for={this.props.definition.identifier+'-desciption'} data-tip=""></i>}
                    {this.props.definition.description&&<ReactTooltip id={this.props.definition.identifier+'-desciption'} effect="solid" place="right" html={true} clickable={true} multiline={true} delayHide={500} className="tip">{this.props.definition.description}</ReactTooltip>}
                :</label>

                <div className="field-value">
                <FileUpload name={this.props.definition.identifier}
                                              service="content"
                                              format="image/*"
                                              value={this.state.data}
                                              onSuccess={(data)=>{this.updated(data)}} />
                {this.state.data&&<>
                  {(this.state.data==this.props.data) && this.inline()}
                  {(this.state.data!=this.props.data) && <img src={util.washVariables(serverConfig.imageUrl, {...util._vars, 'imagepath':this.state.data} )} /> }
                </>}
                </div>
            </>
        )
    }

    render(){
      if(this.props.mode=='view'){
          return this.view();
      }else if(this.props.mode=='inline'){
          return this.inline();
      }else{
          return this.edit();
      }
    }
}
