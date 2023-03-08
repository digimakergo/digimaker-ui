import * as React from 'react';
import ReactTooltip from 'react-tooltip';
import { Editor } from '@tinymce/tinymce-react';
import fieldtypeSettings from '../fieldtype_settings.json';

var toolbars = fieldtypeSettings.richtext.mode.standard

export default class RichText extends React.Component<{ definition: any, validation: any, data: any, mode: string }, {data:any}> {


  private editorRef;

  constructor(props: any) {
    super(props);
    this.editorRef = React.createRef();
    this.state = {
      data:'',
    };
  }

  componentDidMount() {
    if(this.props.definition.parameters &&this.props.definition.parameters.mode)
    {
      toolbars= fieldtypeSettings.richtext.mode[this.props.definition.parameters.mode];
    }
    else
    {
      toolbars=fieldtypeSettings.richtext.mode.standard;
    }

    this.setState({data:this.props.data});
  }

  edit() {
    return (<>
        <label className="field-label" htmlFor={this.props.definition.identifier}>
          {this.props.definition.name}
          {this.props.definition.description && <i className="icon-info" data-for={this.props.definition.identifier+'-desciption'} data-tip=""></i>}
          {this.props.definition.description&&<ReactTooltip id={this.props.definition.identifier+'-desciption'} effect="solid" place="right" html={true} clickable={true} multiline={true} delayHide={500} className="tip">{this.props.definition.description}</ReactTooltip>}
          : </label>
          <Editor
            initialValue={this.props.data}                   
            onChange={(e, editor)=>this.setState({data:editor.getContent()})}
            init={{
              menubar: false,
              relative_urls: false,
              height:'300px',
              plugins: fieldtypeSettings.richtext.plugins,
              external_plugins: {
                    'dmimage': process.env.PUBLIC_URL+'/tinymce/dmimage.min.js',
              },
              branding: false,           
              toolbar: toolbars,
              content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
            }}
          />
          <textarea readOnly={true} style={{display:'none'}} id={this.props.definition.identifier} className="field-value form-control" name={this.props.definition.identifier} value={this.state.data}></textarea>
          </>
    )
  }

  view(){
    return (  <>
              <label className="field-label">{this.props.definition.name}: </label>
              <div className="field-value">{this.raw()}</div>
              </>
            )
  }

  raw(){
    return <div dangerouslySetInnerHTML={{__html: this.props.data}} />
  }

  render() {
    if (this.props.mode == 'view') {
      return this.view();
    } else if( this.props.mode == 'edit'){
      return this.edit();
    }else{
      return this.raw();
    }
  }
}
