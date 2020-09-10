import * as React from 'react';
import { useState, useEffect } from "react";
import util from './util';
import {FetchWithAuth} from './util';


const DMInit = (props:any)=>{
  const [inited, setInited] = useState(false);

  useEffect(() => {
    FetchWithAuth(process.env.REACT_APP_REMOTE_URL + '/contenttype/get')
        .then(res => res.json())
        .then((data) => {
          util.setDefinitionList( data );
          setInited(true)
        })
  }, []);


  return (<>{inited?props.children:''}</>); //todo: add loading
}
export default DMInit;
