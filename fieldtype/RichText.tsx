import * as React from 'react';
import Moment from 'react-moment';
import Config from '../../config.json';

export default class RichText extends React.Component<{definition:any},{}> {

constructor(props:any) {
      super(props);
      this.state = {};
    }

render(){
    return (
        <div className={'field '+(this.props.definition.required?'required':'')}>
            <label htmlFor={this.props.definition.identifier}>{this.props.definition.name}:</label>
            <textarea id={this.props.definition.identifier} className="form-control" name={this.props.definition.identifier}></textarea>
        </div>
    )
}
}
