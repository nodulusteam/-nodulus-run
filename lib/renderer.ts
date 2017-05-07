
var fs = require("fs");
var debug = require('debug')('@nodulus');

export default class Renderer {
    public static async   renderMaster(page) {
        var controlTree = page.controls,
            pageStr = page.fileContent;

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
                    $('run__placeholder[id="' + placeholderId + '"]').replaceWith(placeholderStr); //::placeholder[id="'+ placeholderId+ '"]'
                }
            }
            return $.html();
        }
        else {
            return $page.html();
        }
    }

    public static async render(page) {
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
    }
}

