import * as React from "react";
import {
	Link,
} from "react-router-dom";
import List, { ListProps } from "./List";
import { ActionConfigType, ContentActionParams } from "./Actions";
import Actions from "./Actions";
import ViewContent from "./ViewContent";
import { FetchWithAuth } from "./util";
import ReactTooltip from "react-tooltip";
import { getDefinition } from "./util";
import Moment from "react-moment";

export interface MainSettings {
    /** Openside or not */
    openSide?:boolean;

    /** Content types listed */
    list:Array<string>;

    /** Content types list for creating */
    new: Array<string>;

    /** Actions on main page */
    actions?:Partial<ActionConfigType>[];

    /** Show metainfo or not */
    metainfo?:boolean;

    /** Enable content view or not */
    view?:boolean;

    viewComponent: (props:{content:any})=> JSX.Element;

    sideActions?:Partial<ActionConfigType>[];
}

interface MainProps {
	id: number;
	contenttype?: string;
	getMainConfig: (content: any) => MainSettings;
	getListConfig: (parent: any, contenttype: string) => ListProps;
	onLoad?:(content:any)=>void;
	redirect: (url: string) => void;
}

class Main extends React.Component<
	MainProps,
	{ content: any; sideOpen: any }
> {
	constructor(props: any) {
		super(props);
		this.state = { content: "", sideOpen: null };
	}
	//fetch content
	fetchData() {
		let url = "/content/get";
		if (this.props.contenttype) {
			url = `${url}/${this.props.contenttype}/${this.props.id}`;
		} else {
			url = `${url}/${this.props.id}`;
		}
		FetchWithAuth(process.env.REACT_APP_REMOTE_URL + url)
			.then((data) => {
				let content = data.data;
				if( this.props.onLoad ){
					this.props.onLoad(content)
				}

				let sideOpenConfig = this.state.sideOpen;
				let mainConfig = this.getMainConfig(content);
				sideOpenConfig = mainConfig["openSide"] ? 1 : 0;

				this.setState({ content: content, sideOpen: sideOpenConfig });
			})
			.catch((err) => {
				this.setState(() => {
					throw err;
				});
			});
	}

	componentDidMount() {
		this.fetchData();
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		//when changing page
		if (prevProps.id !== this.props.id) {
			this.setState({ sideOpen: prevState.sideOpen });
			this.fetchData();
		}
	}

	componentWillUnmount() {}

	afterAction(redirect: boolean) {
		if (redirect) {
			this.props.redirect(`/main/${this.state.content.parent_id}`);
		}
	}

	getMainConfig(content) {
		return this.props.getMainConfig(content);
	}

	render() {
		if (!this.state.content) {
			return "";
		}
		let contenttype = this.state.content.content_type;
		let def = getDefinition(contenttype);
		let mainConfig = this.getMainConfig(this.state.content);
		let listContenttypes: string[] = mainConfig["list"];

		let newTypes = mainConfig["new"];
		return (
			<div
				key={this.state.content.id}
				className={`contenttype-${this.state.content.content_type}`}
			>
				<div className="main-top">
					{/* area for actions */}
					<div className="content-actions">
						{newTypes.length > 0 && (
							<div className="action-create">
								<label>Create</label>
								{newTypes.map((contenttype: any) => {
									return (
										<Link
											key={contenttype}
											to={`/create/${this.state.content.id}/${contenttype}`}
											data-place='bottom'
											data-tip={""}
										>
											<i
												className={`icon icon-contenttype icon-${contenttype}`}
											/>
										</Link>
									);
								})}
								<ReactTooltip effect="solid" />
								<div />
							</div>
						)}

						<Actions
							actionProps={{
								from: this.state.content,
								params: {
									content: this.state.content,
									afterAction: (redirect: boolean) =>
										this.afterAction(redirect),
								} as ContentActionParams,
								fromview: "content",
							}}
							actionsConfig={mainConfig.actions}
						/>
					</div>

					<h2>
						<a href="/" onClick={(e: any) => e.preventDefault()}>
							<i
								data-tip={true}
								data-for="contentype"
								className={`icon icon-${this.state.content.content_type}`}
							/>
						</a>
						&nbsp;
						<ReactTooltip place="bottom" id="contentype">
							{def.name}
						</ReactTooltip>
						{this.state.content.name} &nbsp;&nbsp;
						{!(
							contenttype === "folder" &&
							this.state.content.folder_type === "site"
						) && (
							<Link
								className="go-uppper"
								title="Go upper"
								to={`/main/${this.state.content.parent_id}`}
							>
								<i className="fas fa-chevron-circle-up" />
							</Link>
						)}
					</h2>

					{mainConfig["metainfo"] && (
						<div>
							<i style={{ fontSize: "0.85rem" }}>
								modified by <Link
									to={`/main/user/${this.state.content.author}`}
								>{this.state.content.author_name}</Link>
								{/* <Moment unix format="DD.MM.YYYY HH:mm">{this.state.content.modified}</Moment> */}
							</i>
							&nbsp;&nbsp;
							<a href="/" onClick={(e=>e.preventDefault())}>
								<i
									data-tip={true}
									data-for="metainfo"
									className="fas fa-info-circle"
								/>
							</a>
							<ReactTooltip
								id='metainfo'
								clickable={true}
								delayShow={200}
								delayHide={500}
								place="bottom"
								effect='solid'
							>
								<MetaInfo content={this.state.content} />
							</ReactTooltip>
							&nbsp;&nbsp;
						</div>
					)}
				</div>
				<div className="main-main">
					<div className="main-content">
						{/* view content */}
						{mainConfig && mainConfig["view"] && (
							<div className="view-content">
								<ViewContent content={this.state.content} />
							</div>
						)}						

                        {mainConfig&&mainConfig.viewComponent&&(
                            <React.Suspense fallback="...">
                            {(() => {
                                const Com = mainConfig.viewComponent;                               
                                return (<Com content={this.state.content} />) as JSX.Element;
                            })()}
                            </React.Suspense>
                        )}

						{/* children list */}
						{listContenttypes.length > 0 && (
							<div className="list">
								{listContenttypes.map((subtype) => {
									let listConfig = this.props.getListConfig(
										this.state.content,
										subtype,
									);
									return (
										<List
										    key={subtype}
											id={this.props.id}
											contenttype={subtype}
											{...listConfig}
											row_actions={listConfig.row_actions}
										/>
									);
								})}
							</div>
						)}
					</div>

					{/* side area for actions */}
					{mainConfig && mainConfig.sideActions && (
						<div
							className={`side${this.state.sideOpen === true ? " open" : ""}${
								this.state.sideOpen === false ? " closed" : ""
							}${this.state.sideOpen === 0 ? " init-closed" : ""}`}
						>
							<div className="hider">
								<a
									href="/"
									onClick={(e) => {
										e.preventDefault();
										this.setState({
											sideOpen: this.state.sideOpen ? false : true,
										});
									}}
								>
									<i className="fas fa-caret-down" />
								</a>
							</div>
							<div className="side-body">
								{mainConfig.sideActions && (
									<div className="slide-actions">
										<Actions
											actionProps={{
												from: this.state.content,
												fromview: "content",
												params: {
													content: this.state.content,
													afterAction: (redirect: boolean) =>
														this.afterAction(redirect),
												} as ContentActionParams,
											}}
											actionsConfig={mainConfig.sideActions}
										/>
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			</div>
		);
	}
}

class MetaInfo extends React.Component<{content:any}> {
    render () {
      return (
           <div>
             <div>ID: {this.props.content.id}</div>
             <div>CID: {this.props.content.cid}</div>
             <div>Published:  &nbsp;
              <Moment unix format="DD.MM.YYYY HH:mm">{this.props.content.published}</Moment>
             </div>
             <div>Modified: &nbsp;
              <Moment unix format="DD.MM.YYYY HH:mm">{this.props.content.modified}</Moment>
             </div>
             {this.props.content.version>0&&<div>Version: {this.props.content.version}</div>}
             <div>Status: <span className={"status-"+this.props.content.content_type+" status-"+this.props.content.status}></span></div>
             <div>UID: {this.props.content.uid}</div>
           </div>
      );
    }
  }
  

  export default Main;