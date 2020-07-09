import * as React from 'react';
import tinymce from "tinymce";
import Moment from 'react-moment';
import ReactTooltip from 'react-tooltip'
import "tinymce/themes/modern";
import Fieldtype from '../fieldtype.json';
import "tinymce/plugins/table";
import "tinymce/plugins/image"
import "tinymce/plugins/code"
import "tinymce/plugins/media"
import "tinymce/plugins/preview"
import "tinymce/plugins/textcolor"


  var mode = Fieldtype.richtext.mode.standard

export default class RichText extends React.Component<{ definition: any, validation: any, data: any, mode: string }, {data:''}> {

  constructor(props: any) {
    super(props);
    this.state = {
      data:'',
    };
  }

  componentDidMount() {
    if(this.props.definition.parameters &&this.props.definition.parameters.mode)
    {
      mode= Fieldtype.richtext.mode[this.props.definition.parameters.mode];
    }
    else
    {
      mode=Fieldtype.richtext.mode.standard;
    }

    tinymce.init({
      menubar:false,
      toolbar: mode,
      selector: `textarea#`+this.props.definition.identifier,
      skin_url: `${process.env.PUBLIC_URL}/skins/lightgray`,
      plugins: Fieldtype.richtext.plugins,
      branding: false,
      setup: editor => {
        editor.on("keyup change", () => {
          const content = editor.getContent();
          console.log(content);
          this.setState({data:content})
        });

        editor.on("init", () => {
          editor.setContent(this.props.data);
        });
      },
    });
    this.setState({data:this.props.data});
  }

  componentWillUnmount() {
    tinymce.remove(`textarea#`+this.props.definition.identifier);
  }

  edit() {
    return (<>
        <label className="field-label" htmlFor={this.props.definition.identifier}>
          {this.props.definition.name}
          {this.props.definition.description && <i className="icon-info" data-for={this.props.definition.identifier+'-desciption'} data-tip=""></i>}
          {this.props.definition.description&&<ReactTooltip id={this.props.definition.identifier+'-desciption'} effect="solid" place="right" html={true} clickable={true} multiline={true} delayHide={500} className="tip">{this.props.definition.description}</ReactTooltip>}
          : </label>
          <textarea id={this.props.definition.identifier} className="field-value form-control" name={this.props.definition.identifier} value={this.state.data}></textarea>
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
