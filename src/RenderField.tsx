import * as React from 'react';
import FieldRegister from './FieldRegister';


// export default function RenderField(props: {identifier:string, def:any, data:any, mode:string}) {
//   if(!props.def){
//     return props.data;
//   }
//
//   const Fieldtype: React.ReactType = FieldRegister.getFieldtype(props.def.type);
//   if(Fieldtype){
//     return <Fieldtype definition={props.def} data={props.data}  mode={props.mode} />;
//   }else{
//     return '';
//   }
// }


export default class RenderField extends React.Component<{identifier:string, def:any, data:any, mode:string},{}> {


  render(){
    if(!this.props.def){
      return this.props.data;
    }

    const Fieldtype: React.ReactType = FieldRegister.getFieldtype(this.props.def.type);
    if(Fieldtype){
      return <Fieldtype definition={this.props.def} data={this.props.data}  mode={this.props.mode} />;
    }else{
      return '';
    }
  }
}
