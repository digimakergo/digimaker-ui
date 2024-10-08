import * as React from 'react';
import Moment from 'react-moment';
import ReactTooltip from 'react-tooltip';
import Browse from '../Browse';
import { Link } from "react-router-dom";
import util from '../util';
import {FetchWithAuth} from '../util';
import { ReactSortable } from "react-sortablejs";
import RenderProperties from '../RenderProperties';


export default class RelationList extends React.Component<{definition:any, validation:any, beforeField:any, afterField:any, data:any, formdata:any, mode:string},{list:Array<any>}> {
  constructor(props: any) {
      super(props);
      this.state = {list: []};
  }

  //todo: maybe better visit data instead of form data?
  //todo: show name/picture of reference field(invoke another component mode)
  componentDidMount(){
    this.fetchExisting();
  }

  fetchExisting(){
    let data = this.props.data;
    if( !data ){
      return
    }

    let ids = [];
    for( let item of data ){
      ids.push(item.from_content_id);
    }
    FetchWithAuth('content/list/'+this.props.definition.parameters.type+'?cid='+ids.join(',')+'&limit=0')
        .then((data) => {
            let sortedList = [];
            for( let id of ids ){
              for(let item of data.data.list ){
                  if( item.id==id ){
                    sortedList.push(item)
                    continue;
                  }
              }
            }
            this.setState({list: sortedList });
        })
  }

  confirmDialog(selected:Array<any>){
    this.setState({list:selected});
  }

  remove(i:number){
    let list = this.state.list;
    list.splice(i,1);
    this.setState({list:list});
  }

  edit(){
    let def = this.props.definition;
    if( !def.parameters || !def.parameters.type ){
      console.error("No type defined in relationlist " + def.identifier);
      return <div className="alert alert-warning">Wrong setting on {def.name}</div>
    }
    let relatedType = def.parameters.type;
    let parentID = def.parameters.parent_id;

    let ids = [];
    let types = [];
    for( let item of this.state.list ){
        ids.push(item.id);
        types.push(relatedType);
    }

    return  <>
            <label className="field-label">{this.props.definition.name}:</label>
            <div className="field-value">
            <Browse multi={true} contenttype={[relatedType]} parent={parentID} onConfirm={(selected:Array<any>)=>this.confirmDialog(selected)} selected={this.state.list} />
              <ReactSortable
                 className="list"
                 list={this.state.list}
                 setList={sortedList => this.setState({ list: sortedList })}>
               {this.state.list.map((item:any, i:number)=>{
                   return <div key={item.id} className="list-item">
                            <RenderProperties content={item} contenttype={relatedType} mode="inline" />
                              <a href="#" className="float-right" title="Remove" onClick={(e:any)=>{e.preventDefault();this.remove(i)}}><i className="far fa-trash-alt"></i></a>
                           </div>
               })}
                </ReactSortable>

              <input type="hidden" name={def.identifier} value={ids.length>0?(ids.join(',')+';'+types.join(',')):''} />
              </div>
              </>
  }

  view(){
    return <>
            <label className="field-label">{this.props.definition.name}:</label>
            <div className="field-value">{this.raw()}</div>
           </>
  }

  raw(){
    return (this.state.list.length>0&&
      <div className={"list field-relationlist-"+this.props.definition.parameters.type}>
      {this.state.list.map((item:any)=>{
          return <div key={item.id} className="list-item"><RenderProperties content={item} contenttype={this.props.definition.parameters.type} mode="inline" /></div>
      })}
   </div>)
  }

  render(){
    if(this.props.mode=='edit'){
      return this.edit();
    }else if(this.props.mode=='view'){
      return this.view();
    }else{
      return this.raw();
    }
  }
}
