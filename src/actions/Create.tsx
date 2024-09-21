import * as React from 'react';
import Moment from 'react-moment';
import { RouteProps } from 'react-router';
import { Link, Redirect } from "react-router-dom";
import RenderFields from '../RenderFields';
import {FetchWithAuth} from '../util';
import util from '../util';
import { i18n } from '../i18n';


export default class Create extends React.Component<{parent:number, contenttype:string, afterAction:any}, {validation:{}}> {

    constructor(props: any) {
        super(props);
        this.state = {validation:''};
    }

    keyUpHandler(event) {
        if (event.keyCode == 27) {
            //this.props.show = 'false';
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        const form = new FormData(event.target);
        const dataObject = {};
        for (let key of Array.from(form.keys())) {
            dataObject[key] = form.get(key);
        };
        FetchWithAuth( 'content/create/' + this.props.contenttype + '/' + this.props.parent, {
            method: 'POST',
            body: JSON.stringify(dataObject),
        }).then((data) => {
            if( data.error === false ){
                this.props.afterAction(1, data);           
            }else{
                //todo: check error code to distigush network error vs normal error
                util.alert(data.data.message, 'error');
                this.setState( {validation: data.data.detail} )
            }
        });
    }

    cancel(){
      this.props.afterAction(2);
    }

    render() {
        return (<div onKeyUp={this.keyUpHandler} className="container-new">
            <div>
                <form onSubmit={(e) => this.handleSubmit(e)}>
                    <div className="form-tool">
                        <div className="form-actions">
                            <div className="action-title">{i18n.t('Actions')}</div>
                            <div className="action-body">
                                <div>
                                    <button type="submit" className="btn btn-primary btn-sm"><i className="fas fa-paper-plane"></i> {i18n.t('Submit')}</button>
                                </div>
                                <div>
                                    {/* <Link to={`/main/${this.props.parent}`}> */}
                                        <button type="button" className="btn btn-sm btn-secondary" onClick={()=>this.cancel()}>
                                            <i className="fas fa-window-close"></i> {i18n.t('Cancel')}
                                    </button>
                                    {/* </Link> */}
                                </div>
                            </div>
                        </div>                    


                    </div>

                    <div className="form-main">
                        <h2>Create {this.props.contenttype}</h2>
                        <RenderFields type={this.props.contenttype} validation={this.state.validation} data='' mode='edit'/>
                    </div>
                </form>
            </div>
        </div>)
    }
}
