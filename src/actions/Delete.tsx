import * as React from 'react';
import {FetchWithAuth} from '../utils/util';

import Button from 'react-bootstrap/Button'
import Modal from '../actions/Modal';
import useModal from '../actions/useModal';
import { useEffect } from 'react';


const Delete = (props) => {
  
  //let body= [<h4>are you sure?</h4>];
  const {isShowing, toggle} = useModal();
  useEffect(() => {
  
  

   toggle();
  },[]);


const close=()=>{
      toggle();
     }
const body=()=>{
  
      return   (  <div><h4>Are you sure to delete(including children)?</h4>
            <ul>
            {Object.keys(props.selected).map((id)=>{
              return <li>{props.selected[id]}</li>
                })}
            </ul></div>)
}
const submit=()=>{
  // let ids = Object.keys(props.selected);
  // let idStr = ids.join(',');
  // FetchWithAuth(process.env.REACT_APP_REMOTE_URL + '/content/delete?id='+idStr)
  //     .then(res=>res.text())
  //     .then((text)=>{
  //       if( text == 1 ){
  //         let jumpToParent = false;
  //         if(ids.length == 1 && props.from && props.from.id == ids[0]){
  //           jumpToParent = true;
  //         }
  //         props.afterAction(true, jumpToParent);
  //         close();
  //       }else{
  //        // this.setState({error:text});
  //       }
  //     });

} 

  return (
   
     
      <Modal
        body={body()}
        title="Delete"
        submit={submit}
        isShowing={isShowing}
        hide={toggle}
      />
  
  );
};

export default Delete;






// export default class Copy extends React.Component<{from:any, changed:boolean, selected?:any, afterAction:any}, {triggered:boolean, shown:boolean, error:string}> {
//   constructor(props: any) {
//       super(props);
//       this.state = {triggered: props.changed, shown:true, error:''};
//   }

//   //when it's changed, trigger it
//   componentDidUpdate(prevProps, prevState, snapshot){
//       if( prevProps.changed != this.props.changed ){
//           this.setState({triggered: true, shown:true});
//       }
//   }

//   //close
//   close(){
//     this.setState({shown:false});
//   }

//   //submit
//   submit(){
    // let ids = Object.keys(this.props.selected);
    // let idStr = ids.join(',');
    // FetchWithAuth(process.env.REACT_APP_REMOTE_URL + '/content/delete?id='+idStr)
    //     .then(res=>res.text())
    //     .then((text)=>{
    //       if( text == 1 ){
    //         let jumpToParent = false;
    //         if(ids.length == 1 && this.props.from && this.props.from.id == ids[0]){
    //           jumpToParent = true;
    //         }
    //         this.props.afterAction(true, jumpToParent);
    //         this.close();
    //       }else{
    //         this.setState({error:text});
    //       }
    //     });
//   }

//   render(){
//     if(!this.state.triggered){
//         return '';
//     }

//     return <Modal
//       show={this.state.shown}
//       onHide={()=>this.close()}
//       size="lg"
//       aria-labelledby="contained-modal-title-vcenter"
//       centered
//     >
//       <Modal.Header closeButton>
//         <Modal.Title id="contained-modal-title-vcenter">
//           Delete
//         </Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         {this.state.error&&<div className="alert alert-error">{this.state.error}</div>}
//           <h4>Are you sure to delete(including children)?</h4>
//           <ul>
//           {Object.keys(this.props.selected).map((id)=>{
//             return <li>{this.props.selected[id]}</li>
//               })}
//           </ul>
//       </Modal.Body>
//       <Modal.Footer>
//         <Button onClick={()=>this.submit()} variant="danger">Delete</Button>
//         <Button onClick={()=>this.close()} variant="secondary">Cancel</Button>
//       </Modal.Footer>
//     </Modal>;


//   }
// }
