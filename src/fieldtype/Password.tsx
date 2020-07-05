import * as React from 'react';

export default class Password extends React.Component<{ definition: any, validation: any, data: any, formdata: any, mode: string }, {input:any, error: string}> {

  constructor(props: any) {
    super(props);
    this.state = {input:['', ''], error: ''};
  }

  input(e){
    let value = e.target.value;
    let input = this.state.input;
    input[0] = value;
    let error = '';
    if( input[1] != "" && input[0] != input[1]){
      error = "does not match";
    }
    this.setState({input: input, error: error});
  }

  repeatInput(e){
    let value = e.target.value;
    let input = this.state.input;
    input[1] = value;
    let error = '';
    if( input[1] != "" && input[0] != input[1]){
      error = "does not match";
    }
    this.setState({input: input, error: error});
  }

  render() {
    if( this.props.mode =='view' || this.props.mode =='inline' ){
      return '';
    }
    let def = this.props.definition;
    return (<>
          <label className="field-label">{def.name}</label>
          <div className="field-value">
          {def.description&&<div className="field-desc">{def.description}</div>}
          {this.props.validation&&<div className="block alert alert-warning">{this.props.validation}</div>}
          <input type="password" className="form-control" value={this.state.input[0]} onChange={(e)=>{this.input(e)}} />
          {this.state.error==''&&this.state.input[0]!=''&&<input type="hidden" name={def.identifier} value={this.state.input[0]} />}
          <label>Password repeat</label>
          <input type="password"  className="form-control" value={this.state.input[1]} onChange={(e)=>{this.repeatInput(e)}} />
          {this.state.error&&<div className="error">{this.state.error}</div>}
          </div>
         </>);
  }
}
