import './digimaker-ui.css';

import * as React from 'react';
import { useState } from "react";
import { Link } from "react-router-dom";
import {getDefinition,getFields} from './util';
import util from './util';
import Moment from 'react-moment';
import FieldRegister from './FieldRegister';

//Render properties which renders field's inline mode.
//This is same as like render-content when it's not invoked in a table list(as='td').
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

  const renderBaseAttr = ( field:string )=>{
    switch( field ){
    case "name":
      return <Link to={"/main/"+content.id}>{content.name}</Link>;
     case 'published':
       return <Moment unix format="DD.MM.YYYY HH:mm">{content.published}</Moment>;
     case 'modified':
       return <Moment unix format="DD.MM.YYYY HH:mm">{content.modified}</Moment>;
     case 'priority':
       return content[field]?<span title={content[field]}><i className="fas fa-check"></i></span>:'';
     case 'status':
         return <span className={"status-"+content.status}></span>;
     default:
        return content[field];
    }
  }

  const renderField = (field, fieldDef:any)=>{
      if(fieldDef ){
        let fieldtypeStr = fieldDef.type;
        const Fieldtype: React.ReactType = FieldRegister.getFieldtype(fieldtypeStr);
        if(Fieldtype){
          return <div className={"field-"+field+" field-viewmode-inline"+" fieldtype-"+fieldtypeStr}>
                    <Fieldtype definition={fieldDef} data={props.content[field]} mode="inline" />
                  </div>;
        }else{
          return '';
        }
      }else{
        //location related properties
      return <div className={"content-baseattr-"+field}>
          {renderBaseAttr( field )}
        </div>;
      }
  };

  let contentFields = getFields(def);
  if( props.as == 'td' ){
    return <>{fields.map((field:any)=>{
        return <td key={field}>{renderField(field, contentFields[field] )}</td>;
      })}</>;
  }else{
    return <div className={"contenttype-"+props.contenttype+" content-view content-viewmode-"+props.mode}>
              {fields.map((field:any)=>{
                    return <React.Fragment key={field}>{renderField(field, contentFields[field])}</React.Fragment>;
              })}
            </div>;
  }

}

export default RenderProperties;
