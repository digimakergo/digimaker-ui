import * as React from 'react';
import Moment from 'react-moment';
import { RouteProps } from 'react-router';
import { Link, Redirect } from "react-router-dom";
import RenderFields from '../RenderFields';
import Registry from '../Registry';
import util, {FetchWithAuth} from '../util';
import { i18n } from '../i18n';

export default class Edit extends React.Component<{id:number, contenttype?:string, afterAction:any}, {content:any,validation:{}}> {

    private params:string = '';

    constructor(props: any) {
        super(props);
        this.state = {content:'',validation:''};
    }

    fetchData() {
        let url = 'content/get/'+this.params
        FetchWithAuth(url)
            .then((data) => {
                this.setState({ content: data.data});
            })
    }

    componentDidMount(){
      this.params = this.props.contenttype?(this.props.contenttype+'/'+this.props.id):this.props.id+'';
      this.fetchData();
    }

    handleSubmit(event) {
        event.preventDefault();
        const form = new FormData(event.target);
        const dataObject = {};
        for (let key of Array.from(form.keys())) {
            dataObject[key] = form.get(key);
        };

        let url = 'content/update/'+this.params;
        FetchWithAuth( url, {
            method: 'POST',
            body: JSON.stringify(dataObject),
        }).then((data) => {
            if (data.error===false) {
              this.props.afterAction(1);
            }else{
                window.alert(data.data.message);
                this.setState( {validation: data.data.detail} );
            }
        });
    }

    cancel(){
      this.props.afterAction(2);
    }

    render() {
        if( !this.state.content ){
          return (<div className="loading" />)
        }

        let data:any = {};
        let content = this.state.content;


        const Com:React.ReactType = Registry.getComponent("edit:before");
        return (<div className="container-new">
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
                                    <button type="button" onClick={()=>this.cancel()} className="btn btn-sm btn-secondary">
                                            <i className="fas fa-window-close"></i> {i18n.t('Cancel')}
                                    </button>
                                </div>
                            </div>
                        </div>


                    </div>

                    <div className="form-main">
                        <h2>{i18n.t('Edit')} {util.getName(content)}</h2>
                        {Com!=null?<Com />:''}

                        <RenderFields mode='edit' type={content.metadata.contenttype} data={content} validation={this.state.validation}  />
                    </div>
                </form>
            </div>
        </div>)
    }
}
