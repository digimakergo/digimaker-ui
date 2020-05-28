import * as React from 'react';
import {useAccordionToggle} from 'react-bootstrap/AccordionToggle';
import { Accordion, Button } from 'react-bootstrap';

export class IconToggle extends React.Component<{className:string, eventKey:string, open?:boolean},{open:boolean}> {
  constructor(props: any) {
    super(props);
    this.state = {open:(props.open==false?false:true)};
  }

  click(){
    this.setState({open: !this.state.open});
  }

  render(){
    return ( <Accordion.Toggle as={Button} variant="link" bsPrefix="toggle" eventKey={this.props.eventKey} onClick={()=>{this.click()}}>
    <i className={"foldable "+this.props.className+(this.state.open?' open':'')}></i>
  </Accordion.Toggle>);
  }
}
