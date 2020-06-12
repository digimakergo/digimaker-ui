import * as React from 'react';
import tinymce from "tinymce";
import Moment from 'react-moment';
import ReactTooltip from 'react-tooltip'
import { Editor } from '@tinymce/tinymce-react';

export default class RichText extends React.Component<{ definition: any, validation: any, beforeField:any, afterField: any, data: any, mode: string }, {}> {

  constructor(props: any) {
    super(props);
    this.state = {};
  }

  handleEditorChange = (content, editor) => {
    console.log('Content was updated:', content);
    this.setState({data:content})
  }

  edit() {
    const BeforeElement:React.ReactType = this.props.beforeField();
    const AfterElement:React.ReactType = this.props.afterField();
    return (
      <div className={'edit field '+this.props.definition.type+ ' ' + (this.props.definition.required ? 'required' : '') + (this.props.validation == '1' ? ' result-required' : '')}>
        {BeforeElement}
        <label htmlFor={this.props.definition.identifier}>
          {this.props.definition.name}
          {this.props.definition.description && <i className="icon-info" data-for={this.props.definition.identifier+'-desciption'} data-tip=""></i>}
          {this.props.definition.description&&<ReactTooltip id={this.props.definition.identifier+'-desciption'} effect="solid" place="right" html={true} clickable={true} multiline={true} delayHide={500} className="tip">{this.props.definition.description}</ReactTooltip>}
          : </label>

          <Editor
              value={this.props.data}
              init={{
                menubar: false,
                branding: false,
                plugins: [
                  'advlist autolink lists link image charmap print preview anchor',
                  'searchreplace visualblocks code fullscreen',
                  'insertdatetime media table paste code'
                ],
                toolbar:
                  'undo redo | formatselect | bold italic backcolor | \
                  alignleft aligncenter alignright alignjustify | \
                  bullist numlist outdent indent | removeformat | help'
              }}
              onEditorChange={this.handleEditorChange}> 
                <textarea id={this.props.definition.identifier} className="form-control" name={this.props.definition.identifier} defaultValue={this.props.data}></textarea>
          </Editor>
        {AfterElement}
      </div>
    )
  }

  view(){
    const BeforeElement:React.ReactType = this.props.beforeField();
    const AfterElement:React.ReactType = this.props.afterField();
    return (
            <div className={'view field ' + this.props.definition.type}>
            {BeforeElement}
              <label>{this.props.definition.name}: </label>
              <div className="field-value">{this.props.data}</div>
            {AfterElement}
            </div>
            )
  }

  render() {
    if (this.props.mode == 'view') {
      return this.view();
    } else {
      return this.edit();
    }
  }
}
