var fs = require("fs");
var path = require("path");


export default class control {
    name: string;
    namespace: string;
    type: any;
    originalname: string;
    attributes: any;
    id: string;
    startIndex: number;

    constructor(namespace, name) {
        var folder = "";
        if (namespace === "run") {
            folder = "/controls/";
        }
        else {
            folder = "/" + namespace.replace(/_/g, '/') + "/";
        }

        this.name = name;
        this.namespace = namespace;
        this.type = {
            "name": name,
            "path": folder + name + ".js",
            "template": fs.readFileSync(path.join(process.cwd(), folder, name + ".html"), "utf-8"),
            script: require(process.cwd() + folder + name + ".js")
        }
    }
}
