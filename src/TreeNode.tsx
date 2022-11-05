import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, NavLink } from "react-router-dom";
import Collapse from 'react-bootstrap/Collapse'
import { FetchWithAuth } from './util';

//TreeNode which render tree based on data from server.
//selected: number|array<number> for selected id
//renderItem is to render what's inside(eg. if you want to remove icon or output node id, or additional link ).
export interface TreeNodeProps {  
  /** selected content id, can be multiple(eg. parent&child both selected) */
  selectedId?: number|Array<number>;

  /** Root id of the tree */
  rootID: number;

  /** Content types of the tree */
  contenttype: Array<string>;

  /** Callback when tree data is fetched */
  onDataFetched?:(data:any)=>void;

  /** Show root node or not */
  showRoot?: boolean;

  /** Customized render */
  renderItem?:  (node:any)=>JSX.Element;

  /** onClick event */
  onClick?: (e:any, nodeData:any)=>void;
}

interface TreeNodeItemProps {
  data: any;
  selectedId?: number|Array<number>;  
  onClick?: (e:any, node:any)=>void;
  renderItem?:  (node:any)=>JSX.Element;
  onOpenClose?: any;
}

function TreeNodeItem({data, selectedId, onClick, renderItem, onOpenClose}: TreeNodeItemProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(false);


  const openClose = (e: React.SyntheticEvent<EventTarget>) => {
    e.preventDefault();
    setOpen(!open);
    setOpen(!open);
  }

  const initSelected = () => {
    let node = data;
    if (
      (Number.isInteger(selectedId) && node.id == selectedId) ||
      (Array.isArray(selectedId) && selectedId.includes(node.id))
    ) {
      setSelected(true);
      setOpen(true);
    } else {
      setSelected(false);
      setOpen(false);
    }
  }

  useEffect(() => {
    if (open && onOpenClose) {
      onOpenClose(true);
    }

    initSelected();
  }, [selectedId, open]);

  const onClickHandle = (e: React.SyntheticEvent<EventTarget>) => {
    setOpen(true);
    if (onClick) {
      onClick(e, data);
    }
  }

  let node = data;
  let url = `/main/${node.id}`;

  let subtype =
    node.fields && node.fields['subtype']
      ? 'icon-subtype-' + node.fields['subtype']
      : '';
  return (
    <li
      className={
        (open ? 'tree-open' : 'tree-close') +
        ' ' +
        (node.children ? 'tree-haschild' : 'tree-nochild') +
        (selected ? ' selected' : '')
      }
    >
      <NavLink
        to={url}
        activeClassName='active'
        onClick={(e) => {
          onClickHandle(e);
        }}
      >
        <span
          className={node.children ? 'foldable space' : 'space'}
          onClick={(e) => openClose(e)}
        >
          {node.children && (
            <i
              className={
                'foldable fas fa-chevron-right' + (open ? ' open' : '')
              }
            ></i>
          )}
        </span>
        {renderItem ? (
          renderItem(node)
        ) : (
          <span className='tree-text' title={node.name}>
            <i
              className={
                'nodeicon far icon-' + node.content_type + ' ' + subtype
              }
            ></i>
            <span>{node.name}</span>
          </span>
        )}
      </NavLink>

      {/*todo: load it without sliding*/}
      {node.children && (
        <Collapse in={open}>
          <ul>
            {node.children.map((value) => {
              return (
                <TreeNodeItem
                  key={value.id}
                  selectedId={selectedId}
                  data={value}
                  renderItem={renderItem}
                  onOpenClose={(open: boolean) => {
                    if (open) {
                      setOpen(true);
                    }
                  }}
                  onClick={onClick}
                />
              );
            })}
          </ul>
        </Collapse>
      )}
    </li>
  );
}

function TreeNode({selectedId, showRoot = false, renderItem, onClick, rootID, contenttype, onDataFetched}: TreeNodeProps) {
  const [data, setData] = useState(null);

  const fetchData = () => {
    FetchWithAuth('content/treemenu/' + rootID + '?type='+contenttype.join(','))
      .then((data) => {
        if( data.error === false ){
           setData(data.data);
           if( onDataFetched ){
            onDataFetched(data.data);
           }
        }
      })
  }

  useEffect(()=>{
    fetchData();
  },[rootID, contenttype]);

  if( !data ){
    return <span></span>
  }

  return (
    <ul className='treemenu'>
      {showRoot && (
        <TreeNodeItem
          selectedId={selectedId}
          data={data}
          renderItem={renderItem}
          onClick={onClick}
        />
      )}
      {data.children &&
        data.children.map((value) => {
          return (
            <TreeNodeItem
              key={value.id}
              selectedId={selectedId}
              data={value}
              renderItem={renderItem}
              onClick={onClick}
            />
          );
        })}
    </ul>
  );
}

export default TreeNode;