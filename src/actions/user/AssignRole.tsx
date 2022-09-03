import * as React from 'react';
import {FetchWithAuth} from '../../util';
import util from '../../util';
import Browse from '../../Browse';


export default class AssignRole extends React.Component<{from:any, changed:boolean, selected?:any, afterAction?:any}, {triggered:boolean}> {

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
              this.props.afterAction(true, false)
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
