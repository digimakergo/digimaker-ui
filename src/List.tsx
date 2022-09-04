import React, { useEffect, useState } from 'react';
import Moment from 'react-moment';
import {FetchWithAuth, getDefinition, getFields, getCommonFieldName} from './util';
import ListRowActions from './ListRowActions';
import Actions from './Actions';
import FieldRegister from './FieldRegister';
import RenderProperties from './RenderProperties';
import FieldtypeIcon from './FieldtypeIcon';
import {DDCard} from './DDCard';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import update from 'immutability-helper';

interface ActionsType {
  link: string;
  name: string;
  icon: string;
  title: string;
  com: string | JSX.Element;
}

interface ListProps {
  id: number;
  contenttype: string;
  request_url?: string;
  sort_default: Array<string>;
  sort: any;
  columns: Array<string>;
  show_header?: boolean;
  show_table_header?: boolean;
  actions: Partial<ActionsType>[];
  row_actions?: Partial<ActionsType>[];
  pagination: number;
  onLinkClick?: any;
  onRenderRow?: any;
}

function List({id, contenttype, onLinkClick, onRenderRow, ...props}: ListProps) {
  const [def, setDef] = useState(null);
  const [loading, setLoading] = useState(true);
  const [counter, setCounter] = useState(0);
  const [list, setList] = useState<any>();
  const [actionNew, setActionNew] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [config, setConfigObject] = useState({
    request_url: props.request_url || '',
    sort_default: props.sort_default || [],
    sort: props.sort || [],
    columns: props.columns || [],
    show_header: props.show_header || false,
    show_table_header: props.show_table_header || false,
    row_actions: props.row_actions || [],
    actions: props.actions || [],
    pagination: props.pagination || 0,
  } as any);
  const [sortby, setSortby] = useState<Array<string>>(
    props['sort_default']
  );
  const [selected, setSelected] = useState<number[]>([]);
  const [filter, setFilter] = useState<string[]>([]);

  const setConfig = () => {
    let _config = {};

    if (config['request_url'] == undefined) {
      _config['request_url'] = 'content/list/' + contenttype;
    }
    if (!config['sort_default']) {
      _config['sort_default'] = ['id', 'desc'];
    }
    if (config['can_select'] == undefined) {
      _config['can_select'] = true;
    }
    if (config['pagination'] == undefined) {
      _config['pagination'] = '-1';
    }
    if (config['sort'] == undefined) {
      _config['sort'] = [];
    }
    if (config['row_actions'] == undefined) {
      _config['row_actions'] = [];
    }

    if (config['row_actions_visible'] == undefined) {
      _config['row_actions_visible'] = 0;
    }

    if (config['show_table_header'] == undefined) {
      _config['show_table_header'] = true;
    }

    if (config['show_header_icon'] == undefined) {
      _config['show_header_icon'] = true;
    }

    if (config['columns'] == undefined) {
      _config['columns'] = [];
    }
    if (config['viewmode'] == undefined) {
      _config['viewmode'] = 'list';
    }
    if (config['block_fields'] == undefined) {
      _config['block_fields'] = [];
    }
    if (config['level'] == undefined) {
      _config['level'] = 1;
    }
    if (config['can_dd'] == undefined) {
      _config['can_dd'] = true;
    }
    if (config['filter'] == undefined) {
      _config['filter'] = [];
    }

    setConfigObject(prevConfig => {
      return {
        ...prevConfig,
        ..._config
      }
    });
  }

  useEffect(() => {
    setConfig();
  }, []);

  const getSortbyStr = (sortby: Array<Array<string>>) => {
    let arr: Array<string> = [];
    sortby.map((item) => {
      arr.push(item.join(' '));
    });
    return arr.join('%3B');
  }

  //callback after an action is done.
  const afterAction = (isRefresh: boolean, config: any = {}) => {
    if (isRefresh) {
      const configObj = { ...config };
      setConfigObject({
        ...configObj,
        ...config
      })
      refresh();
    }
  }

  const resetActionState = () => {
    setSelected([]);
  };

  const createFilterQuery = (filter: string) => {
    let filterQuery = '';

    if (filter) {
      Object.keys(filter).map((key: any, index: number) => {
        if (Array.isArray(filter[key])) {
          // if(key=="created"|| key=="modified")
          filterQuery +=
            '&' + key + '=' + filter[key][0] + ':' + filter[key][1];
        } else {
          filterQuery += '&' + key + '=' + filter[key];
        }
      });
      return filterQuery;
    }
  };

  const fetchData = () => {
    let sortbyStr = 'sortby=' + getSortbyStr(sortby);
    let limit = '';
    let filter = '';
    let pagination = config.pagination;
    if (pagination != -1) {
      limit = '&limit=' + pagination + '&offset=' + pagination * currentPage;
    }
    let filterQuery = config.filter;
    if (filterQuery) {
      filter = createFilterQuery(filterQuery);
    }
    setLoading(true);
    FetchWithAuth(
      process.env.REACT_APP_REMOTE_URL +
        '/' +
        config.request_url +
        '?parent=' +
        id +
        '&level=' +
        config.level +
        '&' +
        sortbyStr +
        limit +
        filter
    ).then((data) => {
      resetActionState();
      setLoading(false);
      setCounter(counter + 1);
      setList(data.data);
    });
  };

  const refresh = () => {
    fetchData();
  }

  const sort = (e, column) => {
    e.preventDefault();
    let newSortBy: Array<Array<any>> = [];

    //create new sort or change sort based on column
    let createSort = (sort?: any) => {
      let order = config.sort[column];
      if (sort && sort[0] == column) {
        order = sort[1] == 'desc' ? 'asc' : 'desc';
      }
      return [column, order];
    };

    //if there is swift key, keep the first sort
    if (e.shiftKey && sortby.length >= 1) {
      if (sortby.length == 2) {
        newSortBy[0] = sortby[0];
        newSortBy[1] = createSort(sortby[1]);
      } else if (sortby.length == 1) {
        newSortBy = [sortby[0], createSort()];
      }
    } else {
      newSortBy = [createSort(sortby ? sortby[0] : null)];
    }
    setSortby(newSortBy);
    setCurrentPage(0);
  }

  useEffect(() => {
    fetchData();
    let data = getDefinition(contenttype);
    setDef(data);
  }, [sortby]);

  const select = (id) => {
    if (selected.includes(id)) {
      let index = selected.findIndex((item) => item == id);
      selected.splice(index, 1);
    } else {
      selected.push(id);
    }
    setSelected(selected);
  }

  const selectAll = () => {
    const tmplist = ((list as unknown) as {list: any}).list;
    let selected: any = [];
    for (let value of tmplist) {
      let id = value.id;
      if (!selected.includes(id)) {
        selected.push(id);
      }
    }
    setSelected(selected);
  }

  const linkClick = (e: React.SyntheticEvent<EventTarget>, content) => {
    if (onLinkClick) {
      e.preventDefault();
      onLinkClick(content);
    }
  };

  const renderTable = (data) => {
    let fieldsDef = getFields(def);
    return (
      <table className='table'>
        <tbody>
          {config['show_table_header'] && (
            <tr>
              {config.can_select && (
                <th className='center' onClick={() => selectAll()}>
                  <a href='#'>
                    <i className='far fa-check-square'></i>
                  </a>
                </th>
              )}
              {config.columns.map((column) => {
                let sortable = config.sort[column] ? true : false;
                let sortOrder = '';
                if (sortby[0][0] == column) {
                  sortOrder = sortby[0][1];
                } else if (sortby[1] && sortby[1][0] == column) {
                  sortOrder = 'sort-second ' + sortby[1][1];
                }
                let columnName = fieldsDef[column]
                  ? fieldsDef[column].name
                  : getCommonFieldName(column);
                return (
                  <th key={column}>
                    {sortable ? (
                      <a
                        href='#'
                        onClick={(e) => {
                          sort(e, column);
                        }}
                        className={'column-sortable ' + sortOrder}
                      >
                        {columnName}
                      </a>
                    ) : (
                      columnName
                    )}
                  </th>
                ); //todo: use name from definition.
              })}
              {config['row_actions'].length > 0 && <th></th>}
              <th></th>
            </tr>
          )}
          {renderRows(data)}
          {currentPage > 0 &&
            renderEmpties(config.pagination - data.length)}
        </tbody>
      </table>
    );
  };

  let listBeforeMove: any;

  const moveCard = (dragIndex: number, hoverIndex: number) => {
    if (!listBeforeMove) {
      listBeforeMove = list.list;
    }
    let newObj = list;
    var list = list.list;
    let value = list[dragIndex];
    let newList = update(list, {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, value],
      ],
    });

    newObj.list = newList;
    setList(newObj);
  };

  const dropCard = (targetIndex: number) => {
    let newList = list.list;
    let oldList = listBeforeMove;
    //compare change
    if (!oldList) {
      return;
    }
    let change = [];
    for (let i in newList) {
      let item = newList[i];
      let id = item.id;
      if (id != oldList[i].id) {
        let newPriority = oldList[i].priority;
        change.push(id + ',' + newPriority);
      }
    }

    if (change.length == 0) {
      return;
    }
    //send to server
    FetchWithAuth(
      process.env.REACT_APP_REMOTE_URL +
        '/content/setpriority?params=' +
        change.join('%3B')
    )
      .then((data) => {
        listBeforeMove = null;
        refresh();
      })
      .catch(() => {
        list.list = listBeforeMove;
        setList(list);
      });
  }

  const renderRows = (list) => {
    let fieldsDef = getFields(def);

    let renderCells = (content: any) => {
      return (
        <>
          {config.can_select && (
            <td
              onClick={() => select(content.id)}
              className='td-check center'
            >
              <input
                type='checkbox'
                checked={selected.includes(content.id)}
                value='1'
              />
            </td>
          )}
          <RenderProperties
            content={content}
            contenttype={contenttype}
            fields={config.columns}
            mode='inline'
            as='td'
          />
          {config['row_actions'].length > 0 && (
            <td className='list-row-tool'>
              <ListRowActions
                visibleNumber={config['row_actions_visible']}
                afterAction={(refresh: boolean) => afterAction(refresh)}
                from={{ id: id }}
                content={content}
                config={config['row_actions']}
              />
            </td>
          )}
        </>
      );
    };

    let rows: Array<any> = [];
    for (let i = 0; i < list.length; i++) {
      let content = list[i];
      let rowClasses = onRenderRow
        ? onRenderRow(content)
        : '';
      let canDD =
        config['can_dd'] &&
        content.priority != 0 &&
        sortby[0][0] == 'priority' &&
        sortby[0][1] == 'desc';
      if (canDD) {
        rows.push(
          <DDCard
            id={content.id}
            as='tr'
            canDrag={canDD}
            index={i}
            moveCard={(dragIndex, hoverIndex) => {
              if (canDD) {
                moveCard(dragIndex, hoverIndex);
              }
            }}
            dropCard={(targetIndex: number) => dropCard(targetIndex)}
            key={content.id}
            className={rowClasses}
            onClick={(e) => linkClick(e, content)}
          >
            {renderCells(content)}
          </DDCard>
        );
      } else {
        rows.push(
          <tr
            className={rowClasses}
            onClick={(e) => linkClick(e, content)}
          >
            {renderCells(content)}
            <td></td>
          </tr>
        );
      }
    }
    return rows;
  }

  const renderBlocks = (list) => {
    let blocks: Array<any> = [];
    let rows: Array<any> = [];
    let fieldsDef = getFields(def);
    let cells: Array<any> = [];

    for (let item of list) {
      let fields = config['block_fields'];
      let rowClasses = onRenderRow
        ? onRenderRow(item)
        : '';
      cells.push(
        <div
          className={'blockview-cell ' + rowClasses}
          onClick={(e) => linkClick(e, item)}
        >
          <RenderProperties
            content={item}
            contenttype={contenttype}
            mode='block'
            fields={fields}
          />
          {config['row_actions'].length > 0 && (
            <span className='list-row-tool'>
              <ListRowActions
                visibleNumber={config['row_actions_visible']}
                afterAction={(refresh: boolean) => afterAction(refresh)}
                content={item}
                from={{ id }}
                config={config['row_actions']}
              />
            </span>
          )}
        </div>
      );
    }
    return <div className='blockview-grid'>{cells}</div>;
  }

  const renderList = (data) => {
    let totalPage = Math.ceil(list.count / config.pagination);
    return (
      <div key={counter}>
        {config.show_header && (
          <h3>
            {config.show_header_icon && (
              <FieldtypeIcon contenttype={contenttype} />
            )}
            {def.name}({list.count})
          </h3>
        )}
        {(() => {
          switch (config.viewmode) {
            case 'block':
              return renderBlocks(data);
            case 'list':
              return renderTable(data);
            default:
              return '';
          }
        })()}
        <div className='text-right'>
          {totalPage > 1 && (
            <span className='dm-pagination'>
              <a
                href='#'
                className='page-first'
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(0);
                }}
              >
                <i className='fas fa-step-backward'></i>
              </a>
              <a
                href='#'
                className='page-previous'
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 0) {
                    setCurrentPage(currentPage - 1);
                  }
                }}
              >
                <i className='fas fa-chevron-left'></i>
              </a>
              <a
                href='#'
                className='page-next'
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPage - 1) {
                    setCurrentPage(currentPage + 1);
                  }
                }}
              >
                <i className='fas fa-chevron-right'></i>
              </a>
              <a
                href='#'
                className='page-last'
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(totalPage - 1);
                }}
              >
                <i className='fas fa-step-forward'></i>
              </a>
              <a
                href='#'
                title='Reload data'
                onClick={(e) => {
                  e.preventDefault();
                  refresh();
                }}
              >
                <i className='fas fa-sync'></i>
              </a>

              <span className='pagination-info'>
                Page {currentPage + 1} of {totalPage} from total{' '}
                {list.count}
              </span>
            </span>
          )}
        </div>
      </div>
    );
  }

  const renderEmpties = (count: number) => {
    let list: Array<any> = [];
    for (let i = 0; i < count; i++) {
      list.push(
        <tr className='empty-row'>
          <td>&nbsp;</td>
        </tr>
      );
    }
    return list;
  }

  const newContent = () => {
    setActionNew(true);
  };

  if (!list || !def) {
    return <div className='loading'></div>;
  }

  return (
    <div
      className={
        'listmode-' +
        config.viewmode +
        ' listtype-' +
        contenttype
      }
    >
      <div className='content-list-tools'>
        {!config.show_table_header && (
          <a
            href='#'
            onClick={(e) => {
              e.preventDefault();
              selectAll();
            }}
          >
            <i className='fas fa-check-square'></i>
            Select
          </a>
        )}
        {/*todo: give message if it's not selected(may depend on setting) */}
        {loading && <span className='loading'></span>}
        <Actions
        actionProps={{
          fromview:'list',
          from: { id: id, list_contenttype: contenttype },
          params:{
            selected: list.list.filter((item) =>
            selected.includes(item.id)
          ),
          listConfig:config,
          afterAction: (refresh: boolean, config: any) =>
            afterAction(refresh, config)          
          }
          }
        }          
          actionsConfig={config.actions}          
        />
        {!config.show_table_header && (
          <span>
            <i className='fas fa-sort-alpha-up'></i> &nbsp;
            <select className='form-control'>
              <option>Published</option>
              <option>Modified</option>
            </select>
          </span>
        )}
      </div>

      {list.count == 0 && (
        <div className='alert alert-info'>No {def.name} found.</div>
      )}
      {list.count > 0 && renderList(list.list)}
    </div>
  );
}

export default List;