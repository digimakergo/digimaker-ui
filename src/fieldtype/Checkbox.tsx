import * as React from 'react';
import Moment from 'react-moment';
import ReactTooltip from 'react-tooltip';
import { FieldtypeProps } from '../FieldRegister';

export default class Checkbox extends React.Component<FieldtypeProps,{checked:boolean}> {

constructor(props:any) {
      super(props);
      this.state = {checked: this.props.data==1};
    }

    changeChecked(){
      this.setState({checked: !this.state.checked});
    }

    edit(){
      return (
           <label>
              {!this.state.checked&&<input type="hidden" value="0" name={this.props.definition.identifier} />}
              <div className="field-label">{this.props.definition.name}
              {this.props.definition.description&&<i className="icon-info" data-for={this.props.definition.identifier+'-desciption'} data-tip=""></i>}</div>
              {this.props.definition.description&&<ReactTooltip id={this.props.definition.identifier+'-desciption'} effect="solid" place="right" html={true} clickable={true} multiline={true} delayHide={500} className="tip">{this.props.definition.description}</ReactTooltip>}
              {this.props.afterLabel&&this.props.afterLabel(this.props.definition, this.props.data)}
              <div className="field-value">
                <input type="checkbox"
                    id={this.props.definition.identifier}
                    name={this.props.definition.identifier}
                    value="1"
                    onChange={this.changeChecked.bind(this)}
                    defaultChecked={this.props.data==1} />
              </div>
             </label>
      )
    }

    view(){
      return  <><label className="field-label">{this.props.definition.name}</label>
                <div className="field-value"><input type="checkbox" disabled={true} defaultChecked={this.props.data==1} /></div>
              </>;
    }

    //todo: use yes/no/empty for this.
    raw(){
      return (
            <input type="checkbox" disabled={true}
                   value="1"
                   defaultChecked={this.props.data==1} />
      )
    }

    render(){
        if( this.props.mode == 'edit' ){
            return this.edit();
        }else if( this.props.mode == 'view' ){
            return this.view();
        }else{
          return this.raw();
        }
    }
}
