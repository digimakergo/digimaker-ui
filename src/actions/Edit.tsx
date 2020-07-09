// import * as React from 'react';
// import Moment from 'react-moment';
// import { RouteProps } from 'react-router';
// import { Link, Redirect } from "react-router-dom";
// import Config from '../dm.json';
// import LoadFields from '../ui/LoadFields';
// import Registry from '../ui/Registry';
// import {FetchWithAuth} from '../utils/util';

// export default class Edit extends React.Component<RouteProps, {content:any,validation:{}}> {

//     constructor(props: any) {
//         super(props);
//         this.state = {content:'',validation:''};
//     }

//     fetchData(id) {
//         FetchWithAuth(process.env.REACT_APP_REMOTE_URL + '/content/get/'+id)
//             .then(res => res.json())
//             .then((data) => {
//                 this.setState({ content: data});
//             })
//     }

//     componentDidMount(){
//       let id = this.props.match.params.id;
//       this.fetchData(id);
//     }

//     handleSubmit(event) {
//         event.preventDefault();
//         const form = new FormData(event.target);
//         const dataObject = {};
//         for (let key of Array.from(form.keys())) {
//             dataObject[key] = form.get(key);
//         };
//         FetchWithAuth(process.env.REACT_APP_REMOTE_URL + '/content/update/'+this.props.match.params.id, {
//             method: 'POST',
//             body: JSON.stringify(dataObject),
//         }).then((res) => {
//             if (res.ok) {
//                 this.props.history.push('/main/' + this.props.match.params.id);
//                 //todo: use redirect parameters
//             }else {
//                 console.log(res)
//                 return res.json();
//             }
//         }).then((data)=>{
//             this.setState( {validation: data} )
//         });;
//     }

//     render() {
//         if( !this.state.content ){
//           return (<div className="loading" />)
//         }

//         let data:any = {};
//         let content = this.state.content;


//         const Com:React.ReactType = Registry.getComponent("edit:before");
//         return (<div className="container-new">
//             <div>
//                 <form onSubmit={(e) => this.handleSubmit(e)}>
//                     <div className="form-tool">
//                         <div className="form-actions">
//                             <div className="action-title">Actions</div>
//                             <div className="action-body">
//                                 <div>
//                                     <button type="submit" className="btn btn-primary btn-sm"><i className="fas fa-paper-plane"></i> Submit</button>
//                                 </div>
//                                 <div>
//                                     <Link to={`/main/${this.props.match.params.id}`}>
//                                         <button type="button" className="btn btn-sm btn-secondary">
//                                             <i className="fas fa-window-close"></i> Cancel
//                                     </button>
//                                     </Link>
//                                 </div>
//                             </div>
//                         </div>


//                     </div>

//                     <div className="form-main">
//                         <h2>Edit {content.name}</h2>
//                         {Com!=null?<Com />:''}

//                         <LoadFields mode='edit' type={content.content_type} data={content} validation={this.state.validation}  />
//                     </div>
//                 </form>
//             </div>
//         </div>)
//     }
// }

import React from 'react';


export default ({ children = '-- Not implemented edit--' }) => (
  <div>
    <h2>{children}</h2>
  </div>
);
