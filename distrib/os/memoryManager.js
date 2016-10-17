///<reference path="../globals.ts" />
//This is supposed to like manage the memory I guess
var TSOS;
(function (TSOS) {
    var MemoryManager = (function () {
        function MemoryManager() {
            this.base = 0;
            this.limit = 255;
        }
        //constructor(){}
        //public init(){}
        //loading the program into memory
        MemoryManager.prototype.loadProgram = function (opCode) {
            _ProgramLength = opCode.length;
            _Memory.clearMemory();
            this.base = 0;
            this.limit = 255;
            //calls updateMemoryLocation to update the physical address
            for (var i = 0; i < opCode.length; i++) {
                this.updateMemoryLocation(i, opCode[i]);
            }
            return "PID: " + _PID;
        };
        //gets the memory at a specified location
        MemoryManager.prototype.getMemoryAtLocation = function (location) {
            return _Memory.getMemoryLocation(location);
        };
        //updating the table
        MemoryManager.prototype.updateMemoryLocation = function (memoryLocation, opCode) {
            var hexCode = opCode.toString(16); //setting the hexCode equal to the passed in opCode
            var currentBlock = _Memory.getMemory(); //setting the current block from Memory
            //console.log("Mem loc: " + memoryLocation);
            //console.log("Op code: " + opCode);
            if (hexCode.length < 2) {
                hexCode = "0" + hexCode;
            }
            currentBlock[memoryLocation] = hexCode;
            var currentTableRow = Math.floor(memoryLocation / 8);
            //_Memory.addToMemory(memoryLocation, opCode);
            TSOS.Control.updateMemoryTable(currentTableRow, memoryLocation % 8, hexCode);
        };
        return MemoryManager;
    }());
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
