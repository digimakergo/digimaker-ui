import * as React from 'react';
import { BrowserRouter as Router, Route, Link, NavLink } from "react-router-dom";

//TreeNode which render tree based on data from server.
//renderItem is to render what's inside(eg. if you want to remove icon or output node id, or additional link ).
function TreeNode(props:{data:any, renderItem?:any}) {
  return <ul className="treemenu">
    {props.data.children && props.data.children.map(
      value => { return (<TreeNodeItem data={value} renderItem={props.renderItem} />
      )})}
  </ul>
}

class TreeNodeItem extends React.Component<{ data: any, renderItem?:any }, { open: boolean }> {
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

  clickContainer() {
    this.setState({ open: true });
  }

  render() {
    let node = this.props.data;
    let url = `/main/${node.id}`;

    let subtype = (node.fields && node.fields['subtype']) ? ('icon-subtype-' + node.fields['subtype']) : '';
    return <li className={this.state.open ? 'tree-open' : 'tree-close'} onClick={() => this.clickContainer()}>
      <NavLink to={url} activeClassName="selected">
        <span className={node.children ? 'foldable space' : 'space'} onClick={(e) => this.openclose(e)}>
          {node.children ? <i className={"fas " + (this.state.open ? 'icon-open' : 'icon-close')}></i> : ''}
       </span>
        {this.props.renderItem?(this.props.renderItem(node)):([<i className={"nodeicon far icon-" + node.content_type + " " + subtype}></i>,node.name])}
      </NavLink>

      {node.children && <ul>{
        node.children.map(value => {
          return (<TreeNodeItem data={value} renderItem={this.props.renderItem} />)
        })}</ul>}
    </li>
  }
}

export default TreeNode;
