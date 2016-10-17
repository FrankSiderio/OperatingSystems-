//this class is like something to do with memory
var TSOS;
(function (TSOS) {
    var Memory = (function () {
        function Memory(size) {
            this.totalMemory = 256;
            this.totalMemory = size;
            this.init(this.totalMemory);
        }
        //initializes memory
        Memory.prototype.init = function (memorySize) {
            this.memoryArray = [memorySize];
            var z = "00";
            for (var x = 0; x < memorySize; x++) {
                this.memoryArray[x] = z;
            }
        };
        //returns memory
        Memory.prototype.getMemory = function () {
            return this.memoryArray;
        };
        //returns memory location
        Memory.prototype.getMemoryLocation = function (memoryLocation) {
            return this.memoryArray[memoryLocation];
        };
        //clears and resets memory
        Memory.prototype.clearMemory = function () {
            //Control
            this.init(256);
            this.memoryArray = null;
        };
        return Memory;
    }());
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
