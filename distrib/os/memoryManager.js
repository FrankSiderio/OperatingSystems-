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
            //gets the length of the program
            for (var i = 0; i < opCode.length; i++) {
                if (opCode[i] != "00") {
                    _ProgramLength++;
                }
            }
            //_Memory.clearMemory();
            if (_MemoryAllocation[0] == "-1") {
                this.base = 0;
                this.limit = 255;
                _MemoryAllocation[0] = _PID.toString();
            }
            else if (_MemoryAllocation[1] == "-1") {
                this.base = 256;
                this.limit = 511;
                _MemoryAllocation[1] = _PID.toString();
            }
            else if (_MemoryAllocation[2] == "-1") {
                this.base = 512;
                this.limit = 768;
                _MemoryAllocation[2] = _PID.toString();
            }
            //console.log("base: " + this.base);
            //console.log("limit: " + this.limit);
            //calls updateMemoryLocation to update the physical address
            for (var i = 0; i < opCode.length; i++) {
                this.updateMemoryAtLocation(i, opCode[i]);
            }
            return "PID: " + _PID;
        };
        //gets the memory at a specified location
        MemoryManager.prototype.getMemoryAtLocation = function (location) {
            return _Memory.getMemoryLocation(location);
        };
        //updates the table, given a specific location and opCode
        MemoryManager.prototype.updateMemoryAtLocation = function (memoryLocation, opCode) {
            var startingRow = 0;
            if (this.base == 0) {
                startingRow = 0;
            }
            else if (this.base == 256) {
                startingRow = 32;
            }
            else if (this.base == 512) {
                startingRow = 64;
            }
            var hexCode = opCode.toString(16); //setting the hexCode equal to the passed in opCode
            var currentBlock = _Memory.getMemory(); //setting the current block from Memory
            //console.log("Mem loc: " + memoryLocation);
            //console.log("Op code: " + opCode);
            //console.log("Starting row: " + startingRow);
            if (hexCode.length < 2) {
                hexCode = "0" + hexCode;
            }
            var newMemLocation = (memoryLocation + this.base);
            currentBlock[newMemLocation] = hexCode;
            var currentTableRow = ((Math.floor(memoryLocation / 8)) + startingRow);
            //console.log("Current table row: " + currentTableRow);
            //_Memory.addToMemory(memoryLocation, opCode);
            TSOS.Control.updateMemoryTable(currentTableRow, memoryLocation % 8, hexCode);
            //console.log(_Memory.getMemory());
        };
        return MemoryManager;
    }());
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
