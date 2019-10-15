import * as React from 'react';
import Moment from 'react-moment';
import ReactTooltip from 'react-tooltip'


export default class RichText extends React.Component<{definition:any, validation:any, data:any},{}> {

constructor(props:any) {
      super(props);
      this.state = {};
    }

render(){
    return (
        <div className={'field '+(this.props.definition.required?'required':'')+(this.props.validation=='1'?' result-required':'')}>
            <label htmlFor={this.props.definition.identifier}>
            {this.props.definition.name}
            {this.props.definition.description&&<i className="icon-info" data-tip={this.props.definition.description}></i>}
            : </label>
            <ReactTooltip effect="solid" place="right" clickable={true} multiline={true} delayHide={500} className="tip" />
            <textarea id={this.props.definition.identifier} className="form-control" name={this.props.definition.identifier}></textarea>
        </div>
    )
}
}
