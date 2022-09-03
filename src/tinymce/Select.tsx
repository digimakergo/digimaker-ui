import * as React from 'react';
import {Redirect} from 'react-router-dom';
import List from 'digimaker-ui/List';
import DMInit from 'digimaker-ui/DMInit';
import Browse from 'digimaker-ui/Browse';
import util from 'digimaker-ui/util';
import {FetchWithAuth} from 'digimaker-ui/util';
import { env } from 'process';

export default class Select extends React.Component<{data:string}, {contenttype:string,selected: any, width: string, height: string}> {
    private sentData = {image: '', width:'', height:''};

    constructor(props: any) {
        super(props);
        let data = props.data.split(';');
        this.state = { contenttype:data[0], width:data[3], height:data[4], selected: ''};
    }

    componentDidMount(){
        let data = this.props.data.split(';');
        if( data[1] ){
            this.fetchData(data);
        }
    }    

    fetchData(data){
        FetchWithAuth(process.env.REACT_APP_REMOTE_URL + '/content/get/'+data[0]+'/'+data[1])
            .then((data) => {        
                this.setState({selected: data.data});
                this.sentData['image'] = data.data;
            }).catch(err=>{
              this.setState(()=>{throw err});
            })
    }

    send(){
        window.parent.postMessage(
            {
                mceAction: 'customAction',
                data: this.sentData
            }, '*');    
    }

    selectImage(value){
        this.sentData['image']=value;
        this.send();
    }


    render(){
        let browseConfig = util.getConfig().browse;
        return <DMInit>            
            <Browse contenttype={[this.state.contenttype]} selected={this.state.selected} trigger={true} inline={true} multi={false} config={browseConfig}  onConfirm={(selected)=>{this.selectImage(selected)}} />            
            <div className="tinymce-image-settings">
                Width: <input defaultValue={this.state.width} size={3} onChange={(e)=>{this.sentData['width']=e.target.value;this.send()}} type="text" />
                Height: <input defaultValue={this.state.height} size={3} onChange={(e)=>{this.sentData['height']=e.target.value;this.send()}}  type="text" />                
            </div>
            </DMInit>
    }
}