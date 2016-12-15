///<reference path="../globals.ts" />
///<reference path="control.ts" />
//this class is like something to do with memory
var TSOS;
(function (TSOS) {
    var Memory = (function () {
        function Memory(size) {
            this.totalMemory = 768;
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
            //Control resets table
            TSOS.Control.clearMemoryTable();
            this.memoryArray = null;
            _CPU.init();
            _CurrentMemoryBlock = -1;
            _ResidentList = [];
            _ReadyQueue = [];
            _RunnablePIDs = [];
            this.init(768);
        };
        Memory.prototype.addToMemory = function (location, opCode) {
            this.memoryArray[location] = opCode;
        };
        return Memory;
    }());
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
