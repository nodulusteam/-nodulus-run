const config = require('@nodulus/config');

export default class RequestBuilder {
    public static async build(req) {
        req.nodulus = new Object();
        req.nodulus.page = req.originalUrl;
        if (config.appSettings.routes) {
            var arr = req.originalUrl.split('/');
            arr = arr.filter(function (val) {
                return val.length > 0;
            });

            var index = 0;
            req.originalUrl = arr[index];
            var paramsMapping = config.appSettings.routes[arr[index]];
            index++;
            if (paramsMapping) {
                paramsMapping.forEach(function (item) {
                    req.params[item] = arr[index];
                    index++;
                });
            }
        }
    }
}
