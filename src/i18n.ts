import util from './util';
import norNo from './locale/nor-NO.json';
import engGB from './locale/eng-GB.json';

const translations = {
    'nor-NO':norNo,
    'eng-GB':engGB
}

const defaultNS = 'common';

export const i18n = {
    t:(str:string, ns?:string)=>{
        if(!ns){
            ns = defaultNS;
        }
        const obj = translations[util.lang][ns];
        if(obj[str]){
            return obj[str];
        }else{
            return str;
        }
    },
    merge:(tranlsation:any, lang:string, ns?:string)=>{
        if(!ns){
            ns = defaultNS;
        }
        const exisintTranslation = translations[lang][ns];
        translations[lang][ns] = [...exisintTranslation, ...tranlsation];
    }
}