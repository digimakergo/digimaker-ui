import * as React from 'react';
import { BrowserRouter as Router, Route, Link, NavLink } from "react-router-dom";
import Collapse from 'react-bootstrap/Collapse'

//TreeNode which render tree based on data from server.
//renderItem is to render what's inside(eg. if you want to remove icon or output node id, or additional link ).
function TreeNode(props:{data:any, renderItem?:any}) {
  return <ul className="treemenu">
    {props.data.children && props.data.children.map(
      value => { return (<TreeNodeItem data={value} renderItem={props.renderItem} />
      )})}
  </ul>
}

class TreeNodeItem extends React.Component<{ data: any, renderItem?:any, open?:any }, { open: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { open: false };
  }

  //todo: fix that when visit from url directly it's closed - use router match to update state?
  openclose(e: any) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ open: !this.state.open });
  }

  componentDidMount(){
    //todo: use better way to get parameters
    let path = window.location.pathname;
    let currentID = path.substr(path.lastIndexOf('/')+1,);
    let node = this.props.data;
    if( node.id == currentID ){
      this.setState({open: true});
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if(!prevState.open&&this.state.open){
      //Trigger chain that open parent which open parent's parent also...
      if( this.props.open ){
          this.props.open(true);
      }
    }
  }


  render() {
    let node = this.props.data;
    let url = `/main/${node.id}`;
    let open = this.state.open;

    let subtype = (node.fields && node.fields['subtype']) ? ('icon-subtype-' + node.fields['subtype']) : '';
    return <li className={open ? 'tree-open' : 'tree-close'}>
      <NavLink to={url} activeClassName="selected">
        <span className={node.children ? 'foldable space' : 'space'} onClick={(e) => this.openclose(e)}>
          {node.children&&<i className={"foldable fas fa-chevron-right" + (open ? ' open' : '')}></i>}
       </span>
        {this.props.renderItem?(this.props.renderItem(node)):(<span className="tree-text"><i className={"nodeicon far icon-" + node.content_type + " " + subtype}></i>{node.name}</span>)}
      </NavLink>

      {/*todo: load it without sliding*/}
      {node.children &&<Collapse in={open}><ul>{
        node.children.map(value => {
          return (<TreeNodeItem data={value} renderItem={this.props.renderItem} open={(open:boolean)=>{
            if(open){
              this.setState({open:true});
            }
          }} />)
        })}</ul>
        </Collapse>}
    </li>
  }
}

export default TreeNode;
