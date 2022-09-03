import * as React from 'react';
import {FetchWithAuth} from 'digimaker-ui/util';

export default class Copy extends React.Component<{from:any, changed:boolean, selected?:any}, {triggered:boolean}> {

  constructor(props: any) {
      super(props);
      this.state = {triggered: props.changed};
  }

  //when it's changed, trigger it
  componentDidUpdate(prevProps, prevState, snapshot){
      if( prevProps.changed != this.props.changed ){
          this.setState({triggered: true});
      }
  }

  //close dialog
  close(){
    this.setState({triggered:false});
  }

  render(){
    return this.state.triggered&&<div style={{background:'white',position:'fixed', left:'30%',top:'20%',width:'500px', height:'500px'}}>
    COPY {this.props.from?this.props.from.name:''}, {this.props.selected&&<span>{Object.keys(this.props.selected).map((value)=>{return value+', '})}</span>}
    <div>Please choose target:  <button className="btn btn-secondary" onClick={()=>this.close()}>Close</button>
    </div></div>
  }
}
