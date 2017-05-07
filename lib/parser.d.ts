export default class Parser {
    context: any;
    parser: any;
    instance: Parser;
    pageInstance: any;
    directiveParser: any;
    masterpage: any;
    constructor(context: any);
    buildTree(pageInstance: any): void;
    parsePlaceHolders(pageInstance: any): void;
}
