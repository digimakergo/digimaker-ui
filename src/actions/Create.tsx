import * as React from 'react';
import Moment from 'react-moment';
import { RouteProps } from 'react-router';
import { Link, Redirect } from "react-router-dom";
import Config from '../dm.json';
import LoadFields from '../ui/LoadFields';
import {FetchWithAuth} from '../utils/util';

export default class Create extends React.Component<RouteProps, {validation:{}}> {

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
        FetchWithAuth(process.env.REACT_APP_REMOTE_URL + '/content/new/' + this.props.match.params.parent + '/' + this.props.match.params.contenttype, {
            method: 'POST',
            body: JSON.stringify(dataObject),
        }).then((res) => {
            if (res.ok) {
                this.props.history.push('/main/' + this.props.match.params.parent);
                //todo: use redirect parameters
            } else {
                console.log(res)
                return res.json();
            }
        }).then((data)=>{
            this.setState( {validation: data} )
        });
    }

    render() {
        return (<div onKeyUp={this.keyUpHandler} className="container-new">
            <div>
                <form onSubmit={(e) => this.handleSubmit(e)}>
                    <div className="form-tool">
                        <div className="form-actions">
                            <div className="action-title">Actions</div>
                            <div className="action-body">
                                <div>
                                    <button type="submit" className="btn btn-primary btn-sm"><i className="fas fa-paper-plane"></i> Submit</button>
                                </div>
                                <div>
                                    <button type="button" className="btn btn-sm btn-secondary"><i className="fas fa-save"></i> Save draft</button>
                                </div>
                                <div>
                                    <Link to={`/main/${this.props.match.params.parent}`}>
                                        <button type="button" className="btn btn-sm btn-secondary">
                                            <i className="fas fa-window-close"></i> Cancel
                                    </button>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="form-actions">
                            <div className="block-title">Resources</div>
                            <div className="block-body">
                                <ul className="nav nav-tabs">
                                    <li className="active"><a data-toggle="images" href="#images">Images</a></li>
                                    <li><a data-toggle="contents" href="#images">Contents</a></li>
                                    <li><a data-toggle="videos" href="#images">Videos</a></li>
                                </ul>
                            </div>

                        </div>


                    </div>

                    <div className="form-main">
                        <h2>Create {this.props.match.params.contenttype}</h2>
                        <LoadFields type={this.props.match.params.contenttype} validation={this.state.validation} data=''/>
                    </div>
                </form>
            </div>
        </div>)
    }
}
