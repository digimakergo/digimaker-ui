import * as React from 'react';
import Moment from 'react-moment';
import ReactTooltip from 'react-tooltip'
import FileUpload from '../FileUpload'

export default class File extends React.Component<{definition:any, validation:any, data:any, mode:string},{}> {

constructor(props:any) {
      super(props);
      this.state = {};
    }

    view(){
      return (<>
              <label className="field-label">{this.props.definition.name}: </label>
              <div className="field-value">{this.raw()}</div>
              </>)
    }

    raw(){
      return this.props.data;
    }

    edit(){
        let params = this.props.definition.parameters;      
        params = params?params:{};  
        return (
            <>
                <label className="field-label" htmlFor={this.props.definition.identifier}>{this.props.definition.name}
                    {this.props.definition.description&&<i className="icon-info" data-tip={this.props.definition.description}></i>}
                :</label>
                <ReactTooltip effect="solid" place="right" clickable={true} multiline={true} delayHide={500} className="tip" />

                <div className="field-value">
                <FileUpload name={this.props.definition.identifier}
                                              service="content"
                                              format={params.format?params.format:"*"}
                                              value={this.props.data} />
                </div>
            </>
        )
    }

    render(){
      if(this.props.mode=='view'){
          return this.view();
      }else if(this.props.mode=='edit'){
          return this.edit();
      }else{
        return this.raw();
      }
    }
}
