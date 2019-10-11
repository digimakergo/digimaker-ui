import * as React from 'react';
import Config from './config.json';

export default class LoadFields extends React.Component<{ type: string }, { definition: any, components: {}, typeArr:string[] }> {

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

    renderField(identifier: string, field: any) {
        if (field.children) {
            return (<div className={"field-container " + identifier}>
            <span className="container-title">{field.name}</span>
                {Object.keys(field.children).map( (key) => {
                     return (this.renderField( key, field.children[key] ))
                })}
            </div>)
        }
        else {
            const typeStr = field.type;
            const Fieldtype: React.ReactType = this.loadFieldtype(field.type);
            return Fieldtype ? <Fieldtype identifier={identifier} definition={field} /> : field.type + ' is not supported.'
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
            if( !fields[identifier] ){
                return (<div>{identifier} not found</div>)
            }
            fields = fields[identifier].children;
        }
        return (
            <div>
                <div>
                    {Object.keys(fields).map((key) => {
                        return this.renderField(key, fields[key])
                    })}
                </div>
            </div>
        )
    }
}
