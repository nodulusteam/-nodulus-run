export declare class MasterPage {
    contents: any;
    fileContent: string;
    script: any;
    context: any;
    placeholders: any;
    constructor(context: any, attributes: any);
    run(callback: any): Promise<void>;
    merge(page: any): void;
}
