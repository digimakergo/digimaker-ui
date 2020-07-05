import * as React from 'react';
import { useState } from "react";
import { Link } from "react-router-dom";
import {getDefinition,getFields} from './util';
import util from './util';
import Moment from 'react-moment';
import LoadFields from './LoadFields';

//mode: (full/inline)
const ViewContent = (props:{content:any}) => {
    let data:any = {};
    let content = props.content;
    return <div>
              <LoadFields type={content.content_type} validation='' mode='view' data={content} afterField={()=>{}} />
       </div>;
}

export default ViewContent;
