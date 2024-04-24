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

export interface BrowseProps {
  /** content types when browsing */
  contenttype:Array<string>;

  /** Parent id */
  parent?:number; 

  /** true means it's already triggered, otherwise it shows a button to trigger */
  trigger?:boolean;

  /** default show left folder tree or not */
  showTree?:boolean;

  /** when confirmed. return false will prevent closing */
  onConfirm: any;

  /** when cancel */
  onCancel?:any; 

  /** can multi select or not */
  multi?:boolean;

  /** selected a list of content */
  selected?: any;

  /** inline will not show dialog, but embed in line */
  inline?: boolean;

  /** button text */
  buttonText?:string;
}

const Browse = (props:BrowseProps)=>{
  const [trigger, setTrigger] = useState(props.trigger?true:false);

  return (<>{!props.trigger&&<button className="btn btn-link btn-sm" onClick={(e) => {e.preventDefault();setTrigger(!trigger);}}>
            <i className="fas fa-search"></i>&nbsp;{props.buttonText?props.buttonText:'Browse'}
          </button>}
          <Dialog {...props} trigger={trigger} />
          </>);
}
export default Browse;

//todo: add filter
//Dialog of the browse
class Dialog extends React.Component<BrowseProps, { contenttype:string, shown: boolean, showTree:boolean, list: any, parent: number, listParent:number, selected: any,refreshCount:number}> {

  constructor(props: BrowseProps) {
    super(props);
    this.state = { shown: props.trigger?true:false, contenttype:props.contenttype[0], showTree:props.showTree||false, list: '', parent: (this.props.parent||1), listParent:(this.props.parent||1), selected: props.selected,
    refreshCount:0,
  };
  }

  componentDidUpdate(prevProps){   
    if(this.props.selected != prevProps.selected){
      this.setState({selected:this.props.selected});
    }
    if(this.props.trigger != prevProps.trigger){
      this.setState({shown: true, selected:this.props.selected});
    }
  }

  show(e: any) {
    e.preventDefault();
    this.setState({shown: true });
  }

  cancel(){
    this.setState({shown: false });    
    if( this.props.onCancel ){
      this.props.onCancel();
    }    
  }

  submit() {
    const confirmSuccess = this.props.onConfirm(this.state.selected);
    this.setState({ selected:this.props.selected }); 
    //close if onConfirm doesn't return false
    if( confirmSuccess !== false ){   
      this.setState({ shown: false }); 
    }
  }


  clickTree(content: any) {
    this.setState({ listParent: content.id });
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
    return <span><i className={"nodeicon far icon-" + (content.metadata?content.metadata.contenttype:'') + " " + subtype}></i>{content.name}</span>
  }

  select(content: any) {
    if( !this.props.multi ){
      this.setState({ selected: content });
      //if it's inline and selected and not-multi, trigger onConfirm
      if( this.props.inline && this.props.trigger ){
        this.props.onConfirm( content );
      }
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
      if( this.props.inline && this.props.trigger ){
        this.props.onConfirm( newList );
      }
    }
  }

  changeContentype(contenttype:string){
    this.setState({contenttype:contenttype});
  }

  unselect(index:any){
    let data = this.state.selected;
    if( !this.props.multi ){
      data = null;
    }else{
      data.splice(index, 1);
    }
    this.setState({selected:data});
    if( this.props.inline ){
      this.props.onConfirm(data);
    }
  }
  uploaded(selectedData:any){
    this.setState({selected:selectedData})
  }  

  renderBody(){
    let browseList = util.getViewSettings(this.state.contenttype).browselist;

    let selected = this.props.multi?this.state.selected:(this.state.selected?[this.state.selected]:null);
    return <><div className="selected">{selected&&selected.map((content: any, index:any) => {
      return <><RenderProperties key={content.id} content={content} contenttype={this.state.contenttype} mode="inline" /><span className="close" onClick={(e)=>this.unselect(index)}></span></>
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
          <TreeNode rootID={this.state.parent} contenttype={['folder']} showRoot={true} renderItem={(content: any) => { return this.renderNode(content) }} onClick={(e:any, content: any) => { e.preventDefault(); this.clickTree(content) }} />
        </div>}
        <div className={this.state.showTree?"col-8":"col"}>
          <a href="#" onClick={(e:any)=>{e.preventDefault();this.setState({showTree:!this.state.showTree});}}>
            <i className={this.state.showTree?"fas fa-chevron-left":"fas fa-chevron-right"}></i>
          </a>
          <List id={this.state.listParent} {...browseList} key={this.state.listParent+this.state.contenttype+this.state.refreshCount} onRenderRow={(content:any)=>this.selectedRowClass(content)} contenttype={this.state.contenttype} level={100} onLinkClick={(content) => this.select(content)} />
          {util.browseAfterList&&util.browseAfterList({
            contenttype:this.state.contenttype,
            parent:this.state.listParent,
            refresh:(selectedData)=>{
              if(selectedData){
                this.setState({selected:selectedData});
              }
              this.setState({refreshCount: this.state.refreshCount+1})
            },
          })}
        </div>
      </div>
    </div></>
  }

  render() {
    return (<div>
      {this.props.inline&&
        <div className="browse inline">{this.renderBody()}</div>}
      {!this.props.inline&&
        <Modal
        show={this.state.shown}
        onHide={() => this.cancel()}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Select
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="browse">
          {this.renderBody()}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => this.submit()} variant="primary" size="sm"><i className="fas fa-check-circle"></i> Confirm</Button>
          <Button onClick={() => this.cancel()} variant="secondary" size="sm"><i className="fas fa-times-circle"></i> Cancel</Button>
        </Modal.Footer>
      </Modal>}

    </div>);
  }
}
