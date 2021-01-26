import * as React from 'react';
import Moment from 'react-moment';
import util from './util';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Actions from './Actions';

export default class ListRowActions extends React.Component<{content:any,from:any,config:any,afterAction:any, visibleNumber?:number}, {menuShown:boolean}> {
  constructor(props: any) {
      super(props);
      this.state={menuShown:false};
  }

  click(e:any){
    e.preventDefault();
    this.setState({menuShown:!this.state.menuShown});
  }

  afterAction(){
    this.setState({menuShown: false});
    this.props.afterAction(true);
  }

  renderActions(actionConfig:any, iconOnly:boolean){
    return <Actions content={this.props.content} iconOnly={iconOnly} from={this.props.from} fromview="inline" selected={this.props.content} afterAction={()=>this.afterAction()} actionsConfig={actionConfig} />
  }

  render(){
    let config = this.props.config;
    let visibleNumber = this.props.visibleNumber?this.props.visibleNumber:3;
    if( config.length < visibleNumber ){
      visibleNumber = config.length;
    }

    if(!config){
      return '';
    }
    let visibleActions:any = [];
    let menuActions:any = [];

    for( let i=0; i<visibleNumber; i++ ){
      visibleActions.push( config[i] );
    }
    for( let i=visibleNumber; i<config.length; i++ ){
      menuActions.push( config[i] );
    }

    return <div className="row-action" >
    <div className="row-action-inline">{this.renderActions( visibleActions, true )}</div>
    {menuActions.length>0&&<><a href="#" title="Actions" onClick={(e)=>this.click(e)}><i className="fas fa-ellipsis-h"></i></a>
    <div className={'action-menu '+(this.state.menuShown?'':'hide')}>
      {this.renderActions( menuActions, false )}
    </div></>}
    </div>
  }
}
