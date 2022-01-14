import * as React from 'react';
import ReactTooltip from 'react-tooltip';
import Browse from '../Browse';
import Select from 'react-select'
import util, {FetchWithAuth} from '../util';


export default class Relation extends React.Component<{definition:any, validation:any, data:any, formdata:any, mode:string, contenttype?:any},{list:any, selected:any, content:any}> {
  constructor(props: any) {
      super(props);
      this.state = {list:[], selected:this.props.data, content:''};
  }

  componentDidMount(){
    let parameters = this.props.definition.parameters;
    if( this.props.mode == 'edit' && parameters['select'] ){
        this.fetchList();
    }else{
      this.fetchExisting();
    }
  }

  fetchList(){
    let def = this.props.definition;
    FetchWithAuth(process.env.REACT_APP_REMOTE_URL + '/relation/optionlist/'+this.props.contenttype+'/'+def.identifier)
        .then((data) => {
            let list = data.data.list;
            let valueField = 'id';
            if( this.props.definition.parameters.value ){
              valueField = this.props.definition.parameters.value;
            }

            let options = [];
            let selected = null;
            for( let item of list ){
              if( item[valueField] == this.state.selected ){
                selected = {label:item.name, value:item[valueField]};
              }
              options.push({label:item.name, value:item[valueField]});
            }

            this.setState({list: options, selected:selected });
        })
  }

  fetchExisting(){
    let def = this.props.definition;
    //todo: change to use content/get/<type>/cid to get content
    if(!this.props.data){
      return;
    }
    FetchWithAuth(process.env.REACT_APP_REMOTE_URL + '/content/list/'+def.parameters.type+'?cid='+this.props.data)
        .then((data) => {
            this.setState({content: data.data.list[0] });
        })
  }

  confirmDialog(selected:any){
      this.setState({content: selected});
  }

  edit(){  
    //todo: suppoer 'browse' mode, which is defined in settings.
    let params = this.props.definition.parameters;
    let mode = params['select']?'select':'browse';

    let browseConfig = util.getConfig().browse;

    return  <>
            <label className="field-label">{this.props.definition.name}:</label>
            <div className="field-value">
            {mode=='browse'&&<>
                  {this.state.content?<div>{this.state.content.id}, {this.state.content.name}</div>:''}
                  <Browse config={browseConfig} multi={false} contenttype={[params['type']]} onConfirm={(selected:any)=>this.confirmDialog(selected)} selected={this.state.content} />
                  <input type="hidden" name={this.props.definition.identifier} value={this.state.content?this.state.content.id:''} />
                  </>
                  }
            {mode=='select'&&<Select isClearable={true} 
                  className="fieldtype-relation-select"
                    name={this.props.definition.identifier} 
                    options={this.state.list} 
                    value={this.state.selected}
                  onChange={(data:any)=>{this.setState({selected:data})}} />}
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
