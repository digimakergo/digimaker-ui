import * as React from 'react';
import Config from './config.json';

export default class LoadFields extends React.Component<{ type: string, validation: any }, { definition: any, components: {}, typeArr:string[] }> {

    constructor(props: any) {
        super(props);
        this.state = { definition: '', components: {}, typeArr:[]};
    }

    loadFieldtype(type) {
        const clientType = Config.fieldtypes[type];
        var com: any;
        import(`./fieldtype/${clientType}`)
            .then(component => {
                if (!this.state.components[clientType]) {
                    var coms = this.state.components;
                    coms[clientType] = component.default;
                    this.setState({ components: coms });
                }
            }
            )
            .catch(error => {
                console.error(`"${type}" not yet supported`);
            });
        return this.state.components[clientType]
    }


    //fetch fields definition
    fetchData() {
        fetch(Config.remote_server + '/contenttype/get/' + this.props.type.split('/')[0])
            .then(res => res.json())
            .then((data) => {
                this.setState({ definition: data, typeArr: this.props.type.split('/') });
            })
    }

    componentWillMount() {
        this.fetchData();
    }

    renderField(field: any) {
        if (field.children) {
            return (<div className={"field-container " + field.identifier}>
            <span className="container-title">{field.name}</span>
                {field.children.map( (field) => {
                     return (this.renderField( field ))
                })}
            </div>)
        }
        else {
            const typeStr = field.type;
            const fieldIdentifier = field.identifier;
            const validationResult = this.props.validation;
            const Fieldtype: React.ReactType = this.loadFieldtype(field.type);
            return Fieldtype ? <Fieldtype definition={field} validation={validationResult&&(fieldIdentifier in validationResult.fields)?validationResult[fieldIdentifier]:''} /> : field.type + ' is not supported.'
        }
    }

    render() {
        if (!this.state.definition) {
            return (<div className="loading"></div>)
        }
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
            fields = currentField.children;
        }
        return (
            <div>
                <div>
                    {fields.map((field) => {
                        return this.renderField(field)
                    })}
                </div>
            </div>
        )
    }
}
