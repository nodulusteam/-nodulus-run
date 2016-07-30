var fs = require("fs");


module.exports = function (context, attributes) {
    var filename = attributes.masterpagefile;
    var pageInstance = this;

    pageInstance.fileContent = fs.readFileSync(filename, "utf-8");
    pageInstance.fileContent = pageInstance.fileContent.replace(/run::/g, 'run__');
    pageInstance.fileContent = pageInstance.fileContent.replace(/run:/g, 'run_');

    pageInstance.script = require(process.cwd() + "/" + filename.replace(".master", ".js").replace(".html", ".js"));
    pageInstance.placeholders = {};
    this.run = function (callback) {
        pageInstance.script.init(context, pageInstance, function () {
            callback();
        });
    }

    this.merge = function (page) {



    }
    return this;

}