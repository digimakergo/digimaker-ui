import * as React from 'react';
import Moment from 'react-moment';

export default class Checkbox extends React.Component<{definition:any, beforeField:any, afterField:any, validation:any, data:any, mode?:string},{checked:boolean}> {

constructor(props:any) {
      super(props);
      this.state = {checked: this.props.data==1};
    }

    changeChecked(){
      this.setState({checked: !this.state.checked});
    }

    render(){
        const BeforeElement:React.ReactType = this.props.beforeField();
        const AfterElement:React.ReactType = this.props.afterField();
        return (
            <div className={'field checkbox '+this.props.mode+' '+(this.props.definition.required?'required':'')+(this.props.validation=='1'?' result-required':'')}>
              {BeforeElement}
             <label>
                {this.props.mode=='edit'&&!this.state.checked&&<input type="hidden" value="0" name={this.props.definition.identifier} />}
                <input type="checkbox" disabled={this.props.mode!='edit'}
                    id={this.props.definition.identifier}
                    name={this.props.definition.identifier}
                    value="1"
                    onChange={this.changeChecked.bind(this)}
                    defaultChecked={this.props.data==1} />
                <div>{this.props.definition.name}</div>
               </label>
                <div className="field-description">{this.props.definition.description}</div>
                {AfterElement}
            </div>
        )
    }
}
