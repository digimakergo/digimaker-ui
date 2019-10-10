import * as React from 'react';
import Moment from 'react-moment';
import Config from '../../config.json';

export default class Image extends React.Component<{definition:any, identifier:string},{}> {

constructor(props:any) {
      super(props);
      this.state = {};
    }

    render(){
        return (
            <div>
                <label htmlFor={this.props.identifier}>{this.props.definition.name}:</label>
                <input type="text" id={this.props.identifier} className="form-control" name={this.props.identifier} />
            </div>
        )
    }
}
