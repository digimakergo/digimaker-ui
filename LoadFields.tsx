import * as React from 'react';
import Config from './config.json';

export default class LoadFields extends React.Component<{ type: string }, { definition: any, components: {} }> {

    constructor(props: any) {
        super(props);
        this.state = { definition: '', components: {} };
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
        fetch(Config.remote_server + '/contenttype/get/' + this.props.type)
            .then(res => res.json())
            .then((data) => {
                this.setState({ definition: data });
            })
    }

    componentWillMount() {
        this.fetchData();
    }

    renderField(identifier: string, field: any) {
        if (field.children) {
            const output = [];
            {Object.keys(field.children).forEach( (key) => {
                 output.push(this.renderField( key, field.children[key] )) //todo: improve this.
            })}
            return (<div className={"field-container " + identifier}>
            <span className="container-title">{field.name}</span>
                {output}
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
        return (
            <div>
                <div>
                    {this.state.definition ? this.state.definition.fields_display.map((key) => {
                        return this.renderField(key, this.state.definition.fields[key])
                    }) : ''}
                </div>
            </div>
        )
    }
}
