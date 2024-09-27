import * as React from 'react';
import {FetchWithAuth} from '../../util';
import util from '../../util';
import Browse from '../../Browse';
import {Dialog} from '../../util';
import { ActionProps, ContentActionParams, ListActionParams } from '../../ActionsRender';



export default class UnassignRole extends React.Component<ActionProps, {shown:boolean}> {
  constructor(props: any) {
      super(props);
      this.state ={shown:true};
  }

  submit(){
      let params = this.props.params as ContentActionParams;
      let selected = params.content;
      FetchWithAuth('access/unassign/'+selected.cid+'/'+selected.role_id)
          .then((data) => {
            if( data.error === false ){
              this.setState({shown: false});
              params.afterAction();
            }
          }).catch(err=>{
          })
  }

  render(){
    return <span>{this.state.shown&&<Dialog title="Delete"
    onSubmit={()=>this.submit()}
    onClose={()=>this.setState({shown:false})}>
    Confirm to unassign {(this.props.params as ContentActionParams).content.metadata.name}?
    </Dialog>}</span>;
  }
}
