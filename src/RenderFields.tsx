import React, { ReactEventHandler, ReactHTMLElement } from 'react';
import FieldRegister from './FieldRegister';
import ReactTooltip from 'react-tooltip';
import { FetchWithAuth } from './util';

interface RenderFieldsProps {
  /** field type */
  type: string;

  /** validation result returned from server. used in edit mode */
  validation?: any;

  /** field data */
  data: any;

  /** array of field identifier to be edited */
  editFields?: any;

  /** edit langauge */
  language?: string;

  /** render mode */
  mode?: 'edit'|'view';

  /** before rendering one field */
  beforeField?: any;

  /** after rendering one field */
  afterField?: any;

  afterLabel?:any
}

const RenderFields = ({type, validation, data, editFields, language, mode, beforeField, afterField, afterLabel}: RenderFieldsProps) => {
  const [definition, setDefinition] = React.useState('');
  const [typeArr, setTypeArr] = React.useState([]);

  const fetchData = () => {
    let languageParams = language
      ? '?language=' + language
      : '';
    FetchWithAuth(     
        'contenttype/get/' +
        type.split('/')[0] +
        languageParams
    ).then((data) => {
      setDefinition(data.data);
      setTypeArr(type.split('/'));
    });
  };

  React.useEffect(() => {
    fetchData();
  }, [language]);

  const fold = (e: React.BaseSyntheticEvent<EventTarget>) => {
    e.preventDefault();
    const target = e.target;
    if (target.classList.contains('container-close')) {
      target.classList.remove('container-close');
    } else {
      target.classList.add('container-close');
    }
  };

  const renderField = (field: any, containerLevel?: number) => {
    if(!containerLevel){
      containerLevel = 1;
    }
    if (field.children) {
      return (
        <div
          key={field.identifier}
          className={`field-container level${containerLevel} field-${field.identifier}`}
        >
          <div className='container-title' onClick={(e:any) => fold(e)}>
            {beforeField &&
              beforeField(field, data, null)}
            <a href='#' className='closable'>
              <i className='fas fa-chevron-down'></i>
            </a>
            <span>{field.name}</span>
            {field.description && (
              <i
                className='icon-info'
                data-for={field.identifier + '-description'}
                data-tip=''
              />
            )}
            {field.description && (
              <ReactTooltip
                id={field.identifier + '-description'}
                effect='solid'
                place='right'
                html={true}
                clickable={true}
                multiline={true}
                delayHide={500}
                className='tip'
              >
                {field.description}
              </ReactTooltip>
            )}
            {afterLabel &&
              afterLabel(field, data, null)}
            {afterField &&
              afterField(field, data, null)}
          </div>
          <div className='children'>
            {field.children.map((child) => {
              return (
                <React.Fragment key={child.identifier}>
                  {renderField(child, containerLevel + 1)}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      );
    } else {
      const typeStr = field.type;
      const fieldIdentifier = field.identifier;
      const validationResult = validation;

      const fieldPath = type.split('/')[0] + '/' + fieldIdentifier;
      const Fieldtype: React.ReactType = FieldRegister.getFieldtype(
        typeStr,
        fieldPath
      );
      if (Fieldtype) {
        const BeforeElement: React.ReactType = beforeField
          ? beforeField(field, data, null)
          : null;
        const AfterElement: React.ReactType = afterField
          ? afterField(field, data, null)
          : null;      
        
        let required = false;
        if (field.required && mode == 'edit') {
          required = true;
        }

        let resultRequired = false;
        let errorMessage = '';
        let validationPassed = true;
        if (
          mode == 'edit' &&
          validationResult &&
          validationResult.fields &&
          validationResult.fields[fieldIdentifier]
        ) {
          if (validationResult.fields[fieldIdentifier] == '1') {
            resultRequired = true;
          } else {
            errorMessage = validationResult.fields[fieldIdentifier];
          }
          if (resultRequired || errorMessage) {
            validationPassed = false;
          }
        }

        let currentMode = mode;
        if (mode == 'edit') {
          if (
            editFields &&
            !editFields.includes('*') &&
            !editFields.includes(fieldIdentifier)
          ) {
            currentMode = 'view';
          }
        }
        return (
          <>
            {BeforeElement}
            <div
              className={
                'field-id-' +
                field.identifier +
                ' field-mode-' +
                currentMode +
                ' fieldtype-' +
                typeStr +
                (required ? ' required' : '') +
                (validationPassed ? '' : ' field-validation-failed') +
                (resultRequired ? ' field-validation-required' : ' ')
              }
            >
              <Fieldtype
                definition={field}
                data={data && data[fieldIdentifier]}
                formdata={data}
                contenttype={type}
                validation={
                  validationResult && fieldIdentifier in validationResult.fields
                    ? validationResult.fields[fieldIdentifier]
                    : ''
                }
                formValidation={validationResult}
                mode={currentMode}
                afterLabel={afterLabel}
              />
              {AfterElement}
              {errorMessage && (
                <div className='validation-failed-field-error'>
                  {errorMessage}
                </div>
              )}
            </div>
          </>
        );
      } else {
        if (field.type) {
          return field.type + ' is not supported.';
        }
      }
    }
  }

    if (!definition) {
      return <div className='loading'></div>;
    }
    let parent: any = '';
    var fields = ((definition as unknown) as {fields: any}).fields;
    if (typeArr.length > 1) {
      var identifier: string;
      identifier = typeArr[1];
      var currentField;
      fields.map((field) => {
        if (field.identifier == identifier) {
          currentField = field;
        }
      });
      if (!currentField) {
        return <div>{identifier} not found</div>;
      }
      parent = currentField;
      fields = currentField.children;
    }
    return (
      <>
        {parent && (
          <div className='fields-parent'>
            {parent.parameters && parent.parameters.fullname && (
              <div className='field-title'>
                {parent.parameters.fullname}
                {parent.description && (
                  <i
                    className='icon-info'
                    data-for={parent.identifier + '-description'}
                    data-tip=''
                  ></i>
                )}
                {parent.description && (
                  <ReactTooltip
                    id={parent.identifier + '-description'}
                    effect='solid'
                    place='right'
                    html={true}
                    clickable={true}
                    multiline={true}
                    delayHide={500}
                    className='tip'
                  >
                    {parent.description}
                  </ReactTooltip>
                )}
              </div>
            )}
          </div>
        )}
        <div className={'content-fields content-fields-' + mode}>
          {validation && validation.message && (
            <div className='validation-failed validation-failed-error'>
              {validation.message}
            </div>
          )}
          {fields.map((field) => {
            return (
              <React.Fragment key={field.identifier}>
                {renderField(field)}
              </React.Fragment>
            );
          })}
        </div>
      </>
    );
}

export default RenderFields;