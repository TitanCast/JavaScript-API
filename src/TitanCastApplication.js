var TitanCastApplication = function(appName, appDesc, appCastURL, icon){

    this.appName = appName;
    this.appDesc = appDesc;
    this.appCastURL = appCastURL;

    if(icon)
      this.icon = icon.image ? icon.image : icon;
    else
      this.icon = "#none#";

};

TitanCastApplication.prototype.createDevice = function(uri, options){
    return new TitanCastDevice(uri, this, options);
}

TitanCastApplication.prototype.getIcon = function(){
    return this.icon;
}

TitanCastApplication.prototype.setIcon = function(icon){
    this.icon = icon;
}

TitanCastApplication.prototype.getAppName = function(){
    return this.appName;
}

TitanCastApplication.prototype.setAppName = function(appName){
    this.appName = appName;
}

TitanCastApplication.prototype.getAppDesc = function(){
    return this.appDesc;
}

TitanCastApplication.prototype.setAppDesc = function(appDesc){
    this.appDesc = appDesc;
}

TitanCastApplication.prototype.getAppCastURL = function(){
    return this.appCastURL;
}

TitanCastApplication.prototype.setAppCastURL = function(appCastURL){
    this.appCastURL = appCastURL;
}
