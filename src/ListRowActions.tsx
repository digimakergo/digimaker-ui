import React, {useState} from 'react';
import Moment from 'react-moment';
import util from './util';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Actions from './Actions';

/** props for ListRowActionsProps */
interface ListRowActionsProps {
  /** Selected content */
  content: any;
  /** from object,{id:111} */
  from: any;

  /** action config array */
  config: any;
  /** refresh after it's called */
  afterAction: ()=>void;

  /** visiable number, rest is in pop up menu */
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
    afterAction();
  };

  const renderActions = (actionConfig: any, iconOnly: boolean) => {
    return (
      <Actions
        iconOnly={iconOnly}
        actionProps={{
          from: from,
          fromview: 'inline',
          params:{
            content:content,
            afterAction: (redirection: boolean) => setPropsAfterAction()
          }
        }
        }
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