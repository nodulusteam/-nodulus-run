var fs = require("fs");
var path = require("path");
module.exports = function (data) {
    this.name = data.name;
    this.template = fs.readFileSync(path.join(process.cwd() , data.template), "utf-8");;
    this.path = data.path;
    this.script = require(process.cwd() + data.path);
}
