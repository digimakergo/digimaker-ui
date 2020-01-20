export function buildObject(form:any){
    require('formdata-polyfill');
    const formData = new FormData(form);
    var map:any = {};

    let arr:Array<string> = [];
    Array.from(formData.entries()).map((item)=>{
         arr.push( item[0]+'='+item[1] );
    });
    let objectStr = arr.join('&');

    var qs = require('qs');
    let dataObject = qs.parse( objectStr, {parameterLimit:1000000, arrayLimit:100} );
    console.log( objectStr );
    return dataObject;
  };
