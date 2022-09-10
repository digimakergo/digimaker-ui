import './digimaker-ui.css';

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
  let config = util.getContentTypeSetting(contenttype);
  if(!fields) {
    if(mode == 'inline'){
      fields = config.inline_fields;
    }else if( mode == 'block'){
      fields = config.block_fields;
    }
  }

  const renderBaseAttr = (field: string) => {
    switch (field) {
      case 'name':
        return <Link to={'/main/' + content.id}>{content.name}</Link>;
      case 'published':
        return (
          <Moment unix format='DD.MM.YYYY HH:mm'>
            {content.published}
          </Moment>
        );
      case 'modified':
        return (
          <Moment unix format='DD.MM.YYYY HH:mm'>
            {content.modified}
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
              field +
              ' field-viewmode-inline' +
              ' fieldtype-' +
              fieldtypeStr
            }
          >
            <Fieldtype
              definition={fieldDef}
              data={content[field]}
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
              field +
              ' field-viewmode-inline' +
              ' fieldtype-' +
              fieldtypeStr
            }
          >
            {content[field]}
          </div>
        );
      }
    } else {
      //location related properties
      return (
        <div className={'content-baseattr-' + field}>
          {renderBaseAttr(field)}
        </div>
      );
    }
  }

  let contentFields = getFields(def);
  if (as == 'td') {
    return (
      <>
        {fields.map((field: any) => {
          return (
            <td key={field}>{renderField(field, contentFields[field])}</td>
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
          return (
            <React.Fragment key={field}>
              {renderField(field, contentFields[field])}
            </React.Fragment>
          );
        })}
      </div>
    );
  }
}


export default RenderProperties;
