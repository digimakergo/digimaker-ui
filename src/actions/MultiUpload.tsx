import React,{useState} from 'react';
import {FetchWithAuth} from '../util';
import util from '../util';
import MultiUploadC from '../MultiUpload';

const MultiUpload =(props:{parent:any,afterAction:any})=>{
  const [validation,setValidation] = useState({})

  const keyUpHandler = (event:any)=> {
    if (event.keyCode == 27) {
        //this.props.show = 'false';
    }
  }
  
  const cancel = ()=>{
    props.afterAction(2);
  }
  
    return (<div onKeyUp={keyUpHandler} className="container-new">
        <div>
                <div className="form-tool">
                    <div className="form-actions">
                        <div className="action-title">Actions</div>
                        <div className="action-body">
                           
                            <div>
                              <button type="button" className="btn btn-sm btn-secondary" onClick={cancel}>
                                  <i className="fas fa-window-close"></i> Cancel
                              </button>
                            </div>
                        </div>
                    </div>                    


                </div>

                <div className="form-main">
                    <h2>MultiUpload</h2>
                    <MultiUploadC 
                      name='multiUpload' 
                      service="content" 
                      multi={true} 
                      format="image/*" 
                      value={[]} 
                      parent={props.parent}
                     />

                </div>
        </div>
    </div>)
}


export default  MultiUpload


