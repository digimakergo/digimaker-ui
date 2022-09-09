import * as React from 'react';
import {FetchWithAuth} from '../../util';
import util from '../../util';
import Browse from '../../Browse';
import {Dialog} from '../../util';
import { ActionProps, ListActionParams } from '../../Actions';



export default class DisableUser extends React.Component<ActionProps, {counter: number, message: string}> {
  constructor(props: any) {
      super(props);
      this.state ={counter: 0, message:''};
  }

  execute(enable: boolean){
    this.setState({counter: this.state.counter+1});
    let params = this.props.params as ListActionParams;
    let selected = params.selected;
    if( selected.length == 0 ){
      this.setState({message: 'No item selected in the list.'});
    }else{
      let ids:any = [];
      selected.map((item:any)=>{
        ids.push( item.cid );
      });
      FetchWithAuth( process.env.REACT_APP_REMOTE_URL + '/user/enable/'+(enable?1:0)+'?id='+ids.join( ',' ) )
        .then((data)=>{
          if( data.error === false ){
            params.afterAction();
          }
        });
    }
  }

  render(){
    return <div>
        {this.state.message&& <Dialog type="confirm" onClose={()=>this.setState({message: ''})} title="Disable/enable user">{this.state.message}</Dialog>}
        <button className="btn btn-sm btn-link" onClick={()=>this.execute(false)}>Disable</button>&nbsp;
        <button className="btn btn-sm btn-link" onClick={()=>this.execute(true)}>Enable</button>
        </div>;
  }
}
