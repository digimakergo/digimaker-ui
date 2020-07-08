import Fieldtype from './fieldtype.json';
import Checkbox  from './fieldtype/Checkbox'
import File  from './fieldtype/File'
import Image  from './fieldtype/Image'
import RichText  from './fieldtype/RichText'
import Text  from './fieldtype/Text'
import Number from './fieldtype/Number'
import Radio from './fieldtype/Radio'
import OutputH from './fieldtype/OutputH'
import Password from './fieldtype/Password'
import RelationList from './fieldtype/RelationList'
import Datetime from './fieldtype/Datetime';
import Relation from './fieldtype/Relation';

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
    FieldRegister.registerComponent( 'number', Number );
    FieldRegister.registerComponent( 'radio', Radio );
    FieldRegister.registerComponent( 'relationlist', RelationList );
    FieldRegister.registerComponent( 'password', Password );
    FieldRegister.registerComponent( 'output_h', OutputH );
    FieldRegister.registerComponent( 'datetime', Datetime);
    FieldRegister.registerComponent( 'relation', Relation);
})()
