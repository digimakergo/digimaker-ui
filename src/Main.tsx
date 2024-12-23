import * as React from "react";
import {
	Link,
} from "react-router-dom";
import List, { ListProps } from "./List";
import { ActionConfigType, ContentActionParams } from "./ActionsRender";
import {ActionsRender} from "./ActionsRender";
import ViewContent from "./ViewContent";
import util, { FetchWithAuth } from "./util";
import ReactTooltip from "react-tooltip";
import { getDefinition } from "./util";
import Moment from "react-moment";
import { useEffect } from "react";

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
	/** id of the content */
	id: number;

	/** Content type, used for non-location content */
	contenttype?: string;

	/** Callback to get main config, return MainSettings */
	getMainConfig: (content: any) => MainSettings;

	/** Callback to get list on this main, return ListProps */
	getListConfig: (parent: any, contenttype: string) => ListProps;

	/** Invoked when content is fetched. Useful for leftmenu selection for example */
	onLoad?:(content:any)=>void;

	/** Redirect callback. for route use. */
	redirect: (url: string) => void;
}


const Main = (props:MainProps) =>{
	const [content, setContent] = React.useState(null);
	const [sideOpen, setSideOpen] = React.useState(null);

	//fetch content
	const fetchData = () => {
		let url = "content/get";
		if (props.contenttype) {
			url = `${url}/${props.contenttype}/${props.id}`;
		} else {
			url = `${url}/${props.id}`;
		}

		FetchWithAuth( url)
			.then((data) => {
				let content = data.data;
				if( props.onLoad ){
					props.onLoad(content)
				}

				let mainConfig = props.getMainConfig(content);
				let sideOpenConfig = mainConfig["openSide"] ? true : false;

				setContent(content);
				setSideOpen(sideOpenConfig)
			})
			.catch((err) => {
					throw err;
			});
	}

	useEffect(()=>{
		fetchData();
	},[props.id]);

	const afterAction = (redirect: boolean) => {
		if (redirect) {
			props.redirect(`/main/${content.parent_id}`);
		}
	}

	if (!content) {
		return <span></span>;
	}
	let contenttype = content.metadata.contenttype;
	let def = getDefinition(contenttype);
	let mainConfig = props.getMainConfig(content);
	let listContenttypes: string[] = mainConfig.list;

	let newTypes = mainConfig.new;
	return (
		<div
			key={content.id}
			className={`contenttype-${content.metadata.contenttype}`}
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
										to={`/create/${content.location.id}/${contenttype}`}
										data-place='bottom'
										data-tip={contenttype}
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

					<ActionsRender
						actionProps={{
							from: content,
							params: {
								content: content,
								afterAction: (redirect: boolean) =>
									afterAction(redirect),
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
							className={`icon icon-${content.metadata.contenttype}`}
						/>
					</a>
					&nbsp;
					<ReactTooltip place="bottom" id="contentype">
						{def.name}
					</ReactTooltip>
					{util.getName(content)} &nbsp;&nbsp;
					{(!(
						contenttype === "folder" &&
						content.folder_type === "site"						
					    ) && content.location ) && (
						<Link
							className="go-uppper"
							title="Go upper"
							to={`/main/${content.location.parent_id}`}
						>
							<i className="fas fa-chevron-circle-up" />
						</Link>
					)}
				</h2>

				{mainConfig["metainfo"] && (
					<div>
						<i style={{ fontSize: "0.85rem" }}>
							modified by <Link
								to={`/main/user/${content.metadata.author}`}
							>{content.metadata.author_name}</Link>
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
							<MetaInfo content={content} />
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
							<ViewContent content={content} />
						</div>
					)}						

					{mainConfig&&mainConfig.viewComponent&&(
						<React.Suspense fallback="...">
						{(() => {
							const Com = mainConfig.viewComponent;                               
							return (<Com content={content} />) as JSX.Element;
						})()}
						</React.Suspense>
					)}

					{/* children list */}
					{listContenttypes.length > 0 && (
						<div className="list">
							{listContenttypes.map((subtype) => {
								let listConfig = props.getListConfig(
									content,
									subtype,
								);
								return (
									<List
										key={subtype}
										id={props.id}
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
						className={`side${sideOpen === true ? " open" : ""}${
							sideOpen === false ? " closed" : ""
						}${sideOpen === 0 ? " init-closed" : ""}`}
					>
						<div className="hider">
							<a
								href="/"
								onClick={(e) => {
									e.preventDefault();
									setSideOpen(sideOpen?false:true);
								}}
							>
								<i className="fas fa-caret-down" />
							</a>
						</div>
						<div className="side-body">
							{mainConfig.sideActions && (
								<div className="slide-actions">
									<ActionsRender
										actionProps={{
											from: content,
											fromview: "content",
											params: {
												content: content,
												afterAction: (redirect: boolean) =>
													afterAction(redirect),
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

class MetaInfo extends React.Component<{content:any}> {
    render () {
      return (
           <div>
             <div>ID: {this.props.content.id}</div>
             <div>LID: {this.props.content.location.id}</div>
             <div>Published:  &nbsp;
              <Moment format="DD.MM.YYYY HH:mm">{this.props.content.metadata.published}</Moment>
             </div>
             <div>Modified: &nbsp;
              <Moment format="DD.MM.YYYY HH:mm">{this.props.content.metadata.modified}</Moment>
             </div>
             {this.props.content.version>0&&<div>Version: {this.props.content.metadata.version}</div>}
             <div>Status: <span className={"status-"+this.props.content.metadata.contenttype+" status-"+this.props.content.status}></span></div>
             <div>UID: {this.props.content.metadata.cuid}</div>
           </div>
      );
    }
  }
  

  export default Main;