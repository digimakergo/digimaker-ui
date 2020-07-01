import * as React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import TreeNode from './TreeNode';
import { FetchWithAuth } from './util';
import List from './List';

//todo: make id based on context(site?)
//todo: remove id in the list
//todo: support * in contenttype(depending on implementation of list on *)
//todo: latest article(for instance) when root is selected.
//todo: make treemenu based on context(eg. site/configuration)
//todo: style clicked node
//todo: make button as prop(eg. <Browse button={<button>Add</button>} ... />)

//config:
// treetype: ["folder"]
// list:{columns, sort....} like standard list config
export default class Browse extends React.Component<{ config:any, contenttype:string, onConfirm: any, selected: Array<any> }, { shown: boolean, showTree:boolean, data: any, list: any, id: number, selected: Array<any> }> {
  constructor(props: any) {
    super(props);
    this.state = { shown: false, showTree:false, data: '', list: '', id: 1, selected: props.selected };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    FetchWithAuth(process.env.REACT_APP_REMOTE_URL + '/content/treemenu/1?type='+this.props.config.treetype.join(','))
      .then(res => res.json())
      .then((data) => {
        this.setState({ data: data });
      })
  }

  show(e: any) {
    e.preventDefault();
    this.setState({ shown: true });
  }

  close() {
    this.setState({ shown: false });
  }

  submit() {
    this.props.onConfirm(this.state.selected);
    this.close();
  }


  clickTree(content: any) {
    this.setState({ id: content.id });
  }

  renderNode(content: any) {
    let subtype = (content.fields && content.fields['subtype']) ? ('icon-subtype-' + content.fields['subtype']) : '';
    return <span><i className={"nodeicon far icon-" + content.content_type + " " + subtype}></i>{content.name}</span>
  }

  select(content: any) {
    let list = this.state.selected;
    let existing = list.find(
      (item)=>{
        return item.id == content.id;
      }
    );
    if( !existing ){
        list.push(content);
    }
    this.setState({ selected: list });
  }

  render() {
    return [<button className="btn btn-link btn-sm" onClick={(e) => this.show(e)}>
      <i className="fas fa-search"></i>&nbsp;Browse
              </button>,

    <Modal
      show={this.state.shown}
      onHide={() => this.close()}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Select
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="browse">
        <div className="selected">{this.state.selected.map((content: any) => {
          return <span>{content.name} &nbsp;</span>
        })}</div>
        <div className="container">
          <div className="row">
            {this.state.showTree&&<div className="col-4">
              <TreeNode data={this.state.data} showRoot={true} renderItem={(content: any) => { return this.renderNode(content) }} onClick={(content: any) => { this.clickTree(content) }} />
            </div>}
            <div className={this.state.showTree?"col-8":"col"}>
              <a href="#" onClick={(e:any)=>{e.preventDefault();this.setState({showTree:!this.state.showTree});}}>
                <i className={this.state.showTree?"fas fa-chevron-left":"fas fa-chevron-right"}></i>
              </a>
              <List id={this.state.id} contenttype={this.props.contenttype} config={this.props.config.list} onLinkClick={(content) => this.select(content)} />
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => this.submit()} variant="primary">Confirm</Button>
        <Button onClick={() => this.close()} variant="secondary">Cancel</Button>
      </Modal.Footer>
    </Modal>]
  }
}
