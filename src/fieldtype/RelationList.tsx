import * as React from 'react';
import Moment from 'react-moment';
import ReactTooltip from 'react-tooltip';
import Browse from '../Browse';
import { Link } from "react-router-dom";

export default class RelationList extends React.Component<{definition:any, validation:any, beforeField:any, afterField:any, data:any, mode:string},{list:Array<any>}> {
  constructor(props: any) {
      super(props);
      this.state = {list: []};
  }


  confirmDialog(selected:Array<any>){
    this.setState({list:selected});
  }

  edit(){
    let def = this.props.definition;
    if( !def.parameters || !def.parameters.type ){
      console.error("No type defined in relationlist " + def.identifier);
      return <div className="alert alert-warning">Wrong setting on {def.name}</div>
    }
    let relatedType = def.parameters.type;
    //todo: make config from outside.
    return <div className={'edit field '+def.type}>
            {this.props.definition.name}:
            <Browse config={{"treetype":["folder"],"list":{"columns":["name"]}}} contenttype={relatedType} onConfirm={(selected:Array<any>)=>this.confirmDialog(selected)} selected={this.state.list} />
          {this.state.list.length>0&&<ul>
              {this.state.list.map((item:any)=>{
                  return <li><Link to={'/main/'+item.id}>{item.name}</Link></li>
              })}
           </ul>}</div>
  }

  view(){
    return <div>{this.props.definition.name}:

           </div>
  }

  render(){
    if(this.props.mode=='edit'){
      return this.edit();
    }else if(this.props.mode=='view'){
      return this.view();
    }else{
      return this.view();
    }
  }
}
