import * as React from 'react';
import {useState} from 'react';
import DateTime from 'react-datetime';
import Moment from 'react-moment';
import 'react-datetime/css/react-datetime.css'
import moment from 'moment';
import { timeStamp } from 'console';

let defaultValue = 0;

export default class Datetime extends React.Component<{definition: any, validation: any, data: any, mode: string },{date, hour, minute,datetime,disabled}> {


    constructor(props:any) {
        super(props);

        let datetime = null;
        if( props.data && Number.isInteger( props.data ) ){
            datetime = moment.unix(props.data)
        }
        this.state = {
            date:'',
            hour:'',
            minute:'',
            datetime:datetime,
            disabled: false
          };
      }

        setdate(Date){
            let value = (moment(Date).format('L'))
            this.setState({date:value})
        };

        setHour(event) {
            this.setState({
              hour: event.target.value
            });

        };

        setMinute(event) {
            this.setState({
              minute: event.target.value
            });
        };

        combineValue(){
          let hour = ''
          if(this.state.hour <= '9')
          {
             hour = ('00' + this.state.hour).slice(-2);
          }
          var dateTime = moment(this.state.date + ' ' +hour+''+this.state.minute, 'DD/MM/YYYY HH:mm');
          let final = moment(dateTime);
          this.setState({
            datetime:final
          });
        }

      inline(){
        return <Moment format="DD.MM.YYYY HH:mm">{this.state.datetime}</Moment>
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
                <span>Date</span>&nbsp;
                <DateTime className='fieldtype-datetime-date' timeFormat={false} dateFormat="DD-MM-YYYY" onChange={value => this.setdate(value)}/>

                {this.state.disabled == true ? (
                  <span></span>
                ) : (<span> &nbsp;
                      <input className="fieldtype-datetime-time form-control" type = "text" maxLength={2} onChange={this.setHour.bind(this)}/>
                      :<input className="fieldtype-datetime-time form-control" type="text" maxLength={2} onChange={this.setMinute.bind(this)}/>
                  </span>
                )}
                </div>
            </div>
        )
      }
      componentWillUnmount(){
        this.combineValue();
      }

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
