import * as React from 'react';
import { ActionProps, ContentActionParams } from '../ActionsRender';
import {FetchWithAuth, Dialog} from '../util';


export default class SetPriority extends React.Component<ActionProps, {error:string, dialog:boolean, value:string, newValue:string}> {

    constructor(props:ActionProps){
        super(props);
        let priority = (props.params as ContentActionParams).content.priority;
        this.state = {error:'', dialog:false, value:priority, newValue:priority};
    }

    showDialog =(e)=>{
        this.setState({dialog: true});
        e.preventDefault();
    }

    input = (e)=>{
        let inputStr = e.target.value;
        this.setState({value: inputStr});
    }

    submit = ()=>{
        FetchWithAuth(process.env.REACT_APP_REMOTE_URL + '/content/setpriority?params='+(this.props.params as ContentActionParams).content.id+','+this.state.value)
        .then((data:any)=>{
            if( data.error === false ){
                this.setState({dialog:false, newValue:this.state.value});
            }
        });
    }

    render(){
        return <>
        <a href="#" onClick={this.showDialog} title="Set priority"><i className="fas fa-sort-amount-down"></i> {this.state.newValue}</a>
        {this.state.dialog&&
         <Dialog title={"Set priority"} onSubmit={this.submit}>
             <label>New priority: </label>
             <div>
                <input type="number"  className="form-control" value={this.state.value} onChange={this.input} />
             </div>
        </Dialog>}
        </>;
    }
}