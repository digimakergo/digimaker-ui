import * as React from 'react';
import { useState } from "react";
import { Link } from "react-router-dom";
import {getDefinition,getFields} from './util';
import util from './util';
import RenderField from './RenderField';
import Moment from 'react-moment';

const RenderProperties = (props:{content:any, contenttype:string, mode:string, fields?:Array<string>, as?:string}) => {
  const [def, setDef] = useState('');

  const loadDef = ()=>{
    getDefinition(props.contenttype).then((data:any)=>{
      setDef( data );
    })
  };

  if( !def ){
      loadDef();
      return <div />;
  }
  let config = util.getConfig();
  let content = props.content;
  let fields = [];
  if( props.fields ){
    fields = props.fields;
  }else{
    fields = config.viewmode[props.mode][props.contenttype]  
  }

  const renderField = (field:any)=>{
      let contentFields = getFields(def);
      if( contentFields[field] ){
        return <RenderField identifier={field} def={contentFields[field]} data={content[field]} mode={props.mode} />
      }else{
        //location related properties
        switch( field ){
            case "name":
              return <Link to={"/main/"+content.id}>{content.name}</Link>
             case 'published':
               return <Moment unix format="DD.MM.YYYY HH:mm">{content.published}</Moment>
             case 'modified':
               return <Moment unix format="DD.MM.YYYY HH:mm">{content.modified}</Moment>
             case 'priority':
               return content[field]?content[field]:'';
             case 'status':
                 return <span className={"workflow-status status-"+content.status}></span>
             default:
                return content[field];
        }
      }
  };

  return <>{fields.map((field:any)=>{
    if( props.as == 'td' ){
        return <td className={"field-"+field+" field-mode-"+props.mode}>{renderField(field)}</td>;
    }else{
        return <div className={"field-"+field+" field-mode-"+props.mode}>{renderField(field)}</div>;
    }
  })}</>

}

export default RenderProperties;
