import * as React from 'react';
import Moment from 'react-moment';

export default class Checkbox extends React.Component<{definition:any, validation:any, data:any, mode?:string},{}> {

constructor(props:any) {
      super(props);
      this.state = {};
    }


    render(){
        return (
            <div className={'field checkbox '+(this.props.definition.required?'required':'')+(this.props.validation=='1'?' result-required':'')}>
             <label>
                <input type="hidden" value="-1" name={this.props.definition.identifier} />
                <input type="checkbox" disabled={this.props.mode=='view'} id={this.props.definition.identifier} name={this.props.definition.identifier} defaultValue={this.props.data} />
                <div>{this.props.definition.name}</div>
               </label>
                <div className="field-description">{this.props.definition.description}</div>
            </div>
        )
    }
}
