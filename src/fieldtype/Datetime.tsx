import * as React from 'react';
import {useState} from 'react';
import DateTime from 'react-datetime';
import Moment from 'react-moment';
import 'react-datetime/css/react-datetime.css'
import moment from 'moment';
import { timeStamp } from 'console';

let defaultValue = 0;

export default class Datetime extends React.Component<{definition: any, validation: any, data: any, mode: string },{datetime, disabled, error:string}> {
    constructor(props:any) {
        super(props);
        let datetime = null;
        if( props.data ){
          if( Number.isInteger( props.data ) ){
            datetime = moment.unix(props.data)
          }else{
            datetime = moment(props.data)
          }
        }
        this.state = {datetime:datetime, disabled: false,error: ''};
      }

      updateValue(inputtype:string, value:any){
        let datetime = this.state.datetime;
        switch( inputtype ){
          case "date":
            if( !value.isValid() ){
              this.setState({error: 'invalid date'});
              return;
            }
            datetime = moment(value.format('YYYY-MM-DD'))
            break;
          case "hour":
            if( datetime ){
              let i = parseInt(value)
              if( isNaN( i ) || i<0 || i>59 ){
                  this.setState({error: 'invalid hour'});
                  return;
              }
              datetime.hour(value)
            }
            break;
          case "minute":
            if( datetime ){
              let i = parseInt(value)
              if( isNaN( i ) || i<0 || i>59 ){
                 this.setState({error: 'invalid minute'});
                 return;
              }
              datetime.minute(value)
            }
            break;
        }
        //todo: fix when hour and minute/date are both invalid
        //todo: do not allow submit when there is error.
        this.setState({datetime:datetime, error:''});
      }

      inline(){
        return (this.state.datetime?<Moment format="DD.MM.YYYY HH:mm">{this.state.datetime}</Moment>:'')
      }

      view(){
        return <><label className="field-label">{this.props.definition.name}</label>
                <div className="field-value">{this.inline()}</div>
              </>;
      }

      edit(){
        return (
            <div>
            <label className="field-label">{this.props.definition.name}</label>
            <div className="field-value">
                <DateTime className='fieldtype-datetime-date' defaultValue={this.state.datetime?this.state.datetime:''} timeFormat={false} dateFormat="DD.MM.YYYY" onChange={value => this.updateValue('date',value)}/>
                {!this.state.disabled&&<span> &nbsp;
                      <input className="fieldtype-datetime-time form-control" defaultValue={this.state.datetime?this.state.datetime.format('HH'):''} type = "text" maxLength={2} onChange={e => this.updateValue('hour',e.target.value)}/>
                      :<input className="fieldtype-datetime-time form-control" defaultValue={this.state.datetime?this.state.datetime.format('mm'):''} type="text" maxLength={2} onChange={e => this.updateValue('minute',e.target.value)}/>
                  </span>}
                {this.state.error&&<span className='error'>{this.state.error}</span>}
                {!this.state.error&&<input type="hidden" name={this.props.definition.identifier} value={this.state.datetime?this.state.datetime.format('YYYY-MM-DD HH:mm'):''} />}
                </div>
            </div>
        )
      }
      // componentWillUnmount(){
      //   this.updateValue();
      // }

      render() {
          if( this.props.mode == 'edit' ){
              return this.edit();
          }else if( this.props.mode == 'view' ){
              return this.view();
          }else{
              return this.inline();
          }
      }
}
