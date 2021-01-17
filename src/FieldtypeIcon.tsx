import React from 'react'

function FieldtypeIcon(props: { contenttype:string }) {
  return (<i className={"icon icon-contenttype icon-"+props.contenttype}></i>);
}


export default FieldtypeIcon;
