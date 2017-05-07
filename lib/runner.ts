var ejs = require('ejs');
var async = require('async');
var fs = require('fs');
var debug = require('debug')('@nodulus');



export class Runner {
    public static async run(context, callback, errorcallback) {
        var page = context.page;
        if (!context.page) {
            page = new global.nodulus.classes.Page(context);
            context.page = page;
        }

        //attach a new parser instance to the page
        page.parser = new global.nodulus.parser.Parser(context);
        debug('runner run');
        await page.run();

        debug('run');

        page.fileContent = ejs.render(page.fileContent, page);
        page.fileContent = decodeURI(page.fileContent);
        // try {


        page.parser.buildTree(page);
        // page.parser.parsePlaceHolders(page, function () {
        let childrenResult = await global.nodulus.runner.runChildren(context, page.controls);

        var result = global.nodulus.renderer.render(page);

        page.fileContent = result;
        if (page.masterpage) {
            let masterResult = await page.masterpage.run();
            page.parser.buildTree(page.masterpage);
            childrenResult = await global.nodulus.runner.runChildren(context, page.masterpage.controls);

            masterResult = await global.nodulus.renderer.render(page.masterpage);

            page.masterpage.fileContent = ejs.render(page.masterpage.fileContent, page.masterpage);
            page.parser = new global.nodulus.parser.Parser(context);
            page.parser.parsePlaceHolders(page.masterpage);


        }

        return page.fileContent;
    }

    public static async runScript(control) {

        if (control.type.script !== undefined && control.type.script.init !== undefined) {

            var controlContext = { attributes: control.attributes, data: control.data, control: control };

            debug("run script");

            controlContext = await control.type.script.init(control.context, controlContext);


            control.renderResult = ejs.render(control.type.template, controlContext);
            return;

        }
        else {
            return;
        }
        //control.renderResult = ejs.render(control.type.template, control.type.script.model);

    }

    public static async runChildren(context, controlTree) {

        //add the context to the control
        for (var i = 0; i < controlTree; i++) {
            controlTree[i].context = context;
        }

        await async.each(controlTree, this.runScript);



    }


}






