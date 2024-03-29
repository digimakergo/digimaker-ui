
import * as React from 'react';
import { useState } from "react";
import { Link } from "react-router-dom";
import {getDefinition,getFields} from './util';
import util from './util';
import Moment from 'react-moment';
import RenderFields from './RenderFields';

interface ViewContentProps{
    /** content to be displayed */
    content:any
}

//mode: (full/inline)
const ViewContent = (props:ViewContentProps) => {
    let data:any = {};
    let content = props.content;
    return <div className="content-view">
              <RenderFields type={content.metadata.contenttype} validation='' mode='view' data={content} afterField={()=>{}} />
       </div>;
}

export default ViewContent;
