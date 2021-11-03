import * as React from 'react';
import ReactTooltip from 'react-tooltip';
import Browse from '../Browse';
import Select from 'react-select'
import {FetchWithAuth} from '../util';


export default class FieldtypeSelect extends React.Component<{definition:any, validation:any, data:any, formdata:any, mode:string, contenttype?:any},{selected:any, options:Array<any>, isMulti:boolean}> {
  constructor(props: any) {
      super(props);
      let isMulti = this.props.definition.parameters.multi?true:false;
      this.state = {selected:isMulti?[]:'', options:[], isMulti:isMulti };
  }

  componentDidMount(){
    this.init();
  }

  init(){
    let arr = this.props.data.split(';');
    let options = [];
    let selected:any = this.state.isMulti?[]:null;

    let def = this.props.definition;
    let list = def.parameters.list;
    for( let item of list ){     
      let option = {label:item.text, value:item['value']};
      if( arr.includes( option.value ) ){
        if( this.state.isMulti ){
            selected.push(option);
        }else{
            selected = option;
        }
      }
      options.push(option);
    }
    this.setState({options: options, selected:selected});
  }

  getValue(){
      let value = '';
      let selected = this.state.selected;
      if( this.state.isMulti ){
        if( selected ){
            let arr = [];
            selected.forEach((item)=>{
                arr.push(item.value);
            });
            value = arr.join(';');
        }
      }else{
          if( selected ){
              value = selected.value;
          }
      }
      return value;
  }

  edit(){
    let def = this.props.definition;    

    return  <>
            <label className="field-label">{this.props.definition.name}:</label>
            <div className="field-value">
                <Select className="fieldtype-relation-select" 
                        isMulti={this.state.isMulti}
                        options={this.state.options}
                        value={this.state.selected} 
                        isClearable={true}
                        onChange={(data:any)=>{this.setState({selected:data})}} />
                <input type="hidden" name={this.props.definition.identifier} value={this.getValue()} />
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
    let textList = [];
    if( !this.state.selected ){
        return '';
    }
    if( this.state.isMulti ){
        for( let item of this.state.selected ){
            textList.push(item.label);
        }
    }else{
        textList.push(this.state.selected.label);
    }
    return textList.join(', ');
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