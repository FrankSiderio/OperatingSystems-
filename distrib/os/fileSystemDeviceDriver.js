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
        }
        fileSystemDeviceDriver.prototype.init = function () {
            sessionStorage.clear();
            for (var t = 0; t < this.tracks; t++) {
                for (var s = 0; s < this.sectors; s++) {
                    for (var b = 0; b < this.blocks; b++) {
                        var blank = "";
                        for (var i = 0; i < this.fileSize; i++) {
                            blank += "~";
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
        fileSystemDeviceDriver.prototype.createFile = function () {
        };
        return fileSystemDeviceDriver;
    }());
    TSOS.fileSystemDeviceDriver = fileSystemDeviceDriver;
})(TSOS || (TSOS = {}));
