var fs = require("fs");

export class Page {
    contents: any;
    fileContent: string;
    script: any;
    context: any;
    constructor(context) {
        var filename = context.req.runningPage
        this.context = context;
        this.contents = {};
        this.fileContent = fs.readFileSync(filename, "utf-8");
        this.fileContent = this.fileContent.replace(/run::/g, 'run__');
        this.fileContent = this.fileContent.replace(/run:/g, 'run_');

        this.script = require(process.cwd() + "/" + filename.replace(".html", ".js"));

    }
    public async run(callback) {
        await this.script.init(this.context, this);
        return;
    }
}
