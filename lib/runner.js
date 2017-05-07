"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
var ejs = require('ejs');
var async = require('async');
var fs = require('fs');
var debug = require('debug')('@nodulus');
class Runner {
    static run(context, callback, errorcallback) {
        return __awaiter(this, void 0, void 0, function* () {
            var page = context.page;
            if (!context.page) {
                page = new global.nodulus.classes.Page(context);
                context.page = page;
            }
            page.parser = new global.nodulus.parser.Parser(context);
            debug('runner run');
            yield page.run();
            debug('run');
            page.fileContent = ejs.render(page.fileContent, page);
            page.fileContent = decodeURI(page.fileContent);
            page.parser.buildTree(page);
            let childrenResult = yield global.nodulus.runner.runChildren(context, page.controls);
            var result = global.nodulus.renderer.render(page);
            page.fileContent = result;
            if (page.masterpage) {
                let masterResult = yield page.masterpage.run();
                page.parser.buildTree(page.masterpage);
                childrenResult = yield global.nodulus.runner.runChildren(context, page.masterpage.controls);
                masterResult = yield global.nodulus.renderer.render(page.masterpage);
                page.masterpage.fileContent = ejs.render(page.masterpage.fileContent, page.masterpage);
                page.parser = new global.nodulus.parser.Parser(context);
                page.parser.parsePlaceHolders(page.masterpage);
            }
            return page.fileContent;
        });
    }
    static runScript(control) {
        return __awaiter(this, void 0, void 0, function* () {
            if (control.type.script !== undefined && control.type.script.init !== undefined) {
                var controlContext = { attributes: control.attributes, data: control.data, control: control };
                debug("run script");
                controlContext = yield control.type.script.init(control.context, controlContext);
                control.renderResult = ejs.render(control.type.template, controlContext);
                return;
            }
            else {
                return;
            }
        });
    }
    static runChildren(context, controlTree) {
        return __awaiter(this, void 0, void 0, function* () {
            for (var i = 0; i < controlTree; i++) {
                controlTree[i].context = context;
            }
            yield async.each(controlTree, this.runScript);
        });
    }
}
exports.Runner = Runner;
//# sourceMappingURL=runner.js.map