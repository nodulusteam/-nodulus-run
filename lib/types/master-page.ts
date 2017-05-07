var fs = require("fs");

export class MasterPage {
    contents: any;
    fileContent: string;
    script: any;
    context: any;
    placeholders: any;
    constructor(context, attributes) {
        var filename = attributes.masterpagefile;

        this.fileContent = fs.readFileSync(filename, "utf-8");
        this.fileContent = this.fileContent.replace(/run::/g, 'run__');
        this.fileContent = this.fileContent.replace(/run:/g, 'run_');
        this.script = require(process.cwd() + "/" + filename.replace(".master", ".js").replace(".html", ".js"));
        this.placeholders = {};
    }
    public async run(callback) {
        await this.script.init(this.context, this);
        return;

    }
    merge(page) {

    }

}
