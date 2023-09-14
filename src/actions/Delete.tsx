import * as React from 'react';
import { FetchWithAuth, Dialog, getDefinition } from '../util';
import {ActionProps, ContentActionParams} from '../ActionsRender';

const Delete = (props:ActionProps) => {
  const [shown, setShown] = React.useState(false);
  const params = props.params as ContentActionParams;
  const selected = params.content;
  const def = getDefinition(selected.metadata.contenttype);

  const body = () => {
    if( def.has_location ){
      return <div><h4>Are you sure to delete {selected.name}(and its children if has)?</h4>
          <ul><li>{selected.metadata.name}</li></ul>
        </div>
    }else{
      return <div><h4>Are you sure to delete {def.name}?</h4>
          <ul><li>ID: {selected.id}</li></ul>
        </div>
    }
  }

  const submit = () => {
    let paramsStr = '';
    if( def.has_location ){
      paramsStr = 'id='+selected.location.id;
    }else{
      paramsStr = 'cid='+selected.id+'&type='+ selected.metadata.contenttype
    }
    FetchWithAuth(process.env.REACT_APP_REMOTE_URL + '/content/delete?'+paramsStr)
      .then((data) => {
        if( data.error === false ){
          if (props.fromview=='content') {
            params.afterAction(true); 
          }else{
            params.afterAction();
          }
         }
        }
      );
  }

  return (
    <div className='action-item'>
    <a href="#" onClick={(e)=>{setShown(true); e.preventDefault()}}><i className="fas fa-trash"></i>{props.iconOnly?'':'Delete'}</a>
    {shown&&<Dialog key={props.counter} title={"Delete "+def.name} onClose={()=>setShown(false)} onSubmit={submit}>
      {body()}
    </Dialog>}</div>
  );
};

export default Delete;
