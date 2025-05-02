import * as React from 'react';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import Moment from 'react-moment';
import ReactTooltip from 'react-tooltip'
import { FieldtypeProps } from '../FieldRegister';


//Supported mode: view, edit, inline(no definition needed).
const Json = (props:FieldtypeProps) => {
    if(props.definition.parameters&&props.definition.parameters.format=="list"){
        return <List {...props} />
    }

    return <div></div>;
}

export default Json;

//parameters:

interface ListField {
    identifier: string,
    name: string,
    type: "text"|"int"
}

interface ListParameters{
  format: "list",
  fields: Array<ListField>
}

const List = (props:FieldtypeProps) =>{
    const [data, setData] = useState(props.data||[]);
    const definition = props.definition;
    const params = definition.parameters as ListParameters;
    const addRow = ()=>{
        let newRow = {};
        for(let field of params.fields){
            newRow[field.identifier] = ''; //text for now
        }
        setData([...data, newRow]);
        }

        const changeValue = (i:number, identifier:string, v:string)=>{        
            let newData = data.map((item, index)=>{
                if(index === i){
                    let newObj = {...item };
                    newObj[identifier] = v;
                    return newObj
                }
                return item;
            });
            setData(newData);
        }

        const deleteRow = (i)=>{
            const newData = [...data];
            newData.splice(i, 1);
            setData(newData)
        }

        return <div>                    
                 <label className="field-label">{definition.name}:</label>
                {data&&data.length>0&&<table className='table table-borderless'>
                    <thead>
                        <tr>
                        {params.fields.map(field=><th>{field.name}</th>)}            
                        <th></th>
                        </tr>
                    </thead>
                   <tbody>
                    {data.map((item,i)=><tr key={i+''+data.length}>
                        {params.fields.map(field=><td>
                            {props.mode=='edit'?<input className='form-control' type='text' onChange={(e)=>changeValue(i, field.identifier, e.target.value)} defaultValue={item[field.identifier]} />:item[field.identifier]}
                        </td>)}
                        <td>{props.mode=='edit'&&<Button size='sm' variant='light' onClick={()=>deleteRow(i)}><i className="bi bi-trash"></i></Button>}</td>
                    </tr>)}    
                    </tbody>            
                </table>}            

                {props.mode=='edit'&&<div>
                <input type='hidden' name={props.definition.identifier} value={JSON.stringify(data)} />
                <Button variant='light' size='sm' onClick={addRow}><i className="bi bi-plus-lg"></i></Button>
                </div>}
        </div>;
}
