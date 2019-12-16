import * as React from 'react';
import Moment from 'react-moment';
import ReactTooltip from 'react-tooltip';

export default class Number extends React.Component<{definition:any, validation:any, beforeField:any, afterField:any, data:any, mode:string},{value:string}> {

constructor(props:any) {
      super(props);
      this.state = {value:''};
    }

    view(){
      const BeforeElement:React.ReactType = this.props.beforeField();
      const AfterElement:React.ReactType = this.props.afterField();
      return (<div className={'view field ' + this.props.definition.type }>
              {BeforeElement}
              <label>{this.props.definition.name}: </label>
              <div className="field-value">{this.props.data&&this.props.data.Raw}</div>
              {AfterElement}
              </div>)
    }

    componentDidMount() {
      if (this.props.data) {
        this.setState({ value: this.props.data });
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
      const BeforeElement:React.ReactType = this.props.beforeField();
      const AfterElement:React.ReactType = this.props.afterField();
      const def = this.props.definition;
      const name = def.identifier;
      console.log('number');
      console.log( this.props.data );
      return (
          <div className={'edit field '+def.type+ ' '+(this.props.definition.required?'required':'')+(this.props.validation=='1'?' result-required':'')}>
              {BeforeElement}
              <label htmlFor={this.props.definition.identifier}>{this.props.definition.name}
                  {this.props.definition.description&&<i className="icon-info" data-for={this.props.definition.identifier+'-desciption'} data-tip=''></i>}
                  {this.props.definition.description&&<ReactTooltip id={this.props.definition.identifier+'-desciption'} effect="solid" place="right" html={true} clickable={true} multiline={true} delayHide={500} className="tip">{this.props.definition.description}</ReactTooltip>}
              :</label>
              {this.props.validation&&<div className="error">{this.props.validation}</div>}
              <input type="text" value={this.state.value} onChange={(e)=>this.onChange(e)} id={this.props.definition.identifier} className="form-control" name={this.props.definition.identifier} />
              {AfterElement}
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
