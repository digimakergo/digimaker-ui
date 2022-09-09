import React,{ useState, useEffect } from "react";
import util from './util';
import {FetchWithAuth} from './util';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

//Init things before loading ui
const DMInit = (props:any)=>{
  const [inited, setInited] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    FetchWithAuth(process.env.REACT_APP_REMOTE_URL + '/contenttype/get')
        .then((data) => {
          util.setDefinitionList( data.data );
          setInited(true)
        }).catch(err=>{
            setError( err );
        })
  }, []);

  if( error ){
    throw error
  }

  return (<><DndProvider backend={HTML5Backend}>{inited?props.children:''}</DndProvider></>); //todo: add loading
}
export default DMInit;
