import * as React from 'react';
import {FetchWithAuth} from '../util';
import Browse from '../Browse';
import util from '../util';

export default class Move extends React.Component<{config:any, content:any, from:any, counter:number, afterAction:any; selected?:any}, {shown:boolean, operating:boolean}> {

  constructor(props: any) {
      super(props);
      this.state = {shown:false, operating:false};
  }

  getContainerTypes(contenttype:string){
    //todo: use other way to get list since this one is not reliable
    let filterConfig = util.getConfig().browse.filter;
    let result = util.getSettings( filterConfig, contenttype ).contenttype;
    return result;
  }

  selectedTarget(target){
      if(target){
        this.setState({operating: true});
        FetchWithAuth(process.env.REACT_APP_REMOTE_URL + "/content/move/"+this.props.content.id+"/"+target.id)
            .then((data) => {
              if( data.error === false ){
                this.setState({operating: false});
                this.props.afterAction(true, false)
              }
            })
      }
    this.setState({shown: false});
  }

  render(){
    return <div>
        <a href="javascript:void(0)" onClick={()=>this.setState({shown:true})}>
        <i className={this.props.config['icon']}></i>{this.props.config['name']}</a>
        {this.state.operating&&<div>Loading...</div>}
        {this.state.shown&&<Browse key={this.props.counter} trigger={true} config={util.getConfig().browse} contenttype={this.getContainerTypes(this.props.content.content_type)} onConfirm={(target:any)=>{this.selectedTarget(target)}} onCancel={()=>this.setState({shown:false})} />}
        </div>
  }
}
