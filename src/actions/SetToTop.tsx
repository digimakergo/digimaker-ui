import * as React from 'react';
import {FetchWithAuth} from '../util';

export default class SetToTop extends React.Component<{from:any, content:any, afterAction:any}, {}> {
  private priortyStep = 100;

  constructor(props: any) {
      super(props);
  }


  removePriority(){
    let content = this.props.content;
    this.setPriority(content.id, 0);
  }

  setPriority(id:number, priority:number){
    FetchWithAuth(process.env.REACT_APP_REMOTE_URL + '/content/setpriority?params='+id+','+priority)
      .then((data:any)=>{
          if( data.error === false ){
            this.props.afterAction();
          }
      });
  }

  setToTop(){
    let content = this.props.content;
    FetchWithAuth(process.env.REACT_APP_REMOTE_URL + '/content/list/'+content.content_type+'?parent='+content.parent_id+'&sortby=priority%20desc&limit=1&offset=0')
      .then((data:any)=>{
        if( data.error === false ){
          let priority = this.priortyStep;
          let list = data.data.list;
          if( list.length > 0 ){
              let topPriority = list[0].priority;
              priority = topPriority+this.priortyStep;
          }
          this.setPriority( content.id, priority );
        }
      });
  }

  click(e, priority:any){
      e.preventDefault();
      if( priority ){
        this.removePriority();
      }else{
        this.setToTop();
      }
  }

  render(){
    let priority = this.props.content.priority;
    return (<div><a href="#" onClick={(e)=>this.click( e,priority )}>
                {priority!=0&&<><i className="fas fa-times"></i> Remove priority</>}
                {priority==0&&<><i className="fas fa-long-arrow-alt-up"></i> Set top priority</>}
                </a></div>)
  }
}
