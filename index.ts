///runjs middleware
///@2017 roi ben haim
///
///
///
//////////////////////////////////////////////////////////////////////////////////////////
import  Parser from './lib/parser';
import  Renderer from './lib/renderer';
import  {Page , MasterPage} from './lib/classes';

var debug = require('debug')('@nodulus');
var fs = require("fs");
var config = require("@nodulus/config");
global.nodulus = {
    classes: require('./lib/classes'),
    parser: require('./lib/parser').Parser,
    renderer: require('./lib/renderer').Renderer,
    runner: require('./lib/runner').Runner,
    builder: require('./lib/request-builder')
}



export default class index {
    public static async recurseme(context) {
        let result = await global.nodulus.runner.run(context);
        var a = result.indexOf("run_");
        var b = result.indexOf("run__");
        if (a > -1 && a != b)
            index.recurseme(context);
        else {
            result = await Renderer.renderMaster(context.page);
        }
        return result;
    }

    public static async middleware(req, res, next) {
        var url = req.url;
        if (!url.indexOf)
            url = url.path;

        //we handle only no extension requests
        if (url.indexOf('.') === -1) {
            // global.nodulus.builder.build(req);
            var context = new global.nodulus.classes.Context(req, res);
            let result = await index.recurseme(context);
            context.res.send(result);
        }
        else {
            //this is not a run page, move on
            next();
        }
    }
}






