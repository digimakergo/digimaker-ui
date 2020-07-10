


//Register a component so it can be called dynamically.
//Note the component can be a real component,
//   or a 'lazy' one(using react.lazy load), which is a promise, so you need to use Suspense in that case.
export default class Registry{
    static components = {}

    static register( type:string, name: string, component: any){
        const identifier = type+":"+name;
        console.debug( "Registering component: " + identifier );
        Registry.components[identifier] = component;
    }

    //Use example:
    //let Com:React.ReactType = Registry.getComponent( '<type:identifier>' );
    //return <Com content={content}/>
    static getComponent(identifier:string){
        let com = Registry.components[identifier];
        if( !com ){
            console.error( "component " + identifier + " is not registered as component." );
        }
        return com;
    }

}
