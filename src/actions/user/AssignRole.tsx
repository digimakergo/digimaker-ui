import * as React from 'react';
import {FetchWithAuth} from '../../util';
import util from '../../util';
import Browse from '../../Browse';
import { ActionProps, ListActionParams } from '../../ActionsRender';


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
      FetchWithAuth('access/assign/'+this.props.from.id+'/'+target.cid)
          .then((data) => {
            if( data.error === false ){
              let listParams = this.props.params as ListActionParams;
              listParams.afterAction();
            }
          });
    }
  }

  render(){
    return <div>
            <Browse trigger={true} contenttype={["user"]} onConfirm={(target:any)=>{this.selectedTarget(target)}} />
          </div>
  }
}
