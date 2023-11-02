import * as React from 'react';
import util, { FetchWithAuth, Dialog, getDefinition } from '../util';
import {ActionProps, ContentActionParams} from '../ActionsRender';
import { useState } from 'react';
import { i18n } from '../i18n';

export const CopyFilepath = (props:ActionProps) => {
    const content = (props.params as ContentActionParams).content;
    const [showSuccess, setShowSuccess] = useState(false)
    const click = async (e)=>{
        e.preventDefault();
        const path = content.file;
        let absPath = util.washVariables(process.env.REACT_APP_ASSET_URL as string, {imagepath:content.path})
        await copyTextToClipboard(absPath);
        setShowSuccess(true);
        setTimeout(()=>{
            setShowSuccess(false)
        },1000);
    }

    return <div className='action-item' title='Copy path to clipboard'>
        {showSuccess&&<div style={{position:'fixed', top: '10px', left: '40%', fontSize: '0.85rem'}} className='alert alert-success'>{i18n.t('Copied to clipboard!')}</div>}
            <a href="#" onClick={click}><i className='fa fa-clipboard'></i>{props.iconOnly?'':i18n.t('Copy path')}</a>
        </div>
}


const copyTextToClipboard =async (text) => {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand('copy', true, text);
    }
}