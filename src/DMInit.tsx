import React,{ useState, useEffect, ReactChild, ReactChildren } from "react";
import util from './util';
import {FetchWithAuth} from './util';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';


export interface BrowseListProps{
      /** viewmode of list, default is list */
      viewmode?: "list"|"block";

      /** columns of the list */
      columns: string[];
  
      /** default sorting */
      sort_default?:string[][];    
  
      /** sortable fields and sort */
      sort?:{string:string};  
}

export interface ViewSettingsType{
  /** fields when displayed as inlined. eg. when selected */
  inline_fields: string[];

  /** fields when displayed as block. eg. for image */
  block_fields?:string[];
  browselist: BrowseListProps;
}


interface DMInitProps {
  viewSettings: (contenttype: string)=> ViewSettingsType;
  children: JSX.Element|JSX.Element[];
}

//Init things before loading ui
const DMInit = (props:DMInitProps)=>{
  const [inited, setInited] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    util.getViewSettings = props.viewSettings;
    FetchWithAuth(process.env.REACT_APP_REMOTE_URL + '/contenttype/get')
        .then((data) => {
          let def = data.data;
          util.setDefinitionList( def );          
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
