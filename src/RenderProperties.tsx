
import React from 'react';
import { Link } from "react-router-dom";
import {getDefinition,getFields} from './util';
import util from './util';
import Moment from 'react-moment';
import FieldRegister from './FieldRegister';

interface RenderPropertiesProps {
  content: any;
  contenttype: string;
  mode: 'inline'|'block';
  fields?: Array<string>;
  as?: string;
}

function RenderProperties({content, contenttype, mode, fields, as}: RenderPropertiesProps) {
  let def = getDefinition(contenttype);
  let config = util.getViewSettings(contenttype);
  if(!fields) {
    if(mode == 'inline'){
      fields = config.inline_fields;
    }else if( mode == 'block'){
      fields = config.block_fields;
    }
  }

  const renderBaseAttr = (field: any) => {
    switch (field) {
      case 'name':
        return content.location?<Link to={'/main/' + content.location.id}>{content.metadata.name}</Link>:content.name;
      case 'published':
        return (
          // unix format='DD.MM.YYYY HH:mm' 
          <Moment  {...util.dateTime}>
            {content.metadata.published}
          </Moment>
        );
      case 'modified':
        return (
          <Moment  {...util.dateTime}>
            {content.metadata.modified}
          </Moment>
        );
      case 'priority':
        return content[field] ? (
          <span title={content[field]}>
            <i className="fas fa-check"></i>
          </span>
        ) : (
          ''
        );
      case 'status':
        return <span className={'status-' + content.status}></span>;
      default:
        return util.getValue(field, content);
    }
  };

  const renderField = (field, fieldDef: any) => {
    let fieldIdentifier= typeof(field)==='string'?field:field.field;
    if (fieldDef) {
      let fieldtypeStr = fieldDef.type;
      const Fieldtype: React.ReactType = FieldRegister.getFieldtype(
        fieldtypeStr,
        contenttype + '/' + fieldDef.identifier
      );
      if (Fieldtype) {
        return (
          <div
            key={content.id}
            className={
              'field-' +
              fieldIdentifier+
              ' field-viewmode-inline' +
              ' fieldtype-' +
              fieldtypeStr
            }
          >
            <Fieldtype
              definition={fieldDef}
              data={content[fieldIdentifier]}
              mode='inline'
            />
          </div>
        );
      } else {
        return (
          <div
            key={content.id}
            className={
              'field-' +
              fieldIdentifier +
              ' field-viewmode-inline' +
              ' fieldtype-' +
              fieldtypeStr
            }
          >
            {content[fieldIdentifier]}
          </div>
        );
      }
    } else {
      //location related properties
      return (
        <div className={'content-baseattr-' + fieldIdentifier}>
          {field.render?field.render(content):renderBaseAttr(fieldIdentifier)}
        </div>
      );
    }
  }

  let contentFields = getFields(def);
  if (as == 'td') {
    return (
      <>
        {fields.map((field: any) => {
          let fieldIdentifier= typeof(field)==='string'?field:field.field
          return (
            <td key={fieldIdentifier}>{renderField(field, contentFields[fieldIdentifier])}</td>
          );
        })}
      </>
    );
  } else {
    return (
      <div
        className={
          'contenttype-' +
          contenttype +
          ' content-view content-viewmode-' +
          mode
        }
      >
        {fields.map((field: any) => {
           let newfield= typeof(field)==='string'?field:field.field
          return (
            <React.Fragment key={newfield}>
              {renderField(field, contentFields[newfield])}
            </React.Fragment>
          );
        })}
      </div>
    );
  }
}


export default RenderProperties;
