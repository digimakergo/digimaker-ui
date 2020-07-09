 import React from 'react';
 import { Modal ,Button} from 'react-bootstrap';



// export default ({ children = '-- Not implemented please --' }) => (
  
//     <Modal.Dialog>
//     <Modal.Header closeButton>
//       <Modal.Title>Modal title</Modal.Title>
//     </Modal.Header>
  
//     <Modal.Body>
//     {children}
//     </Modal.Body>
  
//     <Modal.Footer>
//       <Button variant="secondary">Close</Button>
//       <Button variant="primary">Save changes</Button>
//     </Modal.Footer>
//   </Modal.Dialog>
  
// );



//import React from 'react';
//import ReactDOM from 'react-dom';


// width: 100%;
// height: 100%;
// position: fixed;
// z-index: 100;
// left: 0;
// top: 0;
// background-color: rgba(0,0,0,0.5);


const Modals = ({ isShowing, hide,title,submit,body }) => isShowing ? 
<div  className='modal-overlay'>
 <Modal.Dialog  size="lg">
    <Modal.Header closeButton>
<Modal.Title>{title}</Modal.Title>
    </Modal.Header>
  
   <Modal.Body>
    {body}
   </Modal.Body>
  
    <Modal.Footer>
      <Button variant="secondary" onClick={hide}>Close</Button>
       <Button variant="primary" onClick={submit}>Save changes</Button>
    </Modal.Footer>
   </Modal.Dialog></div>: null;

export default Modals;
// import React from 'react';
// import { Modal ,Button} from 'react-bootstrap';



