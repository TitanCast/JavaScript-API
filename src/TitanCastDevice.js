var TitanCastDevice = function(uri, application, options) {

    this.uri = uri.trim();
    this.application = application;
    this.connectionState = ConnectionStates.NOT_CONNECTED;
    this.deviceDetails = [];

    options = options || {};

    this.port = options.port || 25517;

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

    this.onmessage = function(e) {

        var packet = Packet.parse(e.data);

        if (this.connectionState == ConnectionStates.NOT_CONNECTED) {

            if (packet.getType() == "device_details") {

                this.deviceDetails = packet.getData();

                this.send(Packet.create("request_connect", [

                    this.application.getAppName(),
                    this.application.getAppDesc(),
                    this.application.getIcon()

                ]));

                this.connectionState = ConnectionStates.AWAITING_RESPONSE;

                this.triggerEvent("sentRequest");

            }

        }

        if (this.connectionState == ConnectionStates.AWAITING_RESPONSE) {

            if (packet.getType() == "accept_connect_request") {

                this.send(Packet.create(
                    "cast_view_data",
                    this.application.getAppCastURL()
                ));

                this.connectionState = ConnectionStates.CONNECTED;
                this.triggerEvent("connect accept");

            } else if (packet.getType() == "reject_connect_request") {

                this.connectionState = ConnectionStates.NOT_CONNECTED;
                this.triggerEvent("connect reject");

            }

        }

        if (this.connectionState == ConnectionStates.CONNECTED) {

            switch(packet.getType()){

                case "custom_data":
                    this.triggerEvent("custom data", [packet.getData()]);
                    break;
                case "accelerometer-update":

                    var acdata = packet.getData();
                    acdata = {
                        x : parseFloat(acdata[0].substr(2)),
                        y : parseFloat(acdata[1].substr(2)),
                        z : parseFloat(acdata[2].substr(2))
                    };

                    this.triggerEvent("accelerometer data", [acdata]);
                    break;
                default:
                    console.log("unknown packet", packet);
                    break;

            }
        }

    }

    this.onclose = function() {

        this.triggerEvent("connection closed");

    }

    this.onerror = function(e) {

        this.triggerEvent("connection error", e);

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

TitanCastDevice.prototype.setEvent = function(name, fn) {
    this.events[name] = fn;
}

TitanCastDevice.prototype.removeEvent = function(name) {
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

TitanCastDevice.prototype.setAccelerometerCap = function(cap) {
    this.send(Packet.create("set_accelerometer_cap", cap));
}
