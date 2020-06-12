import * as React from 'react';
import Config from '../dm.json';
import Moment from 'react-moment';
import { Link } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import util from './util';
import Registry from './Registry';
import { Accordion, Button } from 'react-bootstrap';
import {IconToggle} from './IconToggle';


export default class Actions extends React.Component<{actionsConfig:any, from?:any, selected?:any, afterAction?:any}> {

  //render link
  renderLink(config:any){
    let content = this.props.from;
    let variables = content; //can support more attribute also.
    let path = util.washVariables(config.link, variables); //todo: support component here also
    return (<div className="action-item">
             <Link to={path} title={config.title}>
             <i className={config.icon?("icon "+config.icon):("fas fa-tools")}></i> {config.name?config.name:''}</Link>
            </div>)
  }


  render() {
    let content = this.props.from;
    let actions = this.props.actionsConfig;

    if( !actions ){
      return '';
    }

    return (actions.map( (actionConfig:any) => {
                if(actionConfig['link']){
                  return this.renderLink(actionConfig);
                }else if(actionConfig['com']){
                  return <Action config={actionConfig} from={content} afterAction={this.props.afterAction} selected={this.props.selected} />;
                }else{
                  return '';
                }
              }));
  }
}

//One action
class Action extends React.Component<{from:any, config:any, selected?:any, afterAction?:any}, {clickFlag:boolean}>{
  constructor(props: any) {
      super(props);
      this.state={clickFlag:false}; //todo: change it to be better way to communicate between components.
  }

  //render action component
  render(){
        let config = this.props.config;
        let Com:React.ReactType = Registry.getComponent( config['com'] );
        if(config.name){
          return <div className="action-item">
                   <a href='#' title={config.title} onClick={(e)=>{e.preventDefault();this.setState({clickFlag:!this.state.clickFlag})}}>
                    <i className={config.icon?("icon "+config.icon):("fas fa-tools")}></i> {config.name}
                   </a>
                  <Com from={this.props.from} selected={this.props.selected} changed={this.state.clickFlag} afterAction={this.props.afterAction} />
                 </div>
        }
  }
}
