import * as React from 'react';
import { ActionProps, ContentActionParams } from '../ActionsRender';
import {FetchWithAuth} from '../util';

const SetToTop =( props:ActionProps) => {
   let priortyStep = 100;
   let params = props.params as ContentActionParams;


  const removePriority = ()=>{
    let content = params.content;
    setPriority(content.location.id, 0);
  }

  const setPriority = (id:number, priority:number) =>{
    FetchWithAuth(process.env.REACT_APP_REMOTE_URL + '/content/setpriority?params='+id+','+priority)
      .then((data:any)=>{
          if( data.error === false ){
            params.afterAction(true);
          }
      });
  }

  const setToTop = ()=>{
    let content = params.content;
    FetchWithAuth(process.env.REACT_APP_REMOTE_URL + '/content/list/'+content.metadata.contenttype+'?parent='+content.location.parent_id+'&sortby=priority%20desc&limit=1&offset=0')
      .then((data:any)=>{
        if( data.error === false ){
          let priority = priortyStep;
          let list = data.data.list;
          if( list.length > 0 ){
              let topPriority = list[0].location.priority;
              priority = topPriority+priortyStep;
          }
          setPriority( content.location.id, priority );
        }
      });
  }

  const click = (e, priority:any) => {
      e.preventDefault();
      if( priority ){
        removePriority();
      }else{
        setToTop();
      }
  }

  let priority = params.content.location.priority;
  return (<div className='action-item'><a href="#" onClick={(e)=>click( e,priority )} style={{padding: '0px 5px'}}>
                {priority!=0&&<><i className="fas fa-times" title='Remove priority'></i></>}
                {priority==0&&<><i className="fas fa-long-arrow-alt-up" title='Set top priority'></i></>}
                </a></div>)
}


export default SetToTop;