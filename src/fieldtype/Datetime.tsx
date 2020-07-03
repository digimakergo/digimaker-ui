import * as React from 'react';
import {useState} from 'react';
import DateTime from 'react-datetime';
import 'react-datetime/css/react-datetime.css'
import './Datetime.css'
import moment from 'moment';
import { timeStamp } from 'console';

let defaultValue = 0;

export default class Datetime extends React.Component<{definition: any, validation: any, beforeField:any, afterField: any, data: any, mode: string },{date, hour, minute,datetime,disabled}> {
    
    
    constructor(props:any) {
        super(props);
        this.state = {
            date:'',
            hour:'',
            minute:'',
            datetime:'',
            disabled: false
          };
      }
      
        setdate(Date){
            let value = (moment(Date).format('L'))
            console.log("momment",value)
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
          let final = (moment(dateTime).format('DD/MM/YYYY HH:mm'));
          this.setState({
            datetime:final
          });
        }

      inline(){
        return (<span className="fieldtype-text"></span>)
      }
  
      view(){
      }
  
      edit(){
        const BeforeElement:React.ReactType = this.props.beforeField();
        const AfterElement:React.ReactType = this.props.afterField();
        return (
            <div  className="div">
              {BeforeElement}
                <label className='text'>Date</label> 
                <DateTime className='date' timeFormat={false} dateFormat="DD-MM-YYYY" onChange={value => this.setdate(value)}/>
                
                {this.state.disabled == true ? (
                  <span></span>
                  ) : (<span>
                      <label className="text">Hour</label>
                      <input className="time" type = "text" maxLength={2} onChange={this.setHour.bind(this)}/>
                      <label className="text">: Minutes</label>
                      <input className="time" type="text" maxLength={2} onChange={this.setMinute.bind(this)}/>
                  </span>
                )}
              {AfterElement}
            </div>
        )
      }
      componentWillUnmount(){
        this.combineValue();
      }
  
      render() {
          return this.edit();
      }  
}