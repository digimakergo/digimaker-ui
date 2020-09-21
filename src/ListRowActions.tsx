import * as React from 'react';
import Moment from 'react-moment';
import util from './util';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Actions from './Actions';

export default class ListRowActions extends React.Component<{content:any,from:any,config:any,afterAction:any}, {menuShown:boolean}> {
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

  render(){
    let config = this.props.config;

    if(!config){
      return '';
    }

    return <div className="row-action" >
    <a href="#" title="Actions" onClick={(e)=>this.click(e)}><i className="fas fa-ellipsis-h"></i></a>
    <div className={'action-menu '+(this.state.menuShown?'':'hide')}>
      <Actions content={this.props.content} from={this.props.from} fromview="inline" selected={this.props.content} afterAction={()=>this.afterAction()} actionsConfig={config} />
    </div>
    </div>
  }
}
