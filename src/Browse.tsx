import * as React from 'react';
import { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import TreeNode from './TreeNode';
import RenderProperties from './RenderProperties';
import { FetchWithAuth } from './util';
import List from './List';

//todo: make id based on context(site?)
//todo: remove id in the list
//todo: support * in contenttype(depending on implementation of list on *)
//todo: make treemenu based on context(eg. site/configuration)
//todo: make button as prop(eg. <Browse button={<button>Add</button>} ... />)

//config:
// treetype: ["folder"]

const Browse = (props:any)=>{
  const [trigger, setTrigger] = useState(false);

  return (<><button className="btn btn-link btn-sm" onClick={(e) => {e.preventDefault();setTrigger(!trigger);}}>
            <i className="fas fa-search"></i>&nbsp;Browse
          </button>
          <Dialog {...props} trigger={trigger} />
          </>);
}
export default Browse;

//todo: add filter
//Dialog of the browse
class Dialog extends React.Component<{config:any, contenttype:string, trigger:boolean, onConfirm: any, selected: Array<any> }, { shown: boolean, showTree:boolean, data: any, list: any, id: number, selected: Array<any> }> {

  constructor(props: any) {
    super(props);
    this.state = { shown: false, showTree:false, data: '', list: '', id: 1, selected: props.selected };
  }

  componentDidUpdate(prevProps){
    if(this.props.trigger != prevProps.trigger){
      this.setState({shown: true, selected:this.props.selected});
    }
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
    this.setState({shown: true });
  }

  close() {
    this.setState({ selected:this.props.selected, shown: false });
  }

  submit() {
    this.props.onConfirm(this.state.selected);
    this.close();
  }


  clickTree(content: any) {
    this.setState({ id: content.id });
  }

  selectedRow(content:any){
    let existing = this.state.selected.find((item:any)=>{
      return item.id == content.id
    });

    if( existing ){
      return "browse-selected";
    }else{
      return "";
    }
  }

  renderNode(content: any) {
    let subtype = (content.fields && content.fields['subtype']) ? ('icon-subtype-' + content.fields['subtype']) : '';
    return <span><i className={"nodeicon far icon-" + content.content_type + " " + subtype}></i>{content.name}</span>
  }

  select(content: any) {
    let list = this.state.selected;
    let newList = [];
    let existing = false;
    for( let item of list ){
      if( item.id == content.id ){
        existing = true;
      }
      newList.push(item);
    }
    if( !existing ){
      newList.push( content );
      this.setState({ selected: newList });
    }
  }

  render() {
    return (<div><Modal
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
          return <span><RenderProperties content={content} mode="inline" /></span>
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
              <List id={this.state.id} onRenderRow={(content:any)=>this.selectedRow(content)} contenttype={this.props.contenttype} config={this.props.config.list} onLinkClick={(content) => this.select(content)} />
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => this.submit()} variant="primary" size="sm"><i className="fas fa-check-circle"></i> Confirm</Button>
        <Button onClick={() => this.close()} variant="secondary" size="sm"><i className="fas fa-times-circle"></i> Cancel</Button>
      </Modal.Footer>
    </Modal></div>);
  }
}
