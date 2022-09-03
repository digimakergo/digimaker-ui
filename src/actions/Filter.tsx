import React, { Component } from 'react'
import { Collapse, Button } from 'react-bootstrap';
import util from 'digimaker-ui/util';
import DateTime from 'react-datetime';
import moment from 'moment'

class Filter extends React.Component<{parameters:any,afterAction:any},{query?:any,filter:any,open:boolean,selectedFilter:string}> {

 filterSet:any={};
 filterList:any=[];
 searchText:any;
 constructor(props: any){
    super(props);
    this.state = {
      query: '',
      filter: {},
      open: false,
      selectedFilter: "0"
    }
    let cType = props.parameters['contenttype'];
    let config = util.getConfig();
    this.filterList= config.list[cType]["filter_columns"];
    if(this.filterList.includes("created")){
     this.filterSet["created"]={from:'',to:''};
    }
    if(this.filterList.includes("author")){
      this.filterSet["author"]="";
    }
 }

 groupBy(list, keyGetter) {
  const map = new Map();
  list.forEach((item) => {
       const key = keyGetter(item);
       const collection = map.get(key);
       if (!collection) {
           map.set(key, [item]);
       } else {
           collection.push(item);
       }
  });
  return map;
}

createdFilterBtnHandler=(type:string,e:any)=>{
  let filterValues= {...this.state.filter};

  this.filterSet[type] instanceof HTMLInputElement?filterValues[type]=this.filterSet[type].value:
  filterValues[type]=["between",this.filterSet[type].from.state.inputValue+","+this.filterSet[type].to.state.inputValue]
  this.setState({filter:filterValues});

}

deleteFilter=(key?:string)=>{
  this.searchText.value = '';
  if( key ){
    let filterValues= {...this.state.filter};
    delete filterValues[key];
    this.setState({filter:filterValues});
  }else{
    this.setState({filter:{}});
  }
}
 handleOptionChange=(e:any)=> {
    e.preventDefault();
    this.setState({selectedFilter:e.currentTarget.value})
 }


 componentDidUpdate(prevProps, prevState, snapshot){
   if( JSON.stringify(prevState.filter) != JSON.stringify(this.state.filter) ){
       this.submit();
   }
 }

 submit=()=>{
  if(this.searchText.value){
    this.state.filter[this.filterList[0]]="contain:"+ encodeURIComponent(this.searchText.value);
  }
  const filterData= {filter:{...this.state.filter}};
  this.props.afterAction(true,filterData);
 }


 handleDateChange=(val:any,selectedFilter:string,e:any)=>{
  let value = (moment(e._d).format('L'))
  let filterValues= [...this.state.filter];

   if(this.state.filter.find(x=>x.filterId==selectedFilter && x.text== val)){
      let objIndex = filterValues.findIndex((x=>x.filterId==selectedFilter && x.text==val));
      filterValues[objIndex].value=value;
   }
   else{
    const filterVaule= {text:val,value:value,filterId:selectedFilter}
    filterValues.push(filterVaule);
    console.log(filterValues);
   }

   this.setState({filter:filterValues});
 }

 handleKeyDown = (e:any) =>{
   if (e.key === 'Enter') {
      this.submit();
    }else if( e.key == 'Escape' ){
      e.preventDefault();
      this.searchText.value = '';
      this.deleteFilter();
    }
 }

  handleInputChange = (e:any) => {
     this.setState({query: e.currentTarget.value});
  }
 render() {
   return (
     <div>
     {this.filterList.length>0 && <div>
      <div className="text-right">
      <input
        placeholder="Search name..."
        className="form-control btn-sm"
        onKeyDown={this.handleKeyDown.bind(this)}
        style={{'display': 'inline-block', 'width': '200px'}}
        ref={(input) => this.searchText = input}
      />
      <button className="btn btn-sm btn-link" onClick={this.submit}>
        <i className="fas fa-search"></i>
      </button>
      <Button
      variant="link"
      size="sm"
      onClick={() => this.setState({open:!this.state.open})}
      aria-controls="filter-area"
      aria-expanded={this.state.open}>
      <i className={"fas fa-caret-"+(this.state.open?"up":"down")}></i>
     </Button>
    </div>

    {this.state.filter&&<div className="block">
    {Object.keys(this.state.filter).map((key:any,index:number)=>
      <div key={index}>
        <span>{key+": "+this.state.filter[key]}</span>
        <Button variant="link" onClick={this.deleteFilter.bind(this,key)}><i className="fa fa-times" aria-hidden="true"></i></Button>
      </div>)}
    </div>}

    <Collapse in={this.state.open}>
      <div id="filter-area" className="block">
       Properties:<select onChange={this.handleOptionChange}>
         <option value="0">Select</option>
          {this.filterList.map(p=>(<option value={p}>{p}</option>))}
       </select>
      {this.state.selectedFilter && this.state.selectedFilter==="created"?(<>
       From: <DateTime className='fieldtype-datetime-date' timeFormat={false} ref={(input) => this.filterSet["created"].from = input}  dateFormat="DD-MM-YYYY"/>
       To: <DateTime className='fieldtype-datetime-date' timeFormat={false} ref={(input) => this.filterSet["created"].to = input} dateFormat="DD-MM-YYYY"/>
       &nbsp;
       <button className="btn btn-secondary btn-sm" onClick={this.createdFilterBtnHandler.bind(this,this.state.selectedFilter)}>{this.state.filter[this.state.selectedFilter]?'Updated':'add'}</button></>
     ):this.state.selectedFilter==="author"?(<><input type="text" ref={(input) => this.filterSet["author"] = input} ></input>
        &nbsp;
        <button className="btn btn-secondary btn-sm" onClick={this.createdFilterBtnHandler.bind(this,this.state.selectedFilter)}>{this.state.filter[this.state.selectedFilter]?'Updated':'add'}</button></>):""
      }
      </div>
    </Collapse>
    </div>}
    </div>
   )
 }
}

export default Filter
