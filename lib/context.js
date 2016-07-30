module.exports = function (req, res) {
    this.req = req;
    this.res = res;

    if (this.req.navigation) {
        this.req.runningPage = req.navigation.DisplayFile.FileName;
    }
    else {
        this.req.runningPage = "pages/" + req.originalUrl + ".html";
    }

}
