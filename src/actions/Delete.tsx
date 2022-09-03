import * as React from 'react';
import { FetchWithAuth, useDialog, Dialog, getDefinition } from '../util';

const Delete = (props) => {
  const [shown, setShown] = React.useState(false);
  const selected = props.selected;
  const def = getDefinition(selected.content_type);

  const body = () => {
    if( def.has_location ){
      return <div><h4>Are you sure to delete {selected.name}(and its children if has)?</h4>
          <ul><li>{selected.name}</li></ul>
        </div>
    }else{
      return <div><h4>Are you sure to delete {def.name}?</h4>
          <ul><li>ID: {selected.id}</li></ul>
        </div>
    }
  }

  const submit = () => {
    let idStr = props.selected.id;
    let params = '';
    if( def.has_location ){
      params = 'id='+idStr;
    }else{
      params = 'cid='+idStr+'&type='+ props.selected.content_type
    }
    FetchWithAuth(process.env.REACT_APP_REMOTE_URL + '/content/delete?'+params)
      .then((data) => {
        if( data.error === false ){
          let jumpToParent = false;
          if (props.fromview=='content') {
            jumpToParent = true;
          }
          props.afterAction(true, jumpToParent); 
         }
        }
      );
  }

  return (
    <div className='action-item'>
    <a href="javascript:void(0)" onClick={()=>setShown(true)}><i className="fas fa-trash"></i>{props.config['name']}</a>
    {shown&&<Dialog key={props.counter} title={"Delete "+def.name} onClose={()=>setShown(false)} onSubmit={submit}>
      {body()}
    </Dialog>}</div>
  );
};

export default Delete;
