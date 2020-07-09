import Cookies from 'universal-cookie';
import Registry from './Registry';
import { useState } from 'react';

const cookies = new Cookies();

const refreshToken = cookies.get('refreshToken')

//todo: move this token into another file(auth).
let accessToken: any = null; //access token, which is a promise<string>

export function FetchWithAuth(url: string, reqObj?: any) {
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
        return res;
      })
    });
}

//get new/renewed/cached access token, return promise<token>
//todo: use sigleton way to make sure it will only request once when accessToken is empty.
export function GetAccessToken() {
  if (!accessToken) {
    accessToken = fetch(process.env.REACT_APP_REMOTE_URL + '/auth/token/access/renew?token=' + refreshToken)
      .then(res => {
        if (!res.ok) {
          throw "Can not proceed because of invalid authorization. Need to relogin?";
        }
        accessToken = res.text();
        return accessToken
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

export function getDefinition(contenttype: string){
  if( !definitionList[contenttype] ){
    definitionList[contenttype] = FetchWithAuth(process.env.REACT_APP_REMOTE_URL+'/contenttype/get/'+contenttype).then(res=>res.json())
  }
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
    case 'priority':
      result = 'P';
      break;
    default:
      break;
  }
  return result;
}

//util for toggle model service
export const useModal = () => {
  const [isShowing, setIsShowing] = useState(false);

  function toggle() {
    setIsShowing(!isShowing);
  }

  return {
    isShowing,
    toggle,
  }
};

let config:any = null;
//util for general operations
const util = {
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

 setConfig:(conf:any)=>{
   config = conf;
 },

 getConfig:()=>{
   return config;
 },

 //get allowed type under the parent content. condition example: "article:3 or article:images"
 //only support id(3 is an ancestor id in the example) and subtype(images is the subtype of parent)
 getAllowedType:(content:any, condition:string)=>{
   if( !condition ){
     return false;
   }
    let arr = condition.split(':');
    let type = arr[0];
    if( arr.length == 1 ){
      return type;
    }else{
      let value:any = arr[1];
      if(isNaN(value) && content.subtype && content.subtype == value){
        return type;
      }else if( !isNaN(value) && content.hierarchy.split('/').includes( value ) ){
        return type;
      }else{
        return false;
      }
    }
    return false;
 }
}

export default util;
