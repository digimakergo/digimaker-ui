import Fieldtype from './fieldtype.json';

export default class FieldRegister{
        static fieldtypeMap = {};

        static register( fieldtype: string, path: string ){
            console.debug( "Will import " + path );
            import(''+path)
                .then(mod => {
                    FieldRegister.registerComponent( fieldtype, mod.default );
                }
                )
                .catch(error => {
                    console.error(`"${fieldtype}" is not supported ${error}`);
                });
        }

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
    for( let fieldtype in Fieldtype.fieldtypes )
    {
        let fieldtypePath = Fieldtype.fieldtypes[fieldtype];
        FieldRegister.register( fieldtype, fieldtypePath );
    }
})()
