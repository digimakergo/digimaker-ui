import * as React from 'react';
import { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import TreeNode from './TreeNode';
import RenderProperties from './RenderProperties';
import { FetchWithAuth } from './util';
import util from './util';
import List from './List';

//todo: make button as prop(eg. <Browse button={<button>Add</button>} ... />)

//config:
// treetype: ["folder"]

const Browse = (props:any)=>{
  const [trigger, setTrigger] = useState(props.trigger?true:false);

  return (<>{!props.trigger&&<button className="btn btn-link btn-sm" onClick={(e) => {e.preventDefault();setTrigger(!trigger);}}>
            <i className="fas fa-search"></i>&nbsp;Browse
          </button>}
          <Dialog {...props} trigger={trigger} />
          </>);
}
export default Browse;

//todo: add filter
//Dialog of the browse
class Dialog extends React.Component<{config:any, contenttype:Array<string>, trigger:boolean, onConfirm: any, multi:boolean, selected: any }, { contenttype:string, shown: boolean, showTree:boolean, data: any, list: any, id: number, selected: any }> {

  private config:any;

  constructor(props: any) {
    super(props);
    this.setConfig( props.config, props.contenttype[0] );
    this.state = { shown: props.trigger?true:false, contenttype:props.contenttype[0], showTree:false, data: '', list: '', id: 1, selected: props.selected };
  }

  setConfig( config, contenttype ){
    let result = {};
    for( let item in config ){
      result[item] = util.getSettings( config[item], contenttype, "browse-"+item );
    }
    this.config = result;
  }

  componentDidUpdate(prevProps){
    if( prevProps.contenttype.join('') != this.props.contenttype.join('') ){
      this.setConfig( this.props.config, this.props.contenttype[0] );
    }
    if(this.props.trigger != prevProps.trigger){
      this.setState({shown: true, selected:this.props.selected});
    }
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    FetchWithAuth(process.env.REACT_APP_REMOTE_URL + '/content/treemenu/1?type='+this.config.filter.contenttype.join(','))
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

  selectedRowClass(content:any){
    if( !this.state.selected ){
      return "";
    }

    let selected = this.state.selected;
    if( !this.props.multi ){
      selected = [selected];
    }

    if( selected.find((item:any)=>{
            return item.id == content.id
            })
      ){
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
    if( !this.props.multi ){
      this.setState({ selected: content });
      return;
    }

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

  changeContentype(contenttype:string){
    this.setState({contenttype:contenttype});
  }

  render() {
    let selected = this.props.multi?this.state.selected:(this.state.selected?[this.state.selected]:null);

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
        <div className="selected">{selected&&selected.map((content: any) => {
          return <><RenderProperties content={content} contenttype={this.state.contenttype} mode="inline" /></>
        })}</div>
        {this.props.contenttype.length>1&&<div>
          <select onChange={(e:any)=>this.changeContentype(e.target.value)}>
          {this.props.contenttype.map((item:any)=>{
            return <option value={item}>{item}</option>
          })}
          </select>
         </div>}
        <div className="container browse-list">
          <div className="row">
            {this.state.showTree&&<div className="col-4">
              <TreeNode data={this.state.data} showRoot={true} renderItem={(content: any) => { return this.renderNode(content) }} onClick={(content: any) => { this.clickTree(content) }} />
            </div>}
            <div className={this.state.showTree?"col-8":"col"}>
              <a href="#" onClick={(e:any)=>{e.preventDefault();this.setState({showTree:!this.state.showTree});}}>
                <i className={this.state.showTree?"fas fa-chevron-left":"fas fa-chevron-right"}></i>
              </a>
              <List id={this.state.id} onRenderRow={(content:any)=>this.selectedRowClass(content)} contenttype={this.state.contenttype} config={this.config.list} onLinkClick={(content) => this.select(content)} />
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
