export declare class Page {
    contents: any;
    fileContent: string;
    script: any;
    context: any;
    constructor(context: any);
    run(callback: any): Promise<void>;
}
