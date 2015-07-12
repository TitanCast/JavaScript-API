var ConnectionStates = {
    NOT_CONNECTED: "not connected",
    CONNECTED: "connected",
    AWAITING_RESPONSE: "awaiting response"
};

var TitanCastDevice = function(uri, application, options) {

    this.uri = uri;
    this.application = application;
    this.connectionState = ConnectionStates.NOT_CONNECTED;
    this.deviceDetails = [];

    options = options || {};

    this.port = options.port || 25517;

    this.events = [];

    //websocket stuffs
    this.websocket = new WebSocket("ws://" + uri + ":" + this.port);

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
                this.triggerEvent("acceptConnect");

            } else if (packet.getType() == "reject_connect_request") {

                this.connectionState = ConnectionStates.NOT_CONNECTED;
                this.triggerEvent("rejectConnect");

            }

        }

        if (this.connectionState == ConnectionStates.CONNECTED) {

            if (packet.getType() == "custom_data") {
                this.triggerEvent("customData", packet.getData());
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

TitanCastDevice.prototype.triggerEvent = function(event) {

    if (this.events[event]) {
        this.events[event](([].slice.apply(arguments)).slice(1));
    }

}

TitanCastDevice.prototype.setEvent = function(name, fn) {
    this.events[name] = fn;
}

TitanCastDevice.prototype.removeEvent = function(name) {
    this.events[name] = function() {};
}

TitanCastDevice.prototype.enableAccelerometer = function() {
    this.send(Packet.create("enable-accelerometer"));
}

TitanCastDevice.prototype.enableAccelerometer = function() {
    this.send(Packet.create("disable-accelerometer"));
}

TitanCastDevice.prototype.setAccelerometerFrequency = function(fx){
    this.send( Packet.create("set_accelerometer_speed", fx) );
}

TitanCastDevice.prototype.setAccelerometerCap = function(cap){
    this.send( Packet.create("set_accelerometer_cap", cap) );
}