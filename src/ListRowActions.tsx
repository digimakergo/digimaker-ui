import React, {useState} from 'react';
import Moment from 'react-moment';
import util from './util';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Actions from './Actions';

interface ListRowActionsProps {
  content: any;
  from: any;
  config: any;
  afterAction: any;
  visibleNumber?: number;
}

function ListRowActions({content, from, config, afterAction, visibleNumber}: ListRowActionsProps) {
  const [menuShown, setMenuShown] = useState(false);

  const click = (e: any) => {
    e.preventDefault();
    setMenuShown(!menuShown);
  };

  const setPropsAfterAction = () => {
    setMenuShown(false);
    afterAction(true);
  };

  const renderActions = (actionConfig: any, iconOnly: boolean) => {
    return (
      <Actions
        content={content}
        iconOnly={iconOnly}
        from={from}
        fromview='inline'
        selected={content}
        afterAction={() => setPropsAfterAction()}
        actionsConfig={actionConfig}
      />
    );
  };

  visibleNumber = visibleNumber || 3;

  if (config.length < visibleNumber) {
    visibleNumber = config.length;
  }

  if (!config) {
    return null;
  }

  let visibleActions: any = [];
  let menuActions: any = [];

  for (let i = 0; i < visibleNumber; i++) {
    visibleActions.push(config[i]);
  }
  for (let i = visibleNumber; i < config.length; i++) {
    menuActions.push(config[i]);
  }

  return (
    <div className='row-action'>
      <div className='row-action-inline'>
        {renderActions(visibleActions, false)}
      </div>
      {menuActions.length > 0 && (
        <>
          <a href='#' title='Actions' onClick={(e) => click(e)}>
            <i className='fas fa-ellipsis-h'></i>
          </a>
          <div
            className={'action-menu ' + (menuShown ? '' : 'hide')}
          >
            {renderActions(menuActions, false)}
          </div>
        </>
      )}
    </div>
  );
}

export default ListRowActions;