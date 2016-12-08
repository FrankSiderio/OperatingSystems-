///<reference path="../globals.ts" />
var TSOS;
(function (TSOS) {
    var fileSystemDeviceDriver = (function () {
        function fileSystemDeviceDriver() {
            this.tracks = 4;
            this.blocks = 8;
            this.sectors = 8;
            this.metaSize = 4;
            this.fileSize = 64;
            this.loc = 100;
        }
        fileSystemDeviceDriver.prototype.init = function () {
            sessionStorage.clear();
            for (var t = 0; t < this.tracks; t++) {
                for (var s = 0; s < this.sectors; s++) {
                    for (var b = 0; b < this.blocks; b++) {
                        var blank = "";
                        for (var i = 0; i < this.fileSize; i++) {
                            if (i >= 0 && i <= 3) {
                                blank += "0";
                            }
                            else {
                                blank += "~";
                            }
                        }
                        sessionStorage.setItem(this.keyGenerator(t, s, b), blank);
                    }
                }
            }
            this.createTable();
        };
        fileSystemDeviceDriver.prototype.createTable = function () {
            var table = " <thead><tr><th> T S B  </th><th> Meta   </th><th> Data  </th></tr>";
            for (var t = 0; t < this.tracks; t++) {
                for (var s = 0; s < this.sectors; s++) {
                    for (var b = 0; b < this.blocks; b++) {
                        var data = sessionStorage.getItem(this.keyGenerator(t, s, b));
                        var meta = (data.substr(0, 4));
                        data = data.substr(4, 60);
                        var key = this.keyGenerator(t, s, b);
                        table += "<tr><td>" + key + "</td><td>" + meta + "</td><td>" + data + "</td></tr>";
                    }
                }
            }
            _HardDriveTable.innerHTML = table;
        };
        fileSystemDeviceDriver.prototype.keyGenerator = function (t, s, b) {
            return (t + "" + s + "" + b);
        };
        fileSystemDeviceDriver.prototype.createFile = function (name) {
            //removing the quotes
            name = name.replace(/"/g, "");
            //get the next available block
            var freeBlock = this.findNextAvailableBlock();
            console.log("Free block: " + freeBlock);
            //var l = this.loc.toString();
            //freeBlock = "100";
            var meta = "1" + freeBlock;
            //var meta = "1" + l;
            //this.loc++;
            var data = meta + name;
            //console.log("Meta: " + meta);
            sessionStorage.setItem(freeBlock, data);
            //console.log("Whats here: " + sessionStorage.getItem(this.keyGenerator(0,0,0)));
            this.createTable();
        };
        fileSystemDeviceDriver.prototype.findNextAvailableBlock = function () {
            var freeKey;
            for (var t = 0; t < this.tracks; t++) {
                for (var s = 0; s < this.sectors; s++) {
                    for (var b = 0; b < this.blocks; b++) {
                        //getting the meta block
                        var key = this.keyGenerator(t, s, b);
                        var value = sessionStorage.getItem(key);
                        var data = value.substr(0, 4);
                        //console.log("Meta block: " + data);
                        if (data.substr(0, 1) == "0") {
                            freeKey = key;
                            t = this.tracks + 1;
                            s = this.sectors + 1;
                            b = this.blocks + 1;
                        }
                    }
                }
            }
            return freeKey;
        };
        return fileSystemDeviceDriver;
    }());
    TSOS.fileSystemDeviceDriver = fileSystemDeviceDriver;
})(TSOS || (TSOS = {}));
