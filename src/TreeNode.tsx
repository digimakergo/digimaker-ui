import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, NavLink } from "react-router-dom";
import Collapse from 'react-bootstrap/Collapse'

//TreeNode which render tree based on data from server.
//renderItem is to render what's inside(eg. if you want to remove icon or output node id, or additional link ).
function TreeNode(props:{data:any, selectedId?:number, showRoot?:boolean, renderItem?:any, onClick?:any}) {
  //todo: use better way to get parameters
  return <ul className="treemenu">
    {props.showRoot&&<TreeNodeItem data={props.data} selectedId={props.selectedId} renderItem={props.renderItem} onClick={props.onClick}/>}
    {(!props.showRoot && props.data.children) && props.data.children.map(
      value => { return (<TreeNodeItem key={value.id} selectedId={props.selectedId} data={value} renderItem={props.renderItem} onClick={props.onClick}/>
      )})}
  </ul>
}

class TreeNodeItem extends React.Component<{ data: any, selectedId?: number, onClick?:any, renderItem?:any, onOpenClose?:any }, { open: boolean}> {
  constructor(props: any) {
    super(props);
    this.state = { open:false};
  }

  //todo: fix that when visit from url directly it's closed - use router match to update state?
  openclose(e: any) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ open: !this.state.open });
  }

  componentDidMount(){
    let node = this.props.data;
    if( node.id == this.props.selectedId ){
      this.setState({open: true});
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if(!prevState.open&&this.state.open){
      //Trigger chain that open parent which open parent's parent also...
      if( this.props.onOpenClose ){
          this.props.onOpenClose(true);
      }
    }
  }

  onClick(e){
    //open itself
    this.setState({open: true });
    if(this.props.onClick){
      e.preventDefault();
      this.props.onClick(this.props.data);
    }
  }

  render() {
    let node = this.props.data;
    let url = `/main/${node.id}`;
    let open = this.state.open;

    let subtype = (node.fields && node.fields['subtype']) ? ('icon-subtype-' + node.fields['subtype']) : '';
    return <li className={open ? 'tree-open' : 'tree-close'}>
      <NavLink to={url} activeClassName="selected" onClick={(e)=>{this.onClick(e)}}>
        <span className={node.children ? 'foldable space' : 'space'} onClick={(e) => this.openclose(e)}>
          {node.children&&<i className={"foldable fas fa-chevron-right" + (open ? ' open' : '')}></i>}
       </span>
        {this.props.renderItem?(this.props.renderItem(node)):(<span className="tree-text" title={node.name}><i className={"nodeicon far icon-" + node.content_type + " " + subtype}></i>{node.name}</span>)}
      </NavLink>

      {/*todo: load it without sliding*/}
      {node.children &&<Collapse in={open}><ul>{
        node.children.map(value => {
          return (<TreeNodeItem key={value.id} selectedId={this.props.selectedId} data={value} renderItem={this.props.renderItem} onOpenClose={(open:boolean)=>{
            if(open){
              this.setState({open:true});
            }
          }}
          onClick={this.props.onClick} />)
        })}</ul>
        </Collapse>}
    </li>
  }
}

export default TreeNode;
