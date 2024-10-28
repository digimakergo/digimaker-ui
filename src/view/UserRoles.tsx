import * as React from 'react';
import {FetchWithAuth} from '../util';
import List from '../List';
import {Link} from 'react-router-dom';
import Browse from '../Browse';
import util from '../util';

export default class UserRoles extends React.Component<{content:any},{browse:boolean, data:any}> {
  constructor(props: any) {
    super(props);
    this.state = { browse:false, data: '' };
  }

  componentDidMount(){
    this.fetchRoles()
  }

  fetchRoles(){
    FetchWithAuth('user/roles/'+this.props.content.id)
        .then((data) => {
          this.setState({data:data.data});
        } );
  }

  addRole(e:any){
    this.setState({browse: true});
  }

  confirmAdding(selected){
    let ids:any = [];
    for( let item of selected ){
      let existing = this.state.data.find( (i)=>i.id == item.id );
      if( !existing ){
        ids.push(item.id);
      }
    }

    FetchWithAuth('access/assign/'+this.props.content.id+'/'+ids.join(','))
        .then((data) => {
          if( data.data === true ){
            this.fetchRoles();
          }else{

          }
        } );
    this.setState({browse:false});
  }

  unassignRole(e:any, roleId:any){
    e.preventDefault();
    FetchWithAuth('access/unassign/'+this.props.content.id+'/'+roleId)
        .then((data) => {
          if( data.data === true ){
            this.fetchRoles();
          }
        } );
  }

  render(){
    let config = {};
    if( !this.state.data ){
      return '';
    }
    return <div className="block">
          <h3>
            Roles &nbsp;
            <a href="#" onClick={(e)=>this.addRole(e)}><i className="fas fa-plus"></i> Add</a>
            {this.state.browse&&<Browse multi={true} selected={this.state.data} onConfirm={(selected)=>this.confirmAdding(selected)} onCancel={()=>this.setState({browse:false})} trigger={true} contenttype={["role"]} />}
          </h3>
          <ul>
          {this.state.data.map( (item)=><li>
              <Link to={"/main/"+item.id}>{item.name||item.metadata.name}</Link> <a href="#" onClick={(e)=>this.unassignRole( e, item.id )}><i className="icon icon-delete"></i></a>
            </li> )}
          </ul>
      </div>;
  }
}
