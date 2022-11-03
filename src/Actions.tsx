import * as React from 'react';
import { Link } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import util from './util';
import {getDefinition} from './util';
import Registry from './Registry';
import { ReactNode } from 'react';

export type LinkActionConfigType = { link:string, name: string|ReactNode, newWindow?:boolean};
export type ActionConfigType=LinkActionConfigType|((ActionProps)=>ReactNode);

export interface ListActionParams{
   /** selected content list */
   selected: Array<any>; //todo: define any as content
   /** config of the list, include eg. sort array */
   listConfig: any; //todo: define

   /** after action it will refresh list */
   afterAction: (newConfig?:ListAfterActionConfig)=>void; //todo: define 'any'
}

export interface ListAfterActionConfig{
  filter:any; //todo: define any
  sort: any; //todo: define any
}

export interface ActionProps{
  /** the view when it's trigged */
  fromview: "list"|"content"|"inline";
  /** params when being trigged */
  params: ListActionParams|ContentActionParams;
  /** from object.eg:{id: 22} */
  from?: {id: number, list_contenttype?:string};
  
  /** item counter when invoking the actions, starting from 0 */
  counter?:number
}

export interface ContentActionParams{
   /** from object */
   from?: any;//eg.{id:22}

   /** content on */
   content:any; //todo: define 'any'
   /** After action callback. redirect is useful when deleting itself. Note that redirect will be ignore in inline mode(list row) so it's safe to call true */
   afterAction: (redirect?: boolean)=>void;
}


interface ActionsProps {
  /** action configs */
  actionsConfig: Partial<ActionConfigType>[];
  /** action properties, can be list/content/inline */
  actionProps:ActionProps;
  iconOnly?: boolean;
}

export function Actions({actionsConfig, actionProps, iconOnly}: ActionsProps) {
  const renderLink = (config: any, i:number) => {
    let path = '';
    if (config.link) {
      let variables = {};
      if (actionProps.fromview=="content"||actionProps.fromview=="inline") {
        let content = (actionProps.params as ContentActionParams).content;
        variables = {...content}; //can support more attribute also.
        let def = getDefinition(content.content_type);
        variables['_contenttype_id'] = def.has_location
          ? content.id
          : content.content_type + '/' + content.id;
      }
      let from = actionProps.from;
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
      <div className='action-item' key={i}>
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
      {actionsConfig.map(
        (action:ActionConfigType, i:number) => {
        if ( 'link' in action) {
          return renderLink(action, i);
        }else if( typeof action === 'function' ){
          let A = action as (ActionProps)=>ReactNode;
          let ele = A({...{...actionProps, counter: i, key:i}});
          return ele;
        }else{
          console.warn("uknown action config: "+Object.entries(action));
        }

        // if (action['com']) {
        //   let identifier = action['com'];
        //   let Action = Registry.getComponent(identifier);
        //   return (
        //     <React.Suspense fallback='...'>
        //       <Action
        //         {...{...actionProps, counter: i}}
        //         config = {action}
        //       />
        //     </React.Suspense>
        //   );
        // }
        // return null;
      })}
    </div>
  );
}

export default Actions;