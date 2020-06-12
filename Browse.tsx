import * as React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import TreeNode from './TreeNode';
import { FetchWithAuth } from '../utils/util';
import List from '../main/List';

//todo: make id based on context(site?)
//todo: add contenttype prop. (and show it in the title)
//todo: remove id in the list
//todo: latest article(for instance) when root is selected.
//todo: make treemenu based on context(eg. site/configuration)
//todo: style clicked node
//todo: make button as prop(eg. <Browse button={<button>Add</button>} ... />)
export default class Browse extends React.Component<{ onConfirm: any, selected: Array<any> }, { shown: boolean, data: any, list: any, id: number, selected: Array<any> }> {
  constructor(props: any) {
    super(props);
    this.state = { shown: false, data: '', list: '', id: 1, selected: props.selected };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    FetchWithAuth(process.env.REACT_APP_REMOTE_URL + '/content/treemenu/1?type=folder')
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
    list.push(content);
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
            <div className="col-4">
              <TreeNode data={this.state.data} renderItem={(content: any) => { return this.renderNode(content) }} onClick={(content: any) => { this.clickTree(content) }} />
            </div>
            <div className="col-8">
              <List id={this.state.id} contenttype="article" listtype="browse" onLinkClick={(content) => this.select(content)} />
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
