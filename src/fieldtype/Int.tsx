import * as React from 'react';
import Moment from 'react-moment';
import ReactTooltip from 'react-tooltip';
import { FieldtypeProps } from '../FieldRegister';

export default class Int extends React.Component<FieldtypeProps,{value:string}> {

constructor(props:any) {
      super(props);
      this.state = {value:''};
    }

    view(){
      return (<>
              <label className="field-label">{this.props.definition.name}: </label>
              <div className="field-value">{this.state.value}</div>
              </>)
    }

    raw(){
      return this.state.value;
    }

    componentDidMount() {
      if (this.props.data) {
        let data = this.props.data;
        if( data == -1 ){
          data = '';
        }
        this.setState({ value: data });
      }
    }

    onChange = (e: any) => {
        let value:any = parseInt(e.target.value);
        if( isNaN( value ) ){
          value = "";
        }
        this.setState({ value: ""+value });

    }

    edit(){
      const def = this.props.definition;
      const name = def.identifier;
      return (<>
              <label className="field-label" htmlFor={this.props.definition.identifier}>{this.props.definition.name}
                  {this.props.definition.description&&<i className="icon-info" data-for={this.props.definition.identifier+'-desciption'} data-tip=''></i>}
                  {this.props.definition.description&&<ReactTooltip id={this.props.definition.identifier+'-desciption'} effect="solid" place="right" html={true} clickable={true} multiline={true} delayHide={500} className="tip">{this.props.definition.description}</ReactTooltip>}
                  {this.props.afterLabel&&this.props.afterLabel(def, this.props.data)}
              :</label>
              {this.props.validation&&<div className="error">{this.props.validation}</div>}
              <input type="text" value={this.state.value} onChange={(e)=>this.onChange(e)} id={this.props.definition.identifier} className="field-value form-control" name={this.props.definition.identifier} />
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
