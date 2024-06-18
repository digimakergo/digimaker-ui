import React,{ useState, useEffect, ReactChild, ReactChildren } from "react";
import util from './util';
import {FetchWithAuth} from './util';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ListProps } from "./List";


export interface BrowseListProps extends ListProps{
      /** viewmode of list, default is list */
      viewmode?: "list"|"block";

      /** columns of the list */
      columns: any[];
  
      /** default sorting */
      sort_default?:string[][];    
}

export interface ViewSettingsType{
  /** fields when displayed as inlined. eg. when selected */
  inline_fields: string[];

  /** fields when displayed as block. eg. for image */
  block_fields?:string[];
  browselist: BrowseListProps;
}

interface dateTimeType{
  format?:string
  tz?:any
  [propsName:string]:any
}

export interface BrowseAfterListProps{
  contenttype: string,
  parent: number,
  refresh: (selectedData:any)=>void
}

interface DMInitProps {
  viewSettings: (contenttype: string)=> ViewSettingsType;
  dateTime?:dateTimeType
  children: JSX.Element|JSX.Element[];
  lang?:string;
  getRefreshToken?:()=>string;
  browseAfterList?:(props:BrowseAfterListProps)=>React.ReactNode
}

//Init things before loading ui
const DMInit = (props:DMInitProps)=>{
  const [inited, setInited] = useState(false);
  const [error, setError] = useState(false);
  

  useEffect(() => {
    util.getViewSettings = props.viewSettings;    
    util.dateTime={...util.dateTime,...props.dateTime};
    if(props.lang){
      util.lang = props.lang;
    }

    if(props.getRefreshToken){
      util._getRefreshToken = props.getRefreshToken;
    }

    util.browseAfterList=props.browseAfterList;
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
