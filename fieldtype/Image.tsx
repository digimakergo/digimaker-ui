import * as React from 'react';
import Moment from 'react-moment';
import FileUpload from '../FileUpload'

export default class Image extends React.Component<{definition:any, validation:any, mode: string, data:any},{}> {

constructor(props:any) {
      super(props);
      this.state = {};
    }

    view(){
      return (<div className={'view field ' + this.props.definition.type }>
              <label>{this.props.definition.name}: </label>
              <div className="field-value">{this.props.data&&this.props.data.Raw}</div>
              </div>)
    }

    edit(){
        return (
            <div className={'field image'+(this.props.definition.required?'required':'')+(this.props.validation=='1'?' result-required':'')}>
                <label htmlFor={this.props.definition.identifier}>{this.props.definition.name}
                    {this.props.definition.description&&<i className="icon-info" data-tip={this.props.definition.description}></i>}
                :</label>

                <FileUpload name={this.props.definition.identifier}
                                              service="content"
                                              format="png,jpg,gif"
                                              value={this.props.data} />
                <div className="field-description">{this.props.definition.description}</div>
            </div>
        )
    }

    render(){
      if(this.props.mode=='view'){
          return this.view();
      }else{
          return this.edit();
      }
    }
}
