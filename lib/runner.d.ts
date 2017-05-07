export declare class Runner {
    static run(context: any, callback: any, errorcallback: any): Promise<any>;
    static runScript(control: any): Promise<void>;
    static runChildren(context: any, controlTree: any): Promise<void>;
}
