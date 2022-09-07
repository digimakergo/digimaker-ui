import * as React from 'react';
import {FetchWithAuth} from '../../util';
import util from '../../util';
import Browse from '../../Browse';
import { ActionProps, ListActionParams } from '../../Actions';


export default class AssignRole extends React.Component<ActionProps, {triggered:boolean}> {

  constructor(props: any) {
      super(props);
      this.state = {triggered: props.changed};
  }

  //close dialog
  close(){
    this.setState({triggered:false});
  }

  selectedTarget(target){
    if( target ){
      FetchWithAuth(process.env.REACT_APP_REMOTE_URL + '/access/assign/'+this.props.from.id+'/'+target.cid)
          .then((data) => {
            if( data.error === false ){
              let listParams = this.props.params as ListActionParams
              .afterAction()
            }
          });
    }
  }

  render(){
    return <div>
            <Browse trigger={true} config={util.getConfig().browse} contenttype={["user"]} onConfirm={(target:any)=>{this.selectedTarget(target)}} />
          </div>
  }
}
