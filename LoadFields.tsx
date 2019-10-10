import * as React from 'react';
import Config from './config.json';

export default class LoadFields extends React.Component<{type:string},{definition: any,components: {}}> {

constructor(props:any) {
      super(props);
      this.state = {definition: '', components: {}};
    }

    loadFieldtype(type) {
        var com: any;
        import(`./fieldtype/${type}`)
            .then(component => {
                console.log(`${type} is loaded`);
                if (!this.state.components[type]) {
                    var coms = this.state.components;
                    coms[type] = component.default;
                    this.setState({ components: coms });
                }
            }
            )
            .catch(error => {
                console.error(`"${type}" not yet supported`);
            });
    }


    fetchData() {
        fetch(Config.remote_server + '/contenttype/get/'+this.props.type)
            .then(res => res.json())
            .then((data) => {
                this.setState({ definition: data });
                for (let identifier in this.state.definition.fields) {
                    var fieldtype = this.state.definition.fields[identifier].type;
                    const type = Config.fieldtypes[fieldtype];
                    if (type) {
                        this.loadFieldtype(type);
                    }
                    else {
                        console.warn("field type" + fieldtype + " is not defined. Please define it in config.json");
                    }
                }
            })
    }

    componentWillMount() {
        this.fetchData();
    }

    renderField( field: string ){
        const fieldDef = this.state.definition.fields[field];
        if( fieldDef.is_container )
        {
            return (<div className={"field-container "+field}><span className="container-title">{fieldDef.name}</span> {fieldDef.parameters.children.map((subfield)=>{
                return this.renderField( subfield )
            })}</div>)
        }
        else
        {
            const typeStr = fieldDef.type;
            const Fieldtype: React.ReactType = this.state.components[Config.fieldtypes[typeStr]];
            return Fieldtype ? <Fieldtype identifier={field} definition={this.state.definition.fields[field]} /> : field+' is not supported.'            
        }
    }

    render(){
        return (
            <div>
            <div>
                {this.state.definition ? this.state.definition.fields_display.map((key) => {
                    return this.renderField( key )
                }) : ''}
            </div>
            </div>
        )
    }
}
