var fs = require("fs");

module.exports = function (context) {
    var filename = context.req.runningPage
    var pageInstance = this;
    pageInstance.contents = {};
    pageInstance.fileContent = fs.readFileSync(filename, "utf-8");
    pageInstance.fileContent = pageInstance.fileContent.replace(/run::/g, 'run__');
    pageInstance.fileContent = pageInstance.fileContent.replace(/run:/g, 'run_');

    pageInstance.script = require(process.cwd() + "/" + filename.replace(".html", ".js"));
    this.run = function (callback) {
        pageInstance.script.init(context, pageInstance, function () {
            callback();
        });
    }
}