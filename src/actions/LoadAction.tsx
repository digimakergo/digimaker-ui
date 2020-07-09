import * as React from 'react';
import Registry from '../ui/Registry';
export default class LoadAction extends React.Component<{from:any, config:any, selected?:any, afterAction?:any}, {clickFlag:boolean}>{
    constructor(props: any) {
        super(props);
        this.state={clickFlag:false}; //todo: change it to be better way to communicate between components.
    }
  
    //render action component
    render(){
          let config = this.props.config;
          let Com:React.ReactType = Registry.getComponent( config['com'] );
          if(config.name){
            return <div className="action-item">
                     <a href='#' title={config.title} onClick={(e)=>{e.preventDefault();this.setState({clickFlag:!this.state.clickFlag})}}>
                      <i className={config.icon?("icon "+config.icon):("fas fa-tools")}></i> {config.name}
                     </a>
                    <Com from={this.props.from} selected={this.props.selected} changed={this.state.clickFlag} afterAction={this.props.afterAction} />
                   </div>
          }
    }
  }