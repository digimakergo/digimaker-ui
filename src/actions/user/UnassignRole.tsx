import * as React from 'react';
import {FetchWithAuth} from '../util';
import util from '../util';
import Browse from '../Browse';
import {Dialog} from '../util';



export default class UnassignRole extends React.Component<{from:any, changed:boolean, counter:any, selected?:any, afterAction?:any}, {}> {
  constructor(props: any) {
      super(props);
      this.state ={};
  }

  submit(){
      let selected = this.props.selected;
      FetchWithAuth(process.env.REACT_APP_REMOTE_URL + '/access/unassign/'+selected.cid+'/'+selected.role_id)
          .then((data) => {
            if( data.error === false ){
              this.props.afterAction(true, false);
            }
          }).catch(err=>{
          })
  }

  render(){
    return <Dialog title="Delete"
    key={this.props.counter}
    onSubmit={()=>this.submit()}>
    Confirm to unassign {this.props.selected.name}?
    </Dialog>;
  }
}
