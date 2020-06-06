import * as React from 'react';
import Moment from 'react-moment';
import ReactTooltip from 'react-tooltip';

export default class RelationList extends React.Component<{definition:any, validation:any, beforeField:any, afterField:any, data:any, mode:string},{}> {

  edit(){
    return <div>{this.props.definition.name}:
              <button className="btn btn-link btn-sm"><i className="fas fa-plus-circle"></i>&nbsp;Add</button>
           </div>
  }

  view(){
    return <div>{this.props.definition.name}:

           </div>
  }

  render(){
    if(this.props.mode=='edit'){
      return this.edit();
    }else if(this.props.mode=='view'){
      return this.view();
    }
  }
}
