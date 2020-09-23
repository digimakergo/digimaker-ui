import * as React from 'react';
import { useState, useEffect } from "react";
import util from './util';
import {FetchWithAuth} from './util';


//Init things before loading ui
const DMInit = (props:any)=>{
  const [inited, setInited] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    FetchWithAuth(process.env.REACT_APP_REMOTE_URL + '/contenttype/get')
        .then(res => res.json())
        .then((data) => {
          util.setDefinitionList( data );
          setInited(true)
        }).catch(err=>{
            setError( err );
        })
  }, []);

  if( error ){
    throw error
  }

  return (<>{inited?props.children:''}</>); //todo: add loading
}
export default DMInit;
