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
                            if (t == 0 && s == 0 && b == 0 && i == 4) {
                                blank += "MBR";
                            }
                            blank += "~";
                        }
                        sessionStorage.setItem(this.keyGenerator(t, s, b), blank);
                    }
                }
            }
            this.displayMessage(1, "Format");
            this.createTable();
        };
        //this also updates the table
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
            if (_Format == false) {
                if (_SarcasticMode == true) {
                    _StdOut.putText("You bitch. You know it's not formatted you smart ass.");
                }
                else {
                    this.displayMessage(3, "");
                }
            }
            else {
                //setting name to it's hex value
                var hexName = this.stringToHex(name);
                //get the next available block
                var freeBlock = this.findNextAvailableBlock();
                var freeDirtyBlock = this.findNextDirtyBlock();
                //console.log("Free dirty block: " + freeDirtyBlock);
                //setting the meta and data to put into the table
                var meta = "1" + freeDirtyBlock;
                var data = meta + hexName;
                for (var i = data.length; i < this.fileSize; i++) {
                    data += "~";
                }
                sessionStorage.setItem(freeBlock, data);
                //add to the list of files
                _ListOfFiles.push(name);
                this.createTable();
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CREATE_FILE_IRQ, ""));
                this.displayMessage(1, "Creating file: " + name);
            }
        };
        fileSystemDeviceDriver.prototype.writeFile = function (file, write) {
            if (_Format == false) {
                if (_SarcasticMode == true) {
                    _StdOut.putText("Are you trying to be sarcastic? It's not funny...");
                }
                else {
                    this.displayMessage(3, "");
                }
            }
            else {
                var hexFileName = this.stringToHex(file);
                for (var i = hexFileName.length; i < (this.fileSize - 4); i++) {
                    hexFileName += "~";
                }
                console.log("File: " + file);
                console.log("Writing: " + write);
                _StdOut.putText("Writing to file...");
                //find which file to write to using a linear search
                for (var t = 0; t < this.tracks; t++) {
                    for (var s = 0; s < this.sectors; s++) {
                        for (var b = 0; b < this.blocks; b++) {
                            //getting the meta block
                            var key = this.keyGenerator(t, s, b);
                            var value = sessionStorage.getItem(key);
                            var data = value.substr(4, 64);
                            var meta = value.substr(1, 3);
                            //found the file
                            if (hexFileName == data) {
                                if (write.length <= 60) {
                                    //now lets write
                                    write = this.stringToHex(write);
                                    write = key + write;
                                    write = "1" + write; //setting the in-use bit so we know it's in use
                                    sessionStorage.setItem(meta, write);
                                }
                                else {
                                    while (write.length > 0) {
                                        console.log("Key: " + key);
                                        var freeBlock;
                                        if (write.length <= 60) {
                                            freeBlock = this.findNextDirtyBlock();
                                            write = "1" + key + write;
                                            for (var x = write.length; x < this.fileSize; x++) {
                                                write += "~";
                                            }
                                            sessionStorage.setItem(freeBlock, write);
                                            write = "";
                                        }
                                        else {
                                            var firstFreeBlock = this.findNextDirtyBlock();
                                            var string = "1~~~";
                                            sessionStorage.setItem(firstFreeBlock, string);
                                            freeBlock = this.findNextAvailableBlock();
                                            var subString = write.substr(0, 60);
                                            var newData = "1" + key + subString;
                                            sessionStorage.setItem(firstFreeBlock, newData);
                                            write = write.substr(60, (write.length));
                                        }
                                    }
                                }
                                this.createTable();
                                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(WRITE_FILE_IRQ, ""));
                                //break
                                t = this.tracks + 1;
                                s = this.sectors + 1;
                                b = this.blocks + 1;
                            }
                        }
                    }
                }
                this.displayMessage(1, "Writing to file");
            }
        };
        fileSystemDeviceDriver.prototype.readFile = function (fileName) {
            fileName = this.stringToHex(fileName);
            for (var t = 0; t < this.tracks; t++) {
                for (var s = 0; s < this.sectors; s++) {
                    for (var b = 0; b < this.blocks; b++) {
                        var key = this.keyGenerator(t, s, b);
                        var value = sessionStorage.getItem(key);
                        var data = value.substr(4, fileName.length);
                        if (data == fileName) {
                            console.log("Found the file!");
                            var meta = value.substr(1, 3);
                            var fileContent = sessionStorage.getItem(meta);
                            fileContent = fileContent.substr(4, fileContent.length); //taking out the meta portion
                            console.log("File content: " + fileContent);
                            fileContent = this.hexToString(fileContent);
                            _StdOut.putText(fileContent);
                            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(READ_FILE_IRQ, ""));
                        }
                    }
                }
            }
        };
        fileSystemDeviceDriver.prototype.deleteFile = function (fileName) {
            if (_Format == false) {
                if (_SarcasticMode == true) {
                    _StdOut.putText("Dumb ass. Format the disk first");
                }
                else {
                    this.displayMessage(3, "");
                }
            }
            else {
                console.log("Deleting file: " + fileName);
                var hexFileName = this.stringToHex(fileName);
                for (var t = 0; t < this.tracks; t++) {
                    for (var s = 0; s < this.sectors; s++) {
                        for (var b = 0; b < this.blocks; b++) {
                            var key = this.keyGenerator(t, s, b);
                            var value = sessionStorage.getItem(key);
                            var data = value.substr(4, (fileName.length * 2));
                            console.log("Data: " + data);
                            if (hexFileName == data) {
                                console.log("Found file to delete");
                                var meta = value.substr(1, 3);
                                var newData = "";
                                //clearing the block
                                for (var i = 0; i < 64; i++) {
                                    newData += "~";
                                }
                                //we want to clear the file name and its contents
                                sessionStorage.setItem(key, newData);
                                sessionStorage.setItem(meta, newData);
                                this.createTable();
                                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(DELETE_FILE_IRQ, ""));
                                this.deleteFromList(fileName);
                                this.displayMessage(1, "Delete");
                            }
                        }
                    }
                }
            }
        };
        //deletes it from the array list
        fileSystemDeviceDriver.prototype.deleteFromList = function (fileName) {
            for (var i = 0; i < _ListOfFiles.length; i++) {
                if (_ListOfFiles[i] == fileName) {
                    _ListOfFiles.splice(i, 1);
                }
            }
        };
        //finds the next abailable block on the disk
        fileSystemDeviceDriver.prototype.findNextAvailableBlock = function () {
            var freeKey;
            for (var t = 0; t < this.tracks; t++) {
                for (var s = 0; s < this.sectors; s++) {
                    for (var b = 0; b < this.blocks; b++) {
                        //getting the meta block
                        var key = this.keyGenerator(t, s, b);
                        var value = sessionStorage.getItem(key);
                        var data = value.substr(4, 1);
                        if (data == "~") {
                            freeKey = key;
                            //breaking out of the loop
                            t = this.tracks + 1;
                            s = this.sectors + 1;
                            b = this.blocks + 1;
                        }
                    }
                }
            }
            return freeKey;
        };
        //This is for finding the next block to write to...so it should start from 100 and the next one would be 101
        fileSystemDeviceDriver.prototype.findNextDirtyBlock = function () {
            var freeDirtyKey;
            for (var t = 1; t < this.tracks; t++) {
                for (var s = 0; s < this.sectors; s++) {
                    for (var b = 0; b < this.blocks; b++) {
                        //getting the meta block
                        var key = this.keyGenerator(t, s, b);
                        var value = sessionStorage.getItem(key);
                        var data = value.substr(4, 1);
                        if (data == "~") {
                            sessionStorage.setItem(key, "0000");
                            freeDirtyKey = key;
                            //breaking out of the loop
                            t = this.tracks + 1;
                            s = this.sectors + 1;
                            b = this.blocks + 1;
                        }
                    }
                }
            }
            return freeDirtyKey;
        };
        //converts a string into a hex value
        fileSystemDeviceDriver.prototype.stringToHex = function (s) {
            var hexString = "";
            for (var i = 0; i < s.length; i++) {
                hexString += s.charCodeAt(i).toString(16);
            }
            return hexString;
        };
        //converts a hex value into a string
        fileSystemDeviceDriver.prototype.hexToString = function (hex) {
            var s = '';
            for (var i = 0; i < hex.length; i += 2) {
                var v = parseInt(hex.substr(i, 2), 16);
                if (v)
                    s += String.fromCharCode(v);
            }
            return s;
        };
        //for display success/error messages
        fileSystemDeviceDriver.prototype.displayMessage = function (code, type) {
            //1 = successful
            //2 = failure
            //3 = failure because not formatted
            switch (code) {
                case 1:
                    _StdOut.putText(type + " successful!");
                    break;
                case 2:
                    _StdOut.putText(type + " failure...");
                    break;
                case 3:
                    _StdOut.putText("Please format the disk first");
                    break;
                default:
                    break;
            }
        };
        return fileSystemDeviceDriver;
    }());
    TSOS.fileSystemDeviceDriver = fileSystemDeviceDriver;
})(TSOS || (TSOS = {}));
