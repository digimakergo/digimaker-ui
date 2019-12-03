import * as React from 'react';
import Moment from 'react-moment';
import ReactTooltip from 'react-tooltip'


export default class RichText extends React.Component<{ definition: any, validation: any, beforeField:any, afterField: any, data: any, mode: string }, {}> {

  constructor(props: any) {
    super(props);
    this.state = {};
  }

  edit() {
    const BeforeElement:React.ReactType = this.props.beforeField();
    const AfterElement:React.ReactType = this.props.afterField();
    return (
      <div className={'field ' + (this.props.definition.required ? 'required' : '') + (this.props.validation == '1' ? ' result-required' : '')}>
        {BeforeElement}
        <label htmlFor={this.props.definition.identifier}>
          {this.props.definition.name}
          {this.props.definition.description && <i className="icon-info" data-tip={this.props.definition.description}></i>}
          : </label>
        <ReactTooltip effect="solid" place="right" clickable={true} multiline={true} delayHide={500} className="tip" />
        <textarea id={this.props.definition.identifier} className="form-control" name={this.props.definition.identifier} defaultValue={this.props.data}></textarea>
        {AfterElement}
      </div>
    )
  }

  view(){
    const BeforeElement:React.ReactType = this.props.beforeField();
    const AfterElement:React.ReactType = this.props.afterField();
    return (<div className={'view field ' + this.props.definition.type }>
            {BeforeElement}
              <label>{this.props.definition.name}: </label>
              <div className="field-value">{this.props.data&&this.props.data.Raw.replace(/\\n/g, "<br />")}</div>
            {AfterElement}
            </div>)
  }

  render() {
    if (this.props.mode == 'view') {
      return this.view();
    } else {
      return this.edit();
    }
  }
}
