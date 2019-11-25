import Fieldtype from './fieldtype.json';
import Checkbox  from './fieldtype/Checkbox'
import File  from './fieldtype/File'
import Image  from './fieldtype/Image'
import RichText  from './fieldtype/RichText'
import Text  from './fieldtype/Text'

export default class FieldRegister{
        static fieldtypeMap = {};      

        static registerComponent( fieldtype: string, component:any ){
            console.debug( "Registering field type:" + fieldtype )
            FieldRegister.fieldtypeMap[fieldtype] = component
        }

        static getFieldtypes(){
            return FieldRegister.fieldtypeMap;
        }

        static getFieldtype( fieldtype:string ){
           const result = FieldRegister.fieldtypeMap[fieldtype];
           if( !result ){
               console.log( "fieldtype " + fieldtype +" is not supported." );
           }
           return result;
        }
}

//Register all from config.json
(()=>{
    FieldRegister.registerComponent( 'checkbox', Checkbox );
    FieldRegister.registerComponent( 'file', File );
    FieldRegister.registerComponent( 'image', Image );
    FieldRegister.registerComponent( 'richtext', RichText );
    FieldRegister.registerComponent( 'text', Text );
})()
