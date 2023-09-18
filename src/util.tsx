import * as React from 'react';
import Cookies from 'universal-cookie';
import Registry from './Registry';
import { Modal, Button} from 'react-bootstrap';
import { useState } from 'react';
import { BrowseAfterListProps, ViewSettingsType } from './DMInit';

const cookies = new Cookies();

//todo: move this token into another file(auth).
let accessToken: any = null; //access token, which is a promise<string>

export const FetchWithAuth = (url: string, reqObj?: any) => {
  if( !(url.startsWith('/') || url.startsWith('http:') || url.startsWith('https:') ) ){
    url = process.env.REACT_APP_REMOTE_URL+'/'+url;
  }

  return GetAccessToken()
     .catch(err => {
      console.error(err); // todo: rediction or prompt message here or outside? returning a renderable error component might be good?
      throw err;
    }).then(token => {
      // add Authorization into header
      let authValue = 'Bearer ' + token;
      if (reqObj) {
        if (reqObj.headers) {
          reqObj.headers.delete('Authorization'); //If there is Authorization already, replace with this token
          reqObj.headers.append('Authorization', authValue);
        } else {
          reqObj.headers = new Headers({ 'Authorization': authValue });
        }
      } else {
        reqObj = { headers: new Headers({ 'Authorization': authValue }) };
      }

      //fetch
      return fetch(url, reqObj).then(res => {
        if (res.status == 440) { //if it expired, renew token and refetch with new token
          accessToken = null;
          return FetchWithAuth(url, reqObj);
        }

        //Internal error.
        if(res.status>=500&&res.status<600){
          res.text().then((data)=>{
            console.log( "error on request: " + url + ":" + data );
          });
          throw "Server side error: " + res.status;
        }

        return res.json().catch((err)=>{
          throw "response wrong format(should be json).";
        });

      })
    });
}

export const fetchWithAuth = FetchWithAuth;

//get new/renewed/cached access token, return promise<token>
//todo: use sigleton way to make sure it will only request once when accessToken is empty.
export function GetAccessToken() {
  if (!accessToken) {
    let refreshToken = util.getRefreshToken();
    if( !refreshToken ){
      return new Promise((resolve, reject) => {
          reject({code:'0001', message:'No token found.'});
        });
    }
    accessToken = fetch(process.env.REACT_APP_REMOTE_URL + '/auth/token/access/renew?token=' + refreshToken)
      .then(res => {
        if (!res.ok) {
          throw {code:'0001', message:"Can not proceed because of invalid authorization. Need to relogin?"};
        }
        return res.json().then((data)=>{
          if( data.error ){
            throw data.data;
          }
          return data.data
        });
      });
  }
  return accessToken
}

//Set access token. Useful when eg login.
export function SetAccessToken(token: string) {
  accessToken = new Promise(func => func(token))
}

//todo: make sure it only fetch once for one content type.

let definitionList:any = {}

//todo: use sync way?
export function getDefinition(contenttype: string){
  return definitionList[contenttype];
}

export function getFields(definition:any){
  let result:any = {};
  //todo: extract nested
  definition.fields.forEach((field)=>{
    result[field.identifier] = field;
  })
  return result;
}

export function getCommonFieldName(identifier:string) {
  let result:string = ''; //todo: use configuration
  switch(identifier){
    case 'name':
      result = 'Name';
      break;
    case 'modified':
      result = 'Modified';
      break;
    case 'author_name':
      result = 'Author';
      break;
    case 'published':
      result = 'Published';
      break;
    case 'id':
      result = 'ID';
      break;
    case 'priority':
      result = 'P';
      break;
    default:
      break;
  }
  return result;
}

export const Dialog = (props:{title:string, type?:string, onClose?:any, onSubmit?:any, children:any}) => {
    const [shown, setShown] = useState(true);

    const hide = ()=>{
      if( props.onClose ){
        props.onClose();
      }
      setShown(false);
    };

    const submit = ()=>{
      if( props.onSubmit ){
        props.onSubmit();
      }
      setShown(false);
    };

    return <Modal size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered show={shown} onHide={hide}>
       <Modal.Header closeButton>
    <Modal.Title>{props.title}</Modal.Title>
       </Modal.Header>
      <Modal.Body>
       {props.children}
      </Modal.Body>
       <Modal.Footer>
         {props.type=="confirm"&&<Button variant="primary" onClick={hide}>Close</Button>}
         {!props.type&&<><Button variant="danger" onClick={submit}>Yes</Button>
         <Button variant="secondary" onClick={hide}>Close</Button></>}
       </Modal.Footer>
      </Modal>;
};


let config:any = null;


//util for general operations
const util = {
  dateTime:{} as any,
  browseAfterList:null as (props: BrowseAfterListProps)=>React.ReactNode,
  //put replace variable with real value.eg. "this is {id}" with {'id': 5} will be "this is 5"
  washVariables:(str:string, values:any)=>{
   let variables = str.match(/{(\w+|_)}/g);
   let result = str;
   if( variables ){
     variables.forEach( ele => {
       let variable = ele.replace('{','').replace('}', ''); //todo: use regular expression better instead of replace
       if( values[variable] ){
          result = result.replace('{'+variable+'}', values[variable])
       }
     });
   }
   return result;
 },

 // get value from expression. eg. "relations.apartment.data"
 getValue:(expression:string, value:any)=>{
   let arr = expression.split( '.' );
   let result = value;
   for( let key of arr ){
     if( result[key] ){
       result = result[key];
     }else{
       result = '';
       break;
     }
   }
   return result;
 },

 cookieKey:'refreshToken',

 _vars: {},

 getRefreshToken:()=>{
    return cookies.get(util.cookieKey)
 },

 setRefreshToken:(token:string, path?:string)=>{
   cookies.set(util.cookieKey, token,{path:(path?'/':path),sameSite: true})
},

 //set key in cookie, useful when there is multi site in one domain.
 setCookieKey:(key:string)=>{
    util.cookieKey = key;
 },

 getCookieKey:()=>{
    return util.cookieKey;
 },

 alertFunc:null,

 alert:(message:any, title:string, type?:string)=>{
  if( util.alertFunc ){
    util.alertFunc( message, type, title );
  }else{
    window.alert( message );
  }
 },

 setConfig:(conf:any)=>{
   config = conf;
 },

 getViewSettings:null as (contenttype:string)=>ViewSettingsType,

 getConfig:()=>{
   return config;
 },

 getName:(content:any)=>{
    return content.metadata.name;
 },

 //get allowed type under the parent content. condition example: "id/3:article or subtype/images:article"
 //only support id(3 is an ancestor id in the example) and subtype(images is the subtype of parent)
 getAllowedType:(content:any, condition:string)=>{
   if( !condition ){
     return false;
   }
    let arr = condition.split(':');
    if( arr.length == 1 ){
      return condition;
    }else{
      let fieldCond = arr[0].split('/');
      let value = arr[1];
      //when it's id
      if( fieldCond.length == 1 ){      
        if( content.location.hierarchy.split('/').includes( fieldCond[0] ) ){
          return value;
        }else{
          return false;
        }
      //when it's field
      }else{
        let realValue = content[fieldCond[0]];
        if( !realValue ){
          return false;
        }
        if( Array.isArray( realValue ) ){
          let result:any = false;
          for( let item of realValue ){
            if( item == fieldCond[1] || item.value == fieldCond[1] ){
              result = value;
              break;
            }
          }
          return result;
        }else if( typeof realValue == 'object' ){
          if( realValue.value == fieldCond[1] ){
            return value;
          }else{
            return false;
          }
        }else if(realValue==fieldCond[1]){
          return value;
        }else{
          return false;
        }
      }
    }
 },

 setDefinitionList:(list:any)=>{
   definitionList = list;
 },

 getDefinition:getDefinition,
 getFields: getFields,

 mergeSettings: (first, second)=>{
   let result = {};

   //todo: replace this with getDefinition(key).has_location after getDefinition is async
   if( second["no_override"] ){
     return second;
   }

   //get all setting keys
   let settingKeys = Object.keys( second );
   for( let setting of Object.keys( first ) ){
     if( !settingKeys.includes( setting ) ){
       settingKeys.push( setting );
     }
   }

   for( let setting of settingKeys ){
     let value = second[setting];
     let firstValue = first[setting];
     if( value===undefined ){
       if( firstValue !==undefined ){
          result[setting] = firstValue;
       }
       continue;
     }

     //when setting value is array
     if( Array.isArray(value) && firstValue !==undefined ){
          //do not merge
          let removed = -1;
          for( let i=0; i<value.length; i++ ){
            if( value[i] == "-" ){
              removed = i;
              break;
            }
          }
          if( removed != -1 ){
              let valueCopy = [...value];
              valueCopy.splice( removed );
              result[setting] = valueCopy;
              continue;
          }

          //merge
          let newItems = [];
          for( let item of firstValue ){
            let existing = value.find((ele)=>{
                          return JSON.stringify(item) == JSON.stringify(ele)
                        });
            if( existing === undefined ){
              newItems.push( item );
            }
          }
          result[setting] = [...newItems, ...value]
          continue;
      }

      //when setting value is object
      if( typeof value === 'object' && firstValue !==undefined ){
         result[setting] = {...firstValue, ...value};
         continue;
      }

     //override in other cases
     result[setting] = value;
   }
   return result;
 },

 _settingCache:{},

 //For array it will replace
 getSettings:(settings:any, key:string, type:string )=>{
   let cacheKey = key + '-' + type;
   if( util._settingCache[cacheKey] === undefined ){
     let result = {...settings["*"]};
     let arr = key.split(":");

     if( settings[arr[0]] ){
       console.log( settings[arr[0]] );
       result =util.mergeSettings( result, settings[arr[0]] );
     }
     if( arr.length == 2 && settings[key] ){
       result =util.mergeSettings( result, settings[key] );
     }
     util._settingCache[cacheKey] = result;
   }
   return util._settingCache[cacheKey];
 },
 fetchByID:(id:number )=>{  
    return FetchWithAuth(`${process.env.REACT_APP_REMOTE_URL}/content/get/${id}`);
},

}

export default util;
