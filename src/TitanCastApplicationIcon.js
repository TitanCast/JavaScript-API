function TitanCastApplicationIcon(image) {

    this.image = "";
    
    if (typeof image === "string") {

        this.image = image;
        
    } else if (image instanceof Image) {

        this.image = "#none#";

    }

}