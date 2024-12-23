import * as React from 'react';
import Moment from 'react-moment';
import ReactTooltip from 'react-tooltip';
import { FieldtypeProps } from '../FieldRegister';

export default class Number extends React.Component<FieldtypeProps,{selected:boolean}> {

constructor(props:any) {
      super(props);
      this.state = {selected:false};
    }

    view(){
      return (<>
              <label className="field-label">{this.props.definition.name}: </label>
              <div className="field-value"> {this.raw()}
              </div></>)
    }

    raw(){
      if( this.props.data=="1" ){
         return this.props.definition.parameters.options[0];
      }else if( this.props.data=="0" ){
        return this.props.definition.parameters.options[1];
      }
      return '';
    }

    componentDidMount() {
    if (this.props.data=="0"||this.props.data=="1") {
      this.setState({
          selected: true
      });
    }
  }

    onChange( e:any ){
      this.setState({selected: true});
    }

    edit(){
      const def = this.props.definition;
      const name = def.identifier;
      return (<>
              <label className="field-label" htmlFor={this.props.definition.identifier}>{this.props.definition.name}
                  {this.props.definition.description&&<i className="icon-info" data-for={this.props.definition.identifier+'-desciption'} data-tip=""></i>}
                  {this.props.definition.description&&<ReactTooltip id={this.props.definition.identifier+'-desciption'} effect="solid" place="right" html={true} clickable={true} multiline={true} delayHide={500} className="tip">{this.props.definition.description}</ReactTooltip>}
                  {this.props.afterLabel&&this.props.afterLabel(def, this.props.data)}
              :</label>
              <div className="field-value">
              {this.props.validation&&<div className="error">{this.props.validation}</div>}
                <label>
                  <input type="radio" defaultChecked={this.props.data=="1"} name={name} onChange={(e)=>this.onChange(e)} value="1" />
                  <span>{def.parameters.options[0]}</span></label>
                <label>
                  <input type="radio" defaultChecked={this.props.data=="0"} name={name} onChange={(e)=>this.onChange(e)} value="0" />
                  <span>{def.parameters.options[1]}</span>
                </label>
                {!this.state.selected&&
                  <input type="hidden" name={name} value="-1" />
                }
                </div>
            </>
      )
    }

    render(){
      if(this.props.mode=='view'){
          return this.view();
      }else if( this.props.mode=='edit' ){
          return this.edit();
      }else{
        return this.raw();
      }
    }
}
