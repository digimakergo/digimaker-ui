import * as React from 'react';
import {FetchWithAuth} from '../../util';
import util from '../../util';
import Browse from '../../Browse';
import {Dialog} from '../../util';
import { ActionProps, ContentActionParams, ListActionParams } from '../../Actions';



export default class UnassignRole extends React.Component<ActionProps, {}> {
  constructor(props: any) {
      super(props);
      this.state ={};
  }

  submit(){
      let params = this.props.params as ContentActionParams;
      let selected = params.content;
      FetchWithAuth(process.env.REACT_APP_REMOTE_URL + '/access/unassign/'+selected.cid+'/'+selected.role_id)
          .then((data) => {
            if( data.error === false ){
              params.afterAction();
            }
          }).catch(err=>{
          })
  }

  render(){
    return <Dialog title="Delete"
    key={this.props.counter}
    onSubmit={()=>this.submit()}>
    Confirm to unassign {(this.props.params as ContentActionParams).content.name}?
    </Dialog>;
  }
}
