import * as React from 'react';
import tinymce from "tinymce";
import Moment from 'react-moment';
import ReactTooltip from 'react-tooltip'

var defaultToolbar=  'undo redo | formatselect | bold italic textcolor | \
  alignleft aligncenter alignright alignjustify | \
  bullist numlist outdent indent  | image charmap media | insertdatetime table paste | code preview print importcss | removeformat';

  var defaultPlugin = [
    'advlist autolink lists charmap print preview anchor',
    'searchreplace visualblocks code fullscreen textcolor',
    'insertdatetime media table paste code importcss'
  ];

export default class RichText extends React.Component<{ definition: any, validation: any, beforeField:any, afterField: any, data: any, mode: string }, {data:''}> {

    
  constructor(props: any) {
    super(props);
    this.state = {data:''};
  }

  

  componentDidMount() {
    
    this.setState({data:this.props.data});

    if(this.props.definition == null){
      defaultToolbar = ''
    }
    
    tinymce.init({
      menubar:false,
      // toolbar: defaultToolbar,
      selector: `textarea`,
      skin_url: `${process.env.PUBLIC_URL}/skins/lightgray`,
      // plugins: defaultPlugin,
      setup: editor => {
        editor.on("keyup change", () => {
          const content = editor.getContent();
          console.log(content);
          this.setState({data:content})
        });
      },
    });
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
              
            <textarea id={this.props.definition.identifier} className="form-control" name={this.props.definition.identifier} value={this.state.data} defaultValue={this.props.data}></textarea>

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
