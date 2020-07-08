import * as React from 'react';
import ReactTooltip from 'react-tooltip';
import Browse from '../Browse';
import Select from 'react-select'
import {FetchWithAuth} from '../util';


export default class RelationList extends React.Component<{definition:any, validation:any, data:any, formdata:any, mode:string, contenttype?:any},{list:any, selected:any, content:any}> {
  constructor(props: any) {
      super(props);
      this.state = {list:[], selected:this.props.data, content:''};
  }

  componentDidMount(){
    if( this.props.mode == 'edit' ){
        this.fetchList();
    }else{
      this.fetchExisting();
    }
  }

  fetchList(){
    let def = this.props.definition;
    FetchWithAuth(process.env.REACT_APP_REMOTE_URL + '/relation/optionlist/'+this.props.contenttype+'/'+def.identifier)
        .then(res => res.json())
        .then((data) => {
            this.setState({list: data.list });
        })
  }

  fetchExisting(){
    let def = this.props.definition;
    //todo: change to use content/get/<type>/cid to get content
    if(!this.props.data){
      return;
    }
    FetchWithAuth(process.env.REACT_APP_REMOTE_URL + '/content/list/'+def.parameters.type+'?cid='+this.props.data)
        .then(res => res.json())
        .then((data) => {
            this.setState({content: data.list[0] });
        })
  }

  edit(){
    let options = [];
    let defaultValue = null;
    let valueField = 'id';
    if( this.props.definition.parameters.value ){
       valueField = this.props.definition.parameters.value;
    }
    for( let item of this.state.list ){
      if( item[valueField] == this.state.selected ){
        defaultValue = {label:item.name, value:item[valueField]};
      }
      options.push({label:item.name, value:item[valueField]});
    }
    //todo: suppoer 'browse' mode, which is defined in settings.
    return  <>
            <label className="field-label">{this.props.definition.name}:</label>
            <div className="field-value">
                <Select className="fieldtype-relation-select" name={this.props.definition.identifier} options={options} value={defaultValue} onChange={(data:any)=>{this.setState({selected:data.value})}} />
            </div>
            </>
  }

  view(){
    return <>
            <label className="field-label">{this.props.definition.name}:</label>
            <div className="field-value">{this.inline()}</div>
           </>
  }

  inline(){
    //todo: use RenderProperties to render in inline mode.
    return this.state.content?this.state.content.name:'';
  }

  render(){
    if(this.props.mode=='edit'){
      return this.edit();
    }else if(this.props.mode=='view'){
      return this.view();
    }else{
      return this.inline();
    }
  }
}
