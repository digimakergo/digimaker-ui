import * as React from 'react';
import LoadFields from './LoadFields';
import $ from 'jquery';

export default class GeneratePDF extends React.Component<{content:any, generate: boolean, generated?:any}, {}> {

    constructor(props: any) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        // this.fetchData();
        if( this.props.generate ){
          console.log( 'ffff' );
        }
    }

    componentDidUpdate(prevProps){
      if( !prevProps.generate && this.props.generate ){
        let html = $('.content-view-pdf-container').html();
        let location = window.location;
        let css = location.protocol + '//' + location.host + '/pdf.css';
        console.log( css );
        html = '<html><head>    <meta charset="utf-8" /><link href="'+css+'" rel="stylesheet" /></head><body><div class="footer"></div>'+html+'</body></html>';
        let name = this.props.content.name + '-' + this.props.content.id;
        this.generate( name, html );
      }
    }

    generate(name:string, html:string){
      let data = new FormData();
      data.append( 'html', html );
      data.append( 'name', name );
      fetch( process.env.REACT_APP_REMOTE_URL + '/pdf', {method:'post', body:data})
      .then(res=>res.text())
      .then((text)=>{
        this.setState({exporting: false});
        let url = process.env.REACT_APP_REMOTE_URL + '/../' + text;
        window.open(url, "_blank");
        this.props.generated(true);
      });
      console.log( html );
    }

    render() {
      let content = this.props.content;
      return (<div className="content-view-pdf-container" style={{display: "none"}}>
          <div className="content-view-pdf">
            <LoadFields type={content.content_type} validation='' mode='view' data={content} afterField={()=>{}} />
          </div>
      </div>);
    }
}
