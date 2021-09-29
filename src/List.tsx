import * as React from 'react';
import Moment from 'react-moment';
import {FetchWithAuth, getDefinition, getFields, getCommonFieldName} from './util';
import ListRowActions from './ListRowActions';
import Actions from './Actions';
import FieldRegister from './FieldRegister';
import RenderProperties from './RenderProperties';
import FieldtypeIcon from './FieldtypeIcon';
import {DDCard} from './DDCard';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';


export default class List extends React.Component<{ id: number, contenttype: string, config:any, onLinkClick?:any, onRenderRow?:any }, {def:any, loading:boolean, counter:number, list: any, actionNew: boolean, currentPage:number, sortby: Array<Array<string>>, selected: Array<number> ,filter:Array<string>}> {

   private config: any = {};

    //todo: support * or _ as general config(so merge _ with spearate, type: array(merge), value(override), object(merge) ), so id can be in *
    constructor(props: any) {
        super(props);
        this.setConfig( props );
        this.state = { def:'',list: '', loading: true, counter: 0, actionNew: false, currentPage: 0, sortby:this.config['sort_default'], selected:[],filter:[]};
    }

    setConfig(props:any){
      this.config = props.config?{...props.config}:{};

      if( this.config['request_url'] == undefined ){
        this.config['request_url'] = 'content/list/'+props.contenttype;
      }
      if( !this.config['sort_default'] ){
        this.config['sort_default'] = [['id', 'desc']];
      }
      if( this.config['can_select'] == undefined ){
        this.config['can_select'] = true;
      }
      if( this.config['pagination'] == undefined ){
        this.config['pagination'] = "-1";
      }
      if( this.config['sort'] == undefined ){
        this.config['sort'] = [];
      }
      if( this.config['row_actions'] == undefined ){
        this.config['row_actions'] = [];
      }

      if( this.config['row_actions_visible'] == undefined ){
        this.config['row_actions_visible'] = 0;
      }

      if( this.config['show_table_header'] == undefined ){
        this.config['show_table_header'] = true;
      }

      if( this.config['show_header_icon'] == undefined ){
        this.config['show_header_icon'] = true;
      }

      if( this.config['columns'] == undefined ){
        this.config['columns'] = [];
      }
      if( this.config['viewmode'] == undefined ){
        this.config['viewmode'] = "list";
      }
      if( this.config['block_fields'] == undefined ){
        this.config['block_fields'] = [];
      }
      if( this.config['level'] == undefined ){
        this.config['level'] = 1;
      }
      if( this.config['can_dd'] == undefined ){
        this.config['can_dd'] = true;
      }
      if( this.config['filter'] == undefined ){
        this.config['filter'] = [];
      }

    }


    getSortbyStr(sortby:Array<Array<string>>){
      let arr:Array<string> =[];
      sortby.map((item)=>{
        arr.push( item.join(' ') );
       });
       return arr.join('%3B');
    }

    //callback after an action is done.
    afterAction(refresh:boolean,config:any={}){
      if(refresh){
        const configObj = {...this.config};
        this.config = {...configObj,...config};
        this.refresh();
      }
    }


    fetchData() {
        let id = this.props.id;
        let sortby = "sortby="+this.getSortbyStr( this.state.sortby );
        let limit = "";
        let filter="";
        let pagination = this.config.pagination;
        if(  pagination!= -1 ){
            limit = "&limit="+pagination+"&offset="+pagination*this.state.currentPage
        }
        let filterQuery= this.config.filter;
        if(filterQuery){
        filter = this.createFilterQuery(filterQuery);
        }
        this.setState({loading: true});
        FetchWithAuth(process.env.REACT_APP_REMOTE_URL + '/'+this.config.request_url+'?parent='+id+"&level="+this.config.level+"&"+sortby+limit+filter)
            .then((data) => {
                this.resetActionState();
                this.setState({ loading: false, counter: this.state.counter+1, list: data.data });
            })
    }

    refresh(){
      this.fetchData();
    }

    resetActionState(){
      this.setState({selected:[]});
    }

    createFilterQuery=(filter:string)=>{
      let filterQuery=""

      if(filter){
        Object.keys(filter).map((key:any,index:number)=>{
         if(Array.isArray(filter[key]))// if(key=="created"|| key=="modified")
            {
              filterQuery+= '&'+key+'='+filter[key][0]+':'+filter[key][1];
            }
            else{
              filterQuery+='&'+key+'='+filter[key];
            }
          });
          return filterQuery;
      }

     }
    //sort by column
    sort(e, column){
      e.preventDefault();
      let sortby = this.state.sortby;
      let newSortBy:Array<Array<any>> =[];

      //create new sort or change sort based on column
      let createSort = (sort?:any)=>{
        let order = this.config.sort[column];
        if( sort && sort[0] == column ){
            order = sort[1]=='desc'?'asc':'desc';
        }
        return [column, order];
      }

      //if there is swift key, keep the first sort
      if( e.shiftKey && sortby.length >=1 ){
        if(sortby.length == 2){
          newSortBy[0] = sortby[0];
          newSortBy[1] = createSort(sortby[1]);
        }else if(sortby.length == 1){
          newSortBy = [sortby[0],createSort()];
        }
      }else{
        newSortBy = [createSort(sortby?sortby[0]:null)]
      }
      this.setState({sortby:newSortBy, currentPage:0});
    }

    //when init
    componentDidMount() {
        this.fetchData();

        let data = getDefinition(this.props.contenttype)
        this.setState({def:data});
    }

    //when state changed
    componentDidUpdate( prevProps, prevState, snapshot ){
      //when changing page
      if( prevState.currentPage != this.state.currentPage
        || this.getSortbyStr( prevState.sortby ) != this.getSortbyStr( this.state.sortby )
        )
      {
        this.fetchData();
      }
    }


    select(id){
      let selected = this.state.selected;
      if(selected.includes(id)){
          let index = selected.findIndex( (item) => item == id );
          selected.splice(index,1);
      }else{
        selected.push( id );
      }
      this.setState({selected:selected});
    }

    selectAll(){
      let list = this.state.list.list;
      let selected:any=[];
      for(let value of list){
        let id = value.id;
        if( !this.state.selected.includes( id ) ){
            selected.push(id);
        }
      };
      this.setState({selected: selected});
    }

    linkClick(e, content){
      if( this.props.onLinkClick ){
        e.preventDefault();
        this.props.onLinkClick(content);
      }
    }

    renderTable(data){
      let fieldsDef = getFields(this.state.def);
      return <table className="table"><tbody>
        {this.config['show_table_header']&&<tr>
          {this.config.can_select&&<th className="center" onClick={()=>this.selectAll()}>
            <a href="#"><i className="far fa-check-square"></i></a>
          </th>}
          {this.config.columns.map( (column)=>{
            let sortable = this.config.sort[column]?true:false;
            let sortby = this.state.sortby;
            let sortOrder = ''
            if( sortby[0][0] == column ){
              sortOrder = sortby[0][1];
            }else if( sortby[1] && sortby[1][0] == column ){
              sortOrder = 'sort-second ' + sortby[1][1];
            }
            let columnName = fieldsDef[column]?(fieldsDef[column].name):getCommonFieldName(column);
            return (<th key={column}>
              {sortable?
                <a href="#" onClick={(e)=>{this.sort(e, column);}} className={"column-sortable "+sortOrder}>
                {columnName}
                </a>
                :columnName}
                </th>) //todo: use name from definition.
          } )}
          {this.config['row_actions'].length>0&&<th></th>}
          </tr>}
        {this.renderRows(data)}
        {this.state.currentPage>0&&this.renderEmpties(this.config.pagination-data.length)}
        </tbody>
      </table>
    }

    private listBeforeMove:any

    moveCard(dragIndex: number, hoverIndex: number){
      if( !this.listBeforeMove ){
          this.listBeforeMove = this.state.list.list;
      }
      let newObj = this.state.list;
      let list = this.state.list.list;
      let value = list[dragIndex];
      let newList = update(list, {
            $splice: [
              [dragIndex, 1],
              [hoverIndex, 0, value],
            ],
          })

      newObj.list = newList
      this.setState({list: newObj});
    }

    dropCard(targetIndex:number){
      let newList = this.state.list.list;
      let oldList = this.listBeforeMove;
      //compare change
      if( !oldList ){
          return;
      }
      let change = [];
      for( let i in newList ){
        let item = newList[i];
        let id = item.id;
        if( id != oldList[i].id ){
          let newPriority = oldList[i].priority;
          change.push(id+","+newPriority);
        }
      }

      if( change.length == 0 ){
        return;
      }
      //send to server
      FetchWithAuth(process.env.REACT_APP_REMOTE_URL + '/content/setpriority?params='+change.join('%3B'))          
          .then((data) => {
            this.listBeforeMove = null;
            this.refresh();
          }).catch(()=>{
            let list = this.state.list;
            list.list = this.listBeforeMove;
            this.setState({list: list});
          })
    }

    renderRows(list) {
        let fieldsDef = getFields(this.state.def);

        let renderCells = (content:any)=>{
          return <>{this.config.can_select&&<td onClick={()=>this.select(content.id)} className="td-check center"><input type="checkbox" checked={this.state.selected.includes(content.id)} value="1" /></td>}
          <RenderProperties content={content} contenttype={this.props.contenttype} fields={this.config.columns} mode="inline" as="td" />
            {this.config['row_actions'].length>0&&<td className="list-row-tool">
                  <ListRowActions visibleNumber={this.config["row_actions_visible"]} afterAction={(refresh:boolean)=>this.afterAction(refresh)} from={{id:this.props.id}} content={content} config={this.config['row_actions']} />
              </td>}</>;
        };

        let rows: Array<any> = [];
        for (let i = 0; i < list.length; i++) {
            let content = list[i];
            let rowClasses = this.props.onRenderRow?this.props.onRenderRow(content):'';
            let canDD = this.config['can_dd'] && content.priority!=0 && this.state.sortby[0][0]=='priority'&&this.state.sortby[0][1]=='desc';
            if( canDD ){
              rows.push(<DDCard id={content.id} as='tr' canDrag={canDD} index={i} moveCard={(dragIndex, hoverIndex)=>{if(canDD){this.moveCard(dragIndex, hoverIndex)}}} dropCard={(targetIndex:number)=>this.dropCard(targetIndex)} key={content.id} className={rowClasses} onClick={(e)=>this.linkClick(e, content)}>
                {renderCells( content )}
              </DDCard>);
            }else{
              rows.push(<tr className={rowClasses} onClick={(e)=>this.linkClick(e, content)}>
                {renderCells( content )}
              </tr>);
            }

        }
        return rows;
    }

    renderBlocks(list){
        let blocks:Array<any> = [];
        let rows:Array<any> = [];
        let fieldsDef = getFields(this.state.def);
        let cells:Array<any> = [];

        for (let item of list ){
            let fields = this.config['block_fields'];
            let rowClasses = this.props.onRenderRow?this.props.onRenderRow(item):'';
            cells.push(<div className={"blockview-cell "+rowClasses} onClick={(e)=>this.linkClick(e, item)}>
                <RenderProperties content={item} contenttype={this.props.contenttype} mode="block" fields={fields} />
                {this.config['row_actions'].length>0&&<span className="list-row-tool">
                      <ListRowActions  visibleNumber={this.config["row_actions_visible"]} afterAction={(refresh:boolean)=>this.afterAction(refresh)} content={item} from={{id:this.props.id}} config={this.config['row_actions']} />
                  </span>}
            </div>);
        }
        return (<div className="blockview-grid">{cells}</div>)
    }



    renderList(data) {
        let totalPage = Math.ceil( this.state.list.count/this.config.pagination);
        return (<div key={this.state.counter} >
          <DndProvider backend={HTML5Backend}>
            {this.config.show_header&&<h3>{this.config.show_header_icon&&<FieldtypeIcon contenttype={this.props.contenttype} />}{this.state.def.name}({this.state.list.count})</h3>}
            {(()=>{
              switch(this.config.viewmode){
                case "block":
                  return this.renderBlocks(data);
                case "list":
                  return this.renderTable(data);
                default:
                  return '';
              }
            })()}
            <div className="text-right">
            {totalPage>1&&<span className="dm-pagination">
              <a href="#" className="page-first" onClick={(e)=>{e.preventDefault();this.setState({currentPage: 0});}}><i className="fas fa-step-backward"></i></a>
              <a href="#" className="page-previous" onClick={(e)=>{e.preventDefault();if(this.state.currentPage>0){this.setState({currentPage: this.state.currentPage-1});}}}><i className="fas fa-chevron-left"></i></a>
              <a href="#" className="page-next" onClick={(e)=>{e.preventDefault();if(this.state.currentPage<totalPage-1){this.setState({currentPage: this.state.currentPage+1});}}}><i className="fas fa-chevron-right"></i></a>
              <a href="#" className="page-last" onClick={(e)=>{e.preventDefault();this.setState({currentPage: totalPage-1});}}><i className="fas fa-step-forward"></i></a>
              <a href="#" title="Reload data" onClick={(e)=>{e.preventDefault();this.refresh()}}><i className="fas fa-sync"></i></a>

              <span className="pagination-info">Page {this.state.currentPage+1} of {totalPage} from total {this.state.list.count}</span>
              </span>}
            </div>
            </DndProvider>
        </div>
        )
    }

    //render empty so the pagination buttons can be in fixed place
    renderEmpties(count:number){
      let list:Array<any> = [];
      for(let i =0;i<count;i++){
        list.push(<tr className="empty-row"><td>&nbsp;</td></tr>);
      }
      return list;
    }

    newContent = () => {
        this.setState({ actionNew: true });
    }

    render() {
        if( !this.state.list || !this.state.def ){
            return (<div className="loading"></div>);
        }


        return (
            <div className={"listmode-"+this.config.viewmode+" listtype-"+this.props.contenttype}>
                <div className="content-list-tools">
                     {!this.config.show_table_header&&
                          <a href="#" onClick={(e)=>{e.preventDefault();this.selectAll()}}>
                            <i className="fas fa-check-square"></i>
                            Select
                          </a>
                     }
                    {/*todo: give message if it's not selected(may depend on setting) */}
                    {this.state.loading&&<span className="loading"></span>}
                    <Actions fromview="list" from={{id: this.props.id}} content={null} selected={this.state.list.list.filter((item)=>this.state.selected.includes(item.id))} actionsConfig={this.config.actions} afterAction={(refresh:boolean,config:any)=>this.afterAction(refresh,config)} />
                    {!this.config.show_table_header&&
                    <span>
                        <i className="fas fa-sort-alpha-up"></i> &nbsp;
                        <select className="form-control">
                            <option>Published</option>
                            <option>Modified</option>
                        </select>
                    </span>
                  }

                </div>

                {this.state.list.count==0&&<div className="alert alert-info">No {this.state.def.name} found.</div>}
                {this.state.list.count>0&&this.renderList(this.state.list.list)}
            </div>
        );
    }
}
