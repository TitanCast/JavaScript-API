var TitanCastApplication = function(appName, appDesc, appCastURL, icon, cb) {

    this.appName = appName;
    this.appDesc = appDesc;
    this.appCastURL = appCastURL;
    cb = cb || function() {};

    this.setIcon(icon, cb);

};

TitanCastApplication.prototype.createDevice = function(uri, options) {
    return new TitanCastDevice(uri, this, options);
}

TitanCastApplication.prototype.setIcon = function(icon, cb) {

    if (icon) {

        var _app = this;

        if (icon instanceof Image) {

            //image
            if (icon.complete) {

                TitanCastUtils.base64Loaded(icon, function(data) {
                    _app.icon = data;
                    cb();
                });

            } else {
                TitanCastUtils.base64Img(icon, function(data) {
                    _app.icon = data;
                    cb();
                });

            }

        } else if (typeof icon === 'string' || icon instanceof String) {

            if (icon.charAt(0) === "@") {

                TitanCastUtils.base64URL(icon.substr(1), function(data) {
                    _app.icon = data.substr(22);
                    cb();
                });

            } else {

                //an image that is base64'd already (hopefully).
                this.icon = icon;

            }

        } else {
            this.icon = icon;
        }

    } else {
        //no icon was provided
        this.icon = "#none#";
    }

}