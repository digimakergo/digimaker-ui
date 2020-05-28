import * as React from 'react';
import {useAccordionToggle} from 'react-bootstrap/AccordionToggle';
import { Accordion, Button } from 'react-bootstrap';

export class IconToggle extends React.Component<{className:string},{closed:boolean}> {
  constructor(props: any) {
    super(props);
    this.state = {closed:false};
  }

  click(){
    this.setState({closed: !this.state.closed});
  }

  render(){
    return (   <Accordion.Toggle as={Button} variant="link" bsPrefix="toggle" eventKey="0" onClick={()=>{this.click()}}>
    <i className={this.props.className+(this.state.closed?'':' open')}></i>
  </Accordion.Toggle>);
  }
}
