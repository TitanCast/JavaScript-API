var TitanCastDevice = function(uri, application, options) {

    this.uri = uri.trim();
    this.application = application;
    this.connectionState = ConnectionStates.NOT_CONNECTED;
    this.deviceDetails = [];

    options = options || {};

    this.port = options.port || TitanCastAPI.globalOptions.port;

    this.events = [];

    if (this.uri.indexOf(".") == -1) {
        var chunks = this.uri.split(" ");

        var parts = [];

        for (chunk in chunks) {
            parts.push(parseInt(chunks[chunk], 16));
        }

        this.uri = parts.join(".");
    }

    //websocket stuffs
    this.websocket = new WebSocket("ws://" + this.uri + ":" + this.port);

    this.debugging = options.debugging || TitanCastAPI.globalOptions.debugging;

    this.debuggingStore = {
        byteLength : 0,
        packetLength : 0
    };

    if(this.debugging){
        var self = this;
        setInterval( function(){ debugTransfer(self) } , 1000 );
    }

    this.onmessage = function(e) {

        var packet = Packet.parse(e.data);

        if(this.debugging){
            this.debuggingStore.byteLength += e.data.length;
            this.debuggingStore.packetLength++;
        }

        if (this.connectionState == ConnectionStates.NOT_CONNECTED) {

            if (packet.type == "device_details") {

                this.deviceDetails = packet.data;

                this.send(Packet.create("request_connect", [

                    this.application.appName,
                    this.application.appDesc,
                    this.application.icon

                ]));
                
                console.log(this.application.icon);

                this.connectionState = ConnectionStates.AWAITING_RESPONSE;

                this.triggerEvent("sentRequest");

            }

        }

        if (this.connectionState == ConnectionStates.AWAITING_RESPONSE) {

            if (packet.type == "accept_connect_request") {

                this.send(Packet.create(
                    "cast_view_data",
                    this.application.appCastURL
                ));

                this.connectionState = ConnectionStates.CONNECTED;
                this.triggerEvent("connectAccept");
                return;

            } else if (packet.type == "reject_connect_request") {

                this.connectionState = ConnectionStates.NOT_CONNECTED;
                this.triggerEvent("connectReject");
                return;

            }

        }

        if (this.connectionState == ConnectionStates.CONNECTED) {

            switch(packet.type){

                case "custom_data":
                    this.triggerEvent("customData", [packet.data]);
                    break;
                case "accelerometer-update":

                    var acdata = packet.data;
                    acdata = {
                        x : parseFloat(acdata[0]),
                        y : parseFloat(acdata[1]),
                        z : parseFloat(acdata[2])
                    };

                    this.triggerEvent("accelerometerData", [acdata]);
                    break;
                case "view-loaded":

                    this.triggerEvent("viewLoaded");

                    break;
                default:

                    this.triggerEvent("badPacket");

                    break;

            }
        }

    }

    this.onclose = function() {

        this.triggerEvent("connectionClosed");

    }

    this.onerror = function(e) {

        this.triggerEvent("connectionError", e);

    }

    var obj = this;

    this.websocket.onmessage = function(arguments) {
        obj.onmessage.call(obj, arguments);
    };
    this.websocket.onclose = function(arguments) {
        obj.onclose(arguments);
    };
    this.websocket.onerror = function(arguments) {
        obj.onerror(arguments);
    };

}

TitanCastDevice.prototype.send = function(packet) {

    this.websocket.send(packet.serialize());

}

TitanCastDevice.prototype.triggerEvent = function(event, args) {

    if (this.events[event]) {
        this.events[event].apply(this, args);
    }else{
        return false;
    }

}

TitanCastDevice.prototype.on = function(name, fn) {
    this.events[name] = fn;
}

TitanCastDevice.prototype.off = function(name) {
    this.events[name] = function() {};
}

TitanCastDevice.prototype.enableAccelerometer = function() {
    this.send(Packet.create("enable_accelerometer"));
}

TitanCastDevice.prototype.disableAccelerometer = function() {
    this.send(Packet.create("disable_accelerometer"));
}

TitanCastDevice.prototype.setAccelerometerSpeed = function(fx) {
    this.send(Packet.create("set_accelerometer_speed", fx));
}

TitanCastDevice.prototype.setOrientation = function(orientation) {

    this.send(Packet.create("set_orientation", orientation));

}

debugTransfer = function(obj){

    console.log("packets", obj.debuggingStore.packetLength);
    console.log("kB", obj.debuggingStore.byteLength / 1024);
    console.log("");

    obj.debuggingStore.packetLength = 0;
    obj.debuggingStore.byteLength = 0;

}
