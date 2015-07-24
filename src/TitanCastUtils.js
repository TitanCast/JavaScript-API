TitanCastUtils = {};

//credit http://stackoverflow.com/questions/6150289/how-to-convert-image-into-base64-string-using-javascript

TitanCastUtils.base64URL = function(url, callback, outputFormat){ 
    
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function(){
        var canvas = document.createElement('CANVAS'),
        ctx = canvas.getContext('2d'), dataURL;
        canvas.height = this.height;
        canvas.width = this.width;
        ctx.drawImage(this, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        callback(dataURL);
        canvas = null; 
    };
    img.src = url;
    
};

TitanCastUtils.base64Img = function(img, callback, outputFormat){
    
    img.crossOrigin = 'Anonymous';
    img.onload = function(){
        var canvas = document.createElement('CANVAS'),
        ctx = canvas.getContext('2d'), dataURL;
        canvas.height = this.height;
        canvas.width = this.width;
        ctx.drawImage(this, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        callback(dataURL);
        canvas = null; 
    };
    
};


TitanCastUtils.base64Loaded = function(img, callback, outputFormat){
    
    img.crossOrigin = 'Anonymous';
    var canvas = document.createElement('CANVAS'),
    ctx = canvas.getContext('2d'), dataURL;
    canvas.height = this.height;
    canvas.width = this.width;
    ctx.drawImage(this, 0, 0);
    dataURL = canvas.toDataURL(outputFormat);
    callback(dataURL);
    canvas = null;
}