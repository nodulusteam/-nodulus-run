import Control from './types/control';
import  {Page , MasterPage} from './classes';

const htmlParserclass = require("htmlparser2");
var fs = require('fs');
var path = require('path');
var debug = require('debug')('@nodulus');

export default class Parser {
    context: any;
    parser: any;
    instance: Parser;
    pageInstance: any;
    directiveParser:any;
    masterpage:any;
    constructor(context) {
        this.context = context;
        var instance = this;


        var lastContentId = "";
        var lastPlaceHolder;
        var attrBag = {};


        this.parser = new htmlParserclass.Parser({
            onopentag: function (name, attribs) {


                if (name.indexOf("run__") == 0) {
                    var parts = name.split('__');

                    switch (parts[1]) {
                        case "master":
                            var c = new MasterPage(context, attrBag);
                            instance.pageInstance.masterpage = c;
                            instance.pageInstance.masterpage.startIndex = instance.parser.startIndex;
                            break;
                        case "content":
                            lastContentId = attribs["id"]
                            instance.pageInstance.contents[lastContentId] = { startIndex: instance.parser.startIndex }
                            break;
                    }                    
                }
                else if (name.indexOf("run_") == 0) {
                    var parts = name.split('_');
                    var effectiveName = parts[parts.length - 1];
                    var effectiveNamespace = name.replace("run_", "").replace("_" + effectiveName, "");
                    if (parts.length == 2) {
                        effectiveNamespace = parts[0];
                    }
                    let control = new Control(effectiveNamespace, effectiveName);
                    control.originalname = name;
                    control.attributes = attrBag;

                    if (attrBag["id"] === undefined)
                        throw (new Error('element ' + name + ' is missing an id'));

                    control.id = attrBag["id"];
                    control.startIndex = instance.parser.startIndex;
                    instance.pageInstance.controls.push(control);
                    //instance.pageInstance.controls[instance.pageInstance.controls.length-1]

                }
                attrBag = {};
            },
            onattribute: function (name, value) {
                attrBag[name] = value;
            },
            onclosetag: function (tagname) {
                if (tagname.indexOf("run__") == 0) {
                    var parts = tagname.split('__');
                    switch (parts[1]) {
                        case "master":
                            //    instance.pageInstance.masterpage.endIndex = instance.parser.endIndex;

                            break;
                        case "content":

                            instance.pageInstance.contents[lastContentId].endIndex = instance.parser.endIndex + (tagname.length);

                            break;

                        case "placeholder":


                            break;
                    }
                } else
                    if (tagname.indexOf("run") == 0) {
                        instance.pageInstance.controls[instance.pageInstance.controls.length - 1].endIndex = instance.parser.endIndex;
                    }
            }
        }, { decodeEntities: true });






        this.directiveParser = new htmlParserclass.Parser({
            onopentag: function (name, attribs) {
                if (name.indexOf("run__") == 0) {

                    var parts = name.split('__');

                    switch (parts[1]) {
                        case "master":
                            var c = new global.nodulus.classes.MasterPage(attrBag);
                            instance.masterpage = c;

                        case "content":
                            lastContentId = attribs["id"]
                            instance.pageInstance.contents[lastContentId] = { startIndex: instance.parser.startIndex }

                            //instance.pageInstance.masterpage.placeholders[];
                            //for(var i=0;i<)
                            break;

                        case "placeholder":
                            var placeholder = new global.nodulus.classes.PlaceHolder(attrBag);
                            debug(attrBag, placeholder);
                            placeholder.startMargin = instance.parser.startIndex
                            placeholder.startIndex = instance.parser.endIndex;
                            lastPlaceHolder = attribs["id"];
                            instance.pageInstance.placeholders[lastPlaceHolder] = placeholder;
                            break;


                        // // // case "placeholder":
                        // // // var placeholder = new global.nodulus.classes.PlaceHolder(attrBag);
                        // // // lastPlaceHolder = attribs["id"];
                        // // // placeholder.startIndex = instance.parser.startIndex;
                        // // // instance.pageInstance.masterpage.placeholders[lastPlaceHolder] = placeholder;  


                    }

                    //.controls[instance.pageInstance.controls.length-1]
                }


                attrBag = {};
            },
            onattribute: function (name, value) {
                attrBag[name] = value;
            },
            onclosetag: function (tagname) {
                if (tagname.indexOf("run__") == 0) {
                    var parts = tagname.split('__');

                    switch (parts[1]) {
                        case "master":
                            //  var c = new global.nodulus.classes.MasterPage(attrBag);               
                            //  instance.masterpage = c;    

                            break;
                        case "content":

                            break;

                        case "placeholder":
                            instance.pageInstance.placeholders[lastPlaceHolder].endIndex = instance.parser.endIndex;
                            break;
                    }

                    //.controls[instance.pageInstance.controls.length-1]
                }
                else if (tagname.indexOf("run") == 0) {

                }
            }
        }, { decodeEntities: true });
    }

    public buildTree(pageInstance) {
        pageInstance.controls = [];
        this.pageInstance = pageInstance;

        this.parser.write(pageInstance.fileContent);
        this.parser.end();


    }

    public parsePlaceHolders(pageInstance) {
        debug("begin parse placeholders");
        // pageInstance.controls = [];
        this.pageInstance = pageInstance;
        debug(pageInstance.fileContent);

        this.directiveParser.write(pageInstance.fileContent);
        this.directiveParser.end();


        debug("end parse placeholders");




    }

}


