import * as React from 'react';
import Moment from 'react-moment';
import ReactTooltip from 'react-tooltip'
import { FieldtypeProps } from '../FieldRegister';


//Supported mode: view, edit, inline(no definition needed).
const Text = (props:FieldtypeProps) => {
    const raw = ()=>{
      return props.data?props.data:'';
    }

    const view = ()=>{
      return <>
              <label className="field-label">{props.definition.name}: </label>
              <div className={"field-value"+(props.definition.parameters&&props.definition.parameters.multiline?' fieldtype-text-multiline':'')}>{props.data}</div>
              </>
    }

    const edit = ()=>{
      const def = props.definition;
      const name = def.identifier;
      return (<>
              <label className="field-label" htmlFor={props.definition.identifier}>{props.definition.name}
                  {props.definition.description&&<i className="icon-info" data-for={props.definition.identifier+'-desciption'} data-tip=""></i>}
                  {props.definition.description&&<ReactTooltip id={props.definition.identifier+'-desciption'} effect="solid" place="right" html={true} clickable={true} multiline={true} delayHide={500} className="tip">{props.definition.description}</ReactTooltip>}
                  {props.afterLabel&&props.afterLabel(def, props.data)}
              :</label>
              {(def.parameters&&def.parameters.multiline)?
                <textarea id={name} className="field-value form-control" name={name} defaultValue={props.data} />
                :<input type="text" id={name} className="field-value form-control" name={name} defaultValue={props.data} />
              }
              </>
      )
    }
  

    if(props.mode=='view'){
        return view();
    }else if(props.mode=='edit'){
        return edit();
    }else{
      return raw();
    }  
}

export default Text;