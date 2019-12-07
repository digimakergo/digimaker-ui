import * as React from 'react';
import FieldRegister from './FieldRegister';

export default class LoadFields extends React.Component<{ type: string, validation: any, data: any, mode?:string, beforeField?:any, afterField?:any, onChange?:void }, { definition: any, typeArr:string[] }> {

    constructor(props: any) {
        super(props);
        this.state = { definition: '', typeArr:[]};
    }


    //fetch fields definition
    fetchData() {
        console.log( "remote:" + process.env.REACT_APP_REMOTE_URL  );
        fetch(process.env.REACT_APP_REMOTE_URL + '/contenttype/get/' + this.props.type.split('/')[0])
            .then(res => res.json())
            .then((data) => {
                console.log( 'fetched data:' );
                console.log( data );
                this.setState({ definition: data, typeArr: this.props.type.split('/') });
            })
    }

    componentDidMount() {
        this.fetchData();
    }

    renderField(field: any,containerLevel:number=1) {
        if (field.children) {
            return (<div className={`field-container level${containerLevel} ${field.identifier}`}>
            <div className="container-title">
              <a href="#" className="closable">
                <i className="fas fa-chevron-down"></i>
              </a><span>{field.name}</span>{field.description&&<i className="icon-info" data-tip={field.description} />}</div>
                {field.children.map( (child) => {
                     return (this.renderField( child, containerLevel+1 ))
                })}
            </div>)
        }
        else {
            const typeStr = field.type;
            const fieldIdentifier = field.identifier;
            const validationResult = this.props.validation;

            const Fieldtype: React.ReactType = FieldRegister.getFieldtype(typeStr);

            return Fieldtype ? <Fieldtype definition={field}
                                          data={this.props.data&&this.props.data[fieldIdentifier]}
                                          formdata = {this.props.data}
                                          validation={validationResult&&(fieldIdentifier in validationResult.fields)?validationResult.fields[fieldIdentifier]:''}
                                          mode = {this.props.mode}
                                          beforeField={()=>this.props.beforeField&&this.props.beforeField(field, this.props.data, validationResult)}
                                          afterField={()=>this.props.afterField&&this.props.afterField(field, this.props.data, validationResult)}
                                           />
                                : field.type + ' is not supported.'
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
            <div>
                {parent&&<div className="fields-parent">
                  {parent.parameters&&parent.parameters.fullname&&

                    <div className="field-title">{parent.parameters.fullname}
                    {parent.description&&<i className="icon-info" data-tip={parent.description}></i>}
                  </div>}

                  </div>}
                <div>
                    {fields.map((field) => {
                        return this.renderField(field)
                    })}
                </div>
            </div>
        )
    }
}
