export function buildObject(form:any){
    const formData = new FormData(form);
    var map:any = {};

    let arr:Array<string> = [];
    Array.from(formData.entries()).map((item)=>{
         arr.push( item[0]+'='+item[1] );
    });
    let objectStr = arr.join('&');

    var qs = require('qs');
    let dataObject = qs.parse( objectStr );
    console.log( objectStr );
    return dataObject;
  };
