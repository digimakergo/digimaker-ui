export function buildObject(form:any){
    const formData = new FormData(form);
    var map:any = {};
    for (let key of Array.from(formData.keys())) {
        map[key] = formData.get(key);
    };

    var formObj = require('form-data-to-object');
    let dataObject = formObj.toObj( map );
    return dataObject;
  };
