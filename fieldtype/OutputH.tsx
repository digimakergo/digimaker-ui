import * as React from 'react';
import ReactTooltip from 'react-tooltip';

export default class OutputH extends React.Component<{ definition: any, validation: any, data: any, formdata: any }, {}> {

  constructor(props: any) {
    super(props);
    this.state = {};
  }

  render() {
    let def = this.props.definition;
    let identifier = def.identifier;
    let parameters = def.parameters;
    let className = parameters&&parameters['class']?parameters['class']:'';
    return <div className={"field "+def.type+" field-"+identifier+ ' '+className}><div dangerouslySetInnerHTML={{__html: def.name}} />
    {def.description && <i className="icon-info" data-for={def.identifier+'-description'} data-tip="" />}
    {def.description &&<ReactTooltip id={def.identifier+'-description'} html={true} effect="solid" place="right" clickable={true} multiline={true} delayHide={500} className="tip">{def.description}</ReactTooltip>}
    </div>
    }
}
