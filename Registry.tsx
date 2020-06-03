
export default class Registry{
    static components = {}

    static register( type:string, identifier: string, component: any){
        const path = type+":"+identifier;
        console.debug( "Registering component: " + path );
        Registry.components[path] = component;
    }

    //Use example:
    //let Com:React.ReactType = Registry.getComponent( '<type:identifier>' );
    //return <Com content={content}/>
    static getComponent(path:string){
        let com = Registry.components[path];
        if( !com ){
            console.error( "path " + path + " is not registered as component." );
        }
        return com;
    }

}
