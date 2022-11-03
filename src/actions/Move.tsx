import * as React from 'react';
import {FetchWithAuth} from '../util';
import Browse from '../Browse';
import util from '../util';
import { ActionProps, ContentActionParams} from '../Actions';

export default class Move extends React.Component<ActionProps, {shown:boolean, operating:boolean}> {


  constructor(props: any) {
      super(props);
      this.state = {shown:false, operating:false};
  }

  getContainerTypes(contenttype:string){
    //todo: use other way to get list since this one is not reliable
    let filterConfig = util.getConfig().browse.filter;
    let result = util.getSettings( filterConfig, contenttype, "" ).contenttype;
    return result;
  }

  selectedTarget(target){
      if(target){
        this.setState({operating: true});
        let params = this.props.params as ContentActionParams;
        let id = params.content.id;
        FetchWithAuth(process.env.REACT_APP_REMOTE_URL + "/content/move/"+id+"/"+target.id)
            .then((data) => {
              if( data.error === false ){
                this.setState({operating: false});
                params.afterAction();
              }
            })
      }
    this.setState({shown: false});
  }

  render(){
    let params = this.props.params as ContentActionParams;

    return <div>
        <a href="#" onClick={(e)=>{this.setState({shown:true}); e.preventDefault()}}>
        <i className="icon-move"></i>Move</a>
        {this.state.operating&&<div>Loading...</div>}
        {this.state.shown&&<Browse key={this.props.counter} trigger={true} contenttype={this.getContainerTypes(params.content.content_type)} onConfirm={(target:any)=>{this.selectedTarget(target)}} onCancel={()=>this.setState({shown:false})} />}
        </div>
  }
}
