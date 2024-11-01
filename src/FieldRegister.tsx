import Checkbox  from './fieldtype/Checkbox'
import File  from './fieldtype/File'
import Image  from './fieldtype/Image'
import RichText  from './fieldtype/RichText'
import Text  from './fieldtype/Text'
import Int from './fieldtype/Int'
import Radio from './fieldtype/Radio'
import OutputH from './fieldtype/OutputH'
import Password from './fieldtype/Password'
import RelationList from './fieldtype/RelationList'
import Datetime from './fieldtype/Datetime';
import Relation from './fieldtype/Relation';
import Select from './fieldtype/Select';
import Json from './fieldtype/Json'

export interface FieldtypeProps{
    /** field definition */
    definition:any;

    /** validation in this field */
    validation?:any; 

    /** data on this field */
    data:any;
    
    /** mode */
    mode:string;

    /** contenttype the field in */
    contenttype: string;

    /** whole data */
    formdata:any;

    /** whole validation */
    formValidation:any;          
    
    afterLabel?:(fieldDef:any, data)=>React.ReactNode
}

export default class FieldRegister{
        static fieldtypeMap = {};

        static registerComponent( fieldtype: string, component:any ){
            console.debug( "Registering field type:" + fieldtype )
            FieldRegister.fieldtypeMap[fieldtype] = component
        }

        static getFieldtypes(){
            return FieldRegister.fieldtypeMap;
        }

        static getFieldtype( fieldtype:string, fieldPath?:string ){
          if( fieldPath && FieldRegister.fieldtypeMap[fieldPath] ){
            return FieldRegister.fieldtypeMap[fieldPath];
          }
           const result = FieldRegister.fieldtypeMap[fieldtype];
           if( !result ){
               console.log( "fieldtype " + fieldtype + " or "+ fieldPath +" is not supported." );
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
    FieldRegister.registerComponent( 'int', Int );
    FieldRegister.registerComponent( 'radio', Radio );
    FieldRegister.registerComponent( 'select', Select );    
    FieldRegister.registerComponent( 'json', Json);
    FieldRegister.registerComponent( 'relationlist', RelationList );
    FieldRegister.registerComponent( 'password', Password );
    FieldRegister.registerComponent( 'output_h', OutputH );
    FieldRegister.registerComponent( 'datetime', Datetime);
    FieldRegister.registerComponent( 'relation', Relation);
    
})()
