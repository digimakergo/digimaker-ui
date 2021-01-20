import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, NavLink } from "react-router-dom";
import Collapse from 'react-bootstrap/Collapse'

//TreeNode which render tree based on data from server.
//selected: number|array<number> for selected id
//renderItem is to render what's inside(eg. if you want to remove icon or output node id, or additional link ).
function TreeNode(props:{data:any, selectedId?:any, showRoot?:boolean, renderItem?:any, onClick?:any}) {
  //todo: use better way to get parameters
  return <ul className="treemenu">
    {props.showRoot&&<TreeNodeItem data={props.data} selectedId={props.selectedId} renderItem={props.renderItem} onClick={props.onClick}/>}
    {(!props.showRoot && props.data.children) && props.data.children.map(
      value => { return (<TreeNodeItem key={value.id} selectedId={props.selectedId} data={value} renderItem={props.renderItem} onClick={props.onClick}/>
      )})}
  </ul>
}

class TreeNodeItem extends React.Component<{ data: any, selectedId?: any, onClick?:any, renderItem?:any, onOpenClose?:any }, { open: boolean, selected:boolean}> {
  constructor(props: any) {
    super(props);
    this.state = { open:false, selected: false};
  }

  //todo: fix that when visit from url directly it's closed - use router match to update state?
  openclose(e: any) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ open: !this.state.open });
  }

  componentDidMount(){
    this.initSelected();
  }

  initSelected(){
    let node = this.props.data;
    let selectedId = this.props.selectedId;
    if( ( Number.isInteger( selectedId ) && node.id == selectedId ) ||
        ( Array.isArray( selectedId ) && selectedId.includes( node.id ) )  ){
      this.setState({open: true, selected: true});
    }else{
      this.setState({selected: false});
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if(!prevState.open&&this.state.open){
      //Trigger chain that open parent which open parent's parent also...
      if( this.props.onOpenClose ){
          this.props.onOpenClose(true);
      }
    }

    if( Number.isInteger( prevProps.selectedId ) && prevProps.selectedId != this.props.selectedId ||
        Array.isArray( prevProps.selectedId ) && prevProps.selectedId.join(',') != this.props.selectedId.join(',') ){
          this.initSelected();
        }
  }

  onClick(e){
    //open itself
    this.setState({open: true });
    if(this.props.onClick){
      this.props.onClick(e, this.props.data);
    }
  }

  render() {
    let node = this.props.data;
    let url = `/main/${node.id}`;
    let open = this.state.open;

    let subtype = (node.fields && node.fields['subtype']) ? ('icon-subtype-' + node.fields['subtype']) : '';
    return <li className={(open ? 'tree-open' : 'tree-close') + ' ' + (node.children?'tree-haschild':'tree-nochild')}>
      <NavLink to={url} className={this.state.selected?'selected':''}
                        activeClassName="active"
                        onClick={(e)=>{this.onClick(e)}}>
        <span className={node.children ? 'foldable space' : 'space'} onClick={(e) => this.openclose(e)}>
          {node.children&&<i className={"foldable fas fa-chevron-right" + (open ? ' open' : '')}></i>}
       </span>
        {this.props.renderItem?(this.props.renderItem(node)):(<span className="tree-text" title={node.name}><i className={"nodeicon far icon-" + node.content_type + " " + subtype}></i><span>{node.name}</span></span>)}
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
