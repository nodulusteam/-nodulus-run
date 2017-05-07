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
var fs = require("fs");
var debug = require('debug')('@nodulus');
class Renderer {
    static renderMaster(page) {
        return __awaiter(this, void 0, void 0, function* () {
            var controlTree = page.controls, pageStr = page.fileContent;
            var result = "";
            var lastIndex = 0;
            result = "";
            lastIndex = 0;
            var cheerio = require('cheerio');
            var $page = cheerio.load(pageStr, {
                normalizeWhitespace: true,
                xmlMode: true
            });
            if (page.masterpage) {
                var masterPageStr = page.masterpage.fileContent;
                var $ = cheerio.load(masterPageStr, {
                    normalizeWhitespace: true,
                    xmlMode: true
                });
                for (var placeholderId in page.contents) {
                    if (page.contents[placeholderId] !== undefined) {
                        var content = page.contents[placeholderId];
                        debug('content', $page('run__content[id="' + placeholderId + '"]').html());
                        let placeholderStr = $page('run__content[id="' + placeholderId + '"]').html();
                        $('run__placeholder[id="' + placeholderId + '"]').replaceWith(placeholderStr);
                    }
                }
                return $.html();
            }
            else {
                return $page.html();
            }
        });
    }
    static render(page) {
        return __awaiter(this, void 0, void 0, function* () {
            debug("render");
            var controlTree = page.controls, pageStr = page.fileContent;
            var cheerio = require('cheerio');
            var $ = cheerio.load(pageStr, {
                normalizeWhitespace: true,
                xmlMode: true
            });
            for (var i = 0; i < controlTree.length; i++) {
                var control = controlTree[i];
                $(control.originalname + '[id="' + control.id + '"]').replaceWith(control.renderResult);
            }
            return page.fileContent = $.html();
        });
    }
}
exports.Renderer = Renderer;
//# sourceMappingURL=renderer.js.map