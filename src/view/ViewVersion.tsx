import * as React from 'react';
import Moment from 'react-moment';
import { RouteProps } from 'react-router';
import RenderFields from '../RenderFields';
import { fetchWithAuth } from '../util';

export default class ViewVersion extends React.Component<RouteProps,{version:any, error: string}> {

  constructor(props: any) {
      super(props);
      this.state = {version:'', error: ''};
  }


  fetchData(id, version) {
      fetchWithAuth('content/version/'+id+'/'+version)         
          .then((data) => {
              this.setState({ version: data.data});
          })
  }

  componentDidMount(){
    let props:any = this.props;
    let id = props.match.params.id;
    let version = props.match.params.version;
    this.fetchData( id, version );
  }

  render () {
    let version =this.state.version;

    if( this.state.error != '' ){
      return <div className="alert alert-warning">{this.state.error}</div>
    }

    if( !version ){
      return <div className="loading"></div>
    }

    let content = JSON.parse( version.data );
    let data:any = {};
    Object.keys(content).map((key)=>{
      if( content[key].Raw != undefined ){
        data[key] = content[key].Raw;
      }
    });
    return (
       <div>
            <h2>{data.name}</h2>
            <div className="metainfo">Version {version.version} by {version.author} on <Moment unix format="DD.MM.YYYY HH:mm">{version.created}</Moment></div>
            <RenderFields type={version.metadata.contenttype} validation='' mode='view' data={data} afterField={()=>{}} />
       </div>
    );
  }
}
