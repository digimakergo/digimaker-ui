import * as React from 'react';
import {useAccordionToggle} from 'react-bootstrap/AccordionToggle';
import { Accordion, Button } from 'react-bootstrap';

interface IconToggleProps {
  className: string;
  eventKey: string;
  open?: boolean;
}

function IconToggle({className, eventKey, open}: IconToggleProps) {
  const [openState, setOpenState] = React.useState(open);
  const toggle = useAccordionToggle(eventKey, () => {
    setOpenState(!openState);
  });

  return (
    <Accordion.Toggle
      as={Button}
      eventKey={eventKey}
      variant='link'
      bsPrefix='toggle'
      onClick={toggle}
    >
      <i className={`foldable ${className}${openState ? ' open' : ''}`}></i>
    </Accordion.Toggle>
  );
}

export default IconToggle;