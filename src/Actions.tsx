import * as React from 'react';
import { Link } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import util from './util';
import {getDefinition} from './util';
import Registry from './Registry';
import { Modal, Accordion, Button } from 'react-bootstrap';

export default class Actions extends React.Component<{ actionsConfig: any, fromview:string, content:any, iconOnly?:boolean, from?: any, selected?: any, afterAction?: any, parameters?: any }, {}> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  //render link
  renderLink(config: any) {
    let content = this.props.content;
    let path = '';
    let from = this.props.from;
    if( config.link ){    
      let variables = {};
      if( content ){
        variables = {...content}; //can support more attribute also.
        let def = getDefinition( content.metadata.contenttype );
        variables["_location_id"] = def.has_location?content.location.id:content.location_id;
        variables["_contenttype_id"] = def.has_location?content.id:(content.metadata.contenttype+'/'+content.id);
      }  
      if(from){
        for(let key in from){
            variables["_from_"+key] = from[key];
        }
      }
      path = util.washVariables(config.link, variables); //todo: support component here also
    }

    let newWindow = config.new?true:false;

    let linkText = (<><i className={config.icon ? ("icon " + config.icon) : ("fas fa-tools")}></i>{(!this.props.iconOnly)&&config.name ? config.name : ''}</>);

    return (<div className="action-item">
            {!newWindow&&<Link to={path} title={this.props.iconOnly?config.name:config.title}>
                {linkText}
            </Link>}
            {newWindow&&<a href={path} title={config.title} target="_blank">{linkText}</a>}
          </div>);
  }

  afterAction(){

  }

  render() {
    let content = this.props.content;
    let from = this.props.from;
    let actions = this.props.actionsConfig;

    if (!actions) {
      return '';
    }

    return (
      (<div className='actions'>
        {actions.map((actionConfig: any) => {
          if (actionConfig['link']) {
            return this.renderLink(actionConfig);
          }

          if( actionConfig['com'] ){
            let identifier = actionConfig['com'];
            let Action = Registry.getComponent(identifier);
            return <React.Suspense fallback="..."><Action config={actionConfig} parameters={this.props.parameters} fromview={this.props.fromview} selected={this.props.selected} afterAction={this.props.afterAction} content={this.props.content} from={this.props.from} /></React.Suspense>
          }
          return '';
         })
        }       
      </div>)
    );
  }
}
