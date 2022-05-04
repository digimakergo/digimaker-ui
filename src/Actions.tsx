import * as React from 'react';
import { Link } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import util from './util';
import {getDefinition} from './util';
import Registry from './Registry';
import { Modal, Accordion, Button } from 'react-bootstrap';

interface ActionsProps {
  actionsConfig: any;
  fromview: string;
  content: any;
  iconOnly?: boolean;
  from?: any;
  selected?: any;
  afterAction?: any;
  parameters?: any;
}

function Actions({actionsConfig, fromview, content, iconOnly, from, selected, afterAction, parameters}: ActionsProps) {
  const renderLink = (config: any) => {
    let path = '';
    if (config.link) {
      let variables = {};
      if (content) {
        variables = { ...content }; //can support more attribute also.
        let def = getDefinition(content.content_type);
        variables['_contenttype_id'] = def.has_location
          ? content.id
          : content.content_type + '/' + content.id;
      }
      if (from) {
        for (let key in from) {
          variables['_from_' + key] = from[key];
        }
      }
      path = util.washVariables(config.link, variables); //todo: support component here also
    }

    let newWindow = config.new ? true : false;

    let linkText = (
      <>
        <i className={config.icon ? 'icon ' + config.icon : 'fas fa-tools'}></i>
        {!iconOnly && config.name ? config.name : ''}
      </>
    );

    return (
      <div className='action-item'>
        {!newWindow && (
          <Link to={path}>{linkText}</Link>
        )}
        {newWindow && (
          <a href={path} target='_blank' rel='noopener noreferrer'>
            {linkText}
          </a>
        )}
      </div>
    );
  };

  if (!actionsConfig) {
    return null;
  }

  return (
    <div className='actions'>
      {actionsConfig.map((actions: any) => {
        if (actions['link']) {
          return renderLink(actions);
        }

        if (actions['com']) {
          let identifier = actions['com'];
          let Action = Registry.getComponent(identifier);
          return (
            <React.Suspense fallback='...'>
              <Action
                config={actions}
                parameters={parameters}
                fromview={fromview}
                selected={selected}
                afterAction={afterAction}
                content={content}
                from={from}
              />
            </React.Suspense>
          );
        }
        return null;
      })}
    </div>
  );
}

export default Actions;