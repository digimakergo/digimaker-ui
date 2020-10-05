import './digimaker-ui.css';

import * as React from 'react';
import FieldRegister from './FieldRegister';
import ReactTooltip from 'react-tooltip';

export default class LoadFields extends React.Component<{ type: string, validation: any,  data: any, editFields?:any, language?:string, mode?:string, beforeField?:any, afterField?:any, onChange?:void }, { definition: any, typeArr:string[] }> {

    constructor(props: any) {
        super(props);
        this.state = { definition: '', typeArr:[]};
    }


    //fetch fields definition
    fetchData() {
        console.log( "remote:" + process.env.REACT_APP_REMOTE_URL  );
        let languageParams = this.props.language?'?language='+this.props.language:'';
        fetch(process.env.REACT_APP_REMOTE_URL + '/contenttype/get/' + this.props.type.split('/')[0]+languageParams)
            .then(res => res.json())
            .then((data) => {
                console.log( 'fetched data:' );
                console.log( data );
                this.setState({ definition: data, typeArr: this.props.type.split('/') });
            })
    }

    componentDidUpdate(prevProps){
      //todo: fix why it sends twice
        if( prevProps.language != this.props.language ){
            this.fetchData();
        }
    }

    fold(e){
      e.preventDefault();
      var target = e.target;
      if( target.classList.contains( 'container-close' ) ){
          target.classList.remove('container-close');
      }else{
          target.classList.add('container-close');
      }
      console.log(target.classList);
    }

    componentDidMount() {
        this.fetchData();
    }

    renderField(field: any,containerLevel:number=1) {
        if (field.children) {
            return (<div key={field.identifier} className={`field-container level${containerLevel} field-${field.identifier}`}>
            <div className="container-title" onClick={(e)=>this.fold(e)}>
              {this.props.beforeField&&this.props.beforeField(field, this.props.data, null)}
              <a href="#" className="closable">
                <i className="fas fa-chevron-down"></i>
              </a><span>{field.name}</span>
              {field.description&&<i className="icon-info" data-for={field.identifier+'-description'} data-tip="" />}
              {field.description&&<ReactTooltip id={field.identifier+'-description'} effect="solid" place="right" html={true} clickable={true} multiline={true} delayHide={500} className="tip">{field.description}</ReactTooltip>}
              {this.props.afterField&&this.props.afterField(field, this.props.data, null)}
              </div>
              <div className="children">
                {field.children.map( (child) => {
                     return (<React.Fragment key={child.identifier}>this.renderField( child, containerLevel+1 )</React.Fragment>)
                })}
              </div>
            </div>)
        }
        else {
            const typeStr = field.type;
            const fieldIdentifier = field.identifier;
            const validationResult = this.props.validation;

            const Fieldtype: React.ReactType = FieldRegister.getFieldtype(typeStr);
            if( Fieldtype){
              const BeforeElement:React.ReactType = this.props.beforeField?this.props.beforeField():null;
              const AfterElement:React.ReactType = this.props.afterField?this.props.afterField():null;
              let required = false;
              if( field.required && this.props.mode == 'edit' ){
                required = true;
              }

              let resultRequired = false;
              let errorMessage = '';
              let validationPassed = true;
              if( this.props.mode == 'edit' && validationResult && validationResult.fields && validationResult.fields[fieldIdentifier] ){
                if( validationResult.fields[fieldIdentifier] == "1" ){
                  resultRequired = true;
                }else{
                  errorMessage = validationResult.fields[fieldIdentifier];
                }
                if(resultRequired || errorMessage){
                  validationPassed = false;
                }
              };
              let mode = this.props.mode;
              if( mode == 'edit' ){
                if( this.props.editFields && !this.props.editFields.includes(fieldIdentifier) )
                {
                      mode = 'view';
                }
              }
              return <>
              {BeforeElement}
              <div className={"field-id-"+field.identifier+" field-mode-"+mode+" fieldtype-"+typeStr + (required?" required":"") + (validationPassed?'':' field-validation-failed') + (resultRequired?" field-validation-required":" ")}>
              <Fieldtype definition={field}
                         data={this.props.data&&this.props.data[fieldIdentifier]}
                         formdata = {this.props.data}
                         contenttype = {this.props.type}
                         validation={validationResult&&(fieldIdentifier in validationResult.fields)?validationResult.fields[fieldIdentifier]:''}
                         formValidation={validationResult}
                         mode = {mode}
                          />
              {AfterElement}
              {errorMessage&&<div className="validation-failed-field-error">{errorMessage}</div>}
              </div>
                          </>;
            }else{
                return field.type + ' is not supported.';
            }
        }
    }

    render() {
        if (!this.state.definition) {
            return (<div className="loading"></div>)
        }
        let parent:any = '';
        var fields = this.state.definition.fields
        if(this.state.typeArr.length>1)
        {
            var identifier: string;
            identifier = this.state.typeArr[1];
            var currentField;
            fields.map((field)=>{
                if( field.identifier == identifier ){
                    currentField = field;
                }
            })
            if( !currentField ){
                return (<div>{identifier} not found</div>)
            }
            parent = currentField;
            fields = currentField.children;
        }
        return (
            <>
                {parent&&<div className="fields-parent">
                  {parent.parameters&&parent.parameters.fullname&&
                    <div className="field-title">{parent.parameters.fullname}
                    {parent.description&&<i className="icon-info" data-for={parent.identifier+'-description'} data-tip=""></i>}
                    {parent.description&&<ReactTooltip id={parent.identifier+'-description'} effect="solid" place="right" html={true} clickable={true} multiline={true} delayHide={500} className="tip">{parent.description}</ReactTooltip>}
                  </div>}
                  </div>}
                <div className={"content-fields content-fields-"+this.props.mode}>
                    {this.props.validation&&this.props.validation.message&&<div className="validation-failed validation-failed-error">this.props.validation.message</div>}
                    {fields.map((field) => {
                        return <React.Fragment key={field.identifier}>{this.renderField(field)}</React.Fragment>
                    })}
                </div>
            </>
        )
    }
}
