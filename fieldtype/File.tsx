import * as React from 'react';
import Moment from 'react-moment';
import ReactTooltip from 'react-tooltip'
import FileUpload from '../FileUpload'

export default class File extends React.Component<{definition:any, validation:any, data:any},{}> {

constructor(props:any) {
      super(props);
      this.state = {};
    }

    render(){
        return (
            <div className={'field file'+(this.props.definition.required?'required':'')+(this.props.validation=='1'?' result-required':'')}>
                <label htmlFor={this.props.definition.identifier}>{this.props.definition.name}
                    {this.props.definition.description&&<i className="icon-info" data-tip={this.props.definition.description}></i>}
                :</label>
                <ReactTooltip effect="solid" place="right" clickable={true} multiline={true} delayHide={500} className="tip" />

                <FileUpload name={this.props.definition.identifier}
                                              service="content"
                                              format="*"
                                              value="" />
                <div className="field-description">{this.props.definition.description}</div>
            </div>
        )
    }
}
