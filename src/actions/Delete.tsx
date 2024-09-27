import * as React from 'react';
import { FetchWithAuth, Dialog, getDefinition } from '../util';
import {ActionProps, ContentActionParams, ListActionParams} from '../ActionsRender';
import { i18n } from '../i18n';
import { useEffect } from 'react';

const Delete = (props:ActionProps) => {
  const [shown, setShown] = React.useState(false);
  const fromView = props.fromview;
  let selected:Array<any> = [];
  let def:any = {};
  let contentType = '';
  if(fromView==='content'|| fromView==='inline'){
    const params = props.params as ContentActionParams;
    selected.push(params.content);
    contentType = params.content.metadata.contenttype;
  }else if(fromView ==='list'){
    const params = props.params as ListActionParams;
    selected = params.selected
    contentType = props.from.list_contenttype;
  }else{
    return <span>Invalid parameter</span>
  }
  
  def = getDefinition(contentType)

  useEffect(()=>{
    
  },[]);

  const body = () => {
    if( def.has_location ){
      return <div><h4>Are you sure to delete {selected.length} {def.name} below(and its children if has)?</h4>
          <ul>{selected.map(item=><li>{item.metadata.name}</li>)}</ul>
        </div>
    }else{
      return <div><h4>Are you sure to delete {def.name} below?</h4>
          <ul>{selected.map(item=><li>ID: {item.id}</li>)}</ul>
        </div>
    }
  }

  const confirm = (e)=>{
    e.preventDefault();
    if(selected.length>0){
      setShown(true);
    }else{
      window.alert('Please select');
    }
  }

  const submit = () => {
    let paramsStr = '';
    if( def.has_location ){
      paramsStr = 'id='+selected.map(item=>item.location.id).join(',');
    }else{
      paramsStr = 'cid='+selected.map(item=>item.id).join(',')+'&type='+ contentType;
    }
    FetchWithAuth('content/delete?'+paramsStr)
      .then((data) => {
        if( data.error === false ){
          setShown(false);
          if (fromView!='list') {
            props.params.afterAction(); 
          }else{
            props.params.afterAction();
          }
         }
        }
      );
  }

  return (
    <div className='action-item'>
    <a href="#" title={i18n.t('Delete')} onClick={confirm}><i className="fas fa-trash"></i>{props.iconOnly?'':i18n.t('Delete')} {fromView==='list'?i18n.t('selected'):''}</a>
    {shown&&<Dialog key={props.counter} title={"Delete "+def.name} onClose={()=>setShown(false)} onSubmit={submit}>
      {body()}
    </Dialog>}</div>
  );
};

export default Delete;
