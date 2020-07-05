import * as React from 'react';
import Moment from 'react-moment';
import FileUpload from '../FileUpload'
import ReactTooltip from 'react-tooltip';

export default class Image extends React.Component<{definition:any, validation:any, mode: string, data:any},{data:any}> {

constructor(props:any) {
      super(props);
      this.state = {data:props.data};
    }

    updated(data){
      this.setState({data:data.nameUploaded});
    }

    inline(){
      return this.props.data?<img src={process.env.REACT_APP_ASSET_URL+"/"+this.state.data} />:'';
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
            <div className={(this.props.definition.required?'required':'')+(this.props.validation=='1'?' result-required':'')}>
                <label htmlFor={this.props.definition.identifier}>{this.props.definition.name}
                    {this.props.definition.description&&<i className="icon-info" data-for={this.props.definition.identifier+'-desciption'} data-tip=""></i>}
                    {this.props.definition.description&&<ReactTooltip id={this.props.definition.identifier+'-desciption'} effect="solid" place="right" html={true} clickable={true} multiline={true} delayHide={500} className="tip">{this.props.definition.description}</ReactTooltip>}
                :</label>

                <div className="edit-input">
                <FileUpload name={this.props.definition.identifier}
                                              service="content"
                                              format="image/*"
                                              value={this.props.data}
                                              onSuccess={(data)=>{this.updated(data)}} />
                {this.inline()}
                </div>
            </div>
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
