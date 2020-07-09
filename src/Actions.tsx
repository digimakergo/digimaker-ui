import * as React from 'react';
import Config from '../dm.json';
import Moment from 'react-moment';
import { Link } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import util from './util';
import Registry from './Registry';
import {Modal, Accordion, Button } from 'react-bootstrap';
import {IconToggle} from './IconToggle';
import { lazy } from 'react';


const importView = (actionType,actionName) =>
  lazy(() =>
    import(`../${actionType}/${actionName}`).catch()
  );


 
  
  declare function Action():JSX.Element;
  const ActionList = (props) => (
    <>
      { Object.values(props.actions).map((Action:any) => (
        
       <Action {...props}/>
        
      ))
      }
    </>
  ); 


export default class Actions extends React.Component<{actionsConfig:any, from?:any, selected?:any, afterAction?:any},{actions?:any}> {

  constructor(props: any) {
    super(props);
    this.state={actions:''}; //todo: change it to be better way to communicate between components.
}

   addAction = (action,actionName) => {
    const [componentType, componentName]= actionName.split(":");
    
    if (this.state.actions[componentName]) {
      if(!action['dialog']) return // every give me new one 
    };
    const Action= importView(componentType,componentName);
    
    let actionsval= {...this.state.actions,[componentName]: Action};
    this.setState({actions:actionsval})
    
  };

  renderCom(config:any){
   
  //this.addAction(config,config['com1']);
  }

 
  renderDialog(config:any){
    
   const loadContent=(<div className="action-item">
     <a href='javascript:void(0)' key={config.name} title={config.title} onClick={this.addAction.bind(this,config,config['dialog'])}>
                    <i className={config.icon?("icon "+config.icon):("fas fa-tools")}></i> {config.name}
                   </a>
          </div>)
    return (loadContent);
  }
  //render link
  renderLink(config:any){
    let content = this.props.from;
    
    
    let variables = content; //can support more attribute also.
    let path = util.washVariables(config.link, variables); //todo: support component here also
    
    const  loadContent=(<div className="action-item">
                    <Link to={path} title={config.title}>
                 <i className={config.icon?("icon "+config.icon):("fas fa-tools")}></i> {config.name?config.name:''}</Link>
                  </div>)
    
    
 
    return (loadContent);
  }

  
  render() {
    let content = this.props.from;
    let actions = this.props.actionsConfig;

    if( !actions ){
      return '';
    }

  return ( 
  
      ( <div>
       { actions.map( (actionConfig:any) => {
              if(actionConfig['link']){
               return  this.renderLink(actionConfig);
              }else if(actionConfig['dialog']){
               
             return  this.renderDialog(actionConfig);
                
                //return <Action config={actionConfig} from={content} afterAction={this.props.afterAction} selected={this.props.selected} />;
              }else if(actionConfig['com1']){
                  return this.renderCom(actionConfig);
              }
              else{
               return '';
              }
            })
          }
              <React.Suspense fallback="Loading Action...">
              <div className="row">{
              this.state.actions &&  <ActionList {...this.props} actions={this.state.actions}  />
              }
                
              </div>
            </React.Suspense>
            </div>) 
            
            
        
          
            );
            
            
            
  }
}


//for model


export const Modals = ({ isShowing, hide,title,submit,body }) => isShowing ? 
<div  className='modal-overlay'>
<Modal.Dialog  size="lg">
   <Modal.Header closeButton>
<Modal.Title>{title}</Modal.Title>
   </Modal.Header>
 
  <Modal.Body>
   {body}
  </Modal.Body>
 
   <Modal.Footer>
     <Button variant="secondary" onClick={hide}>Close</Button>
      <Button variant="primary" onClick={submit}>Save changes</Button>
   </Modal.Footer>
  </Modal.Dialog></div>: null;









