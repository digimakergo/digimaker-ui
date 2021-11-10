import * as React from 'react';
import { Link } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import util from './util';
import {getDefinition} from './util';
import Registry from './Registry';
import { Modal, Accordion, Button } from 'react-bootstrap';

export default class Actions extends React.Component<{ actionsConfig: any, fromview:string, content:any, iconOnly?:boolean, from?: any, selected?: any, afterAction?: any }, { actions: any, counters:any }> {
  constructor(props: any) {
    super(props);
    this.state = { actions: {}, counters:{} };
  }


  componentDidMount(){
    let actions = this.props.actionsConfig;
    let newActions = this.state.actions;
    if( actions ){
      actions.map((actionConfig: any) => {
         if (actionConfig['com'] ) {
          if( !actionConfig['name'] ){
            let action = Registry.getComponent(actionConfig['com'])
            newActions[actionConfig['com']] = action;
          }
        }
      });
      this.setState({actions: newActions });
    }
  }

  showDialog(config:any){
    event.preventDefault();
    let identifier = config['com'];
    let action = Registry.getComponent(identifier);
    let counters = this.state.counters;
    if( !counters[identifier] ){
      counters[identifier] = 0;
    }
    counters[identifier] +=1;
    this.setState({actions: {...this.state.actions, [identifier]:action}, counters: counters });
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
        let def = getDefinition( content.content_type );
        variables["_contenttype_id"] = def.has_location?content.id:(content.content_type+'/'+content.id);
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
            {!newWindow&&<Link to={path?path:'#'} title={this.props.iconOnly?config.name :config.title} onClick={this.showDialog.bind(this, config)}>
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
      (<div>
        {actions.map((actionConfig: any) => {
          if (actionConfig['link'] || actionConfig['name'] && actionConfig['com']) {
            return this.renderLink(actionConfig);
          }
         })
        }
        <React.Suspense fallback="...">
          {this.state.actions && <div className="action-item">
              {Object.values(this.state.actions).map((Action:React.ReactType, i:number)=>{
                let identifier = Object.keys(this.state.actions)[i];
                return <Action counter={this.state.counters[identifier]} fromview={this.props.fromview} selected={this.props.selected} afterAction={this.props.afterAction} content={this.props.content} from={this.props.from} />
              })}
            </div> }          
        </React.Suspense>
      </div>)
    );
  }
}
