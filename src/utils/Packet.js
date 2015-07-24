function PacketClass(type, data) {

    this.type = type;
    this.data = data;

}


PacketClass.prototype.serialize = function() {

    var serialized = this.type;

    for (dataKey in this.data) {

        serialized += " " + Base64.encode(this.data[dataKey]);

    }

    return serialized;

}

Packet = {};

Packet.create = function(type, data) {

    if (data) {

        if (data instanceof Array) {

            return new PacketClass(type, data);

        } else {

            return new PacketClass(type, [data]);

        }

    }

    return new PacketClass(type, [""]);

}

Packet.parse = function(data) {

    var chunks = data.split(" ");

    var dataChunks = [],
        iteration = -1;

    var type = new String();

    for (chunkKey in chunks) {

        iteration++;

        var chunk = chunks[chunkKey];

        if (iteration == 0) {
            type = chunk;
            continue;
        }

        try {
            dataChunks[iteration - 1] = Base64.decode(chunk);
        } catch (e) {
            try {
                dataChunks[iteration - 1] = Base64.decode(chunk.substring(0, chunk.length - 1));
            } catch (e) {
                dataChunks[iteration - 1] = "";
            }
        }
        chunk = dataChunks[iteration - 1];

    }

    return Packet.create(type, dataChunks);

}