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
        MemoryManager.prototype.loadProgram = function (currentBlock, opCode) {
            //_Memory.clearMemory();
            //Chooses with memory block to allocate
            if (currentBlock == 0) {
                this.base = 0;
                this.limit = 255;
            }
            else if (currentBlock == 1) {
                this.base = 256;
                this.limit = 511;
            }
            else if (currentBlock == 2) {
                this.base = 512;
                this.limit = 768;
            }
            //calls updateMemoryLocation to update the physical address
            for (var i = 0; i < opCode.length; i++) {
                this.updateMemoryAtLocation(i, opCode[i]);
            }
            return "PID: " + _PID;
        };
        MemoryManager.prototype.setProgramLength = function (loc, code) {
            var length = 0;
            //gets the length of the program
            for (var i = 0; i < code.length; i++) {
                if (code[i] != "00") {
                    length++;
                }
            }
            _ProgramLength[loc] = length;
            //console.log("Program length for location: " + loc + " is: " + _ProgramLength[loc]);
        };
        //gets the memory at a specified location
        MemoryManager.prototype.getMemoryAtLocation = function (location) {
            return _Memory.getMemoryLocation(location);
        };
        MemoryManager.prototype.clearMemorySegment = function (base) {
            var zero = "00";
            //console.log("Base: " + base);
            for (var i = 0; i < 256; i++) {
                _Memory.memoryArray[i + base] = "0";
                TSOS.Control.clearMemoryTableSegment(base / 8);
            }
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
            TSOS.Control.updateMemoryTable(currentTableRow, memoryLocation % 8, hexCode);
            //console.log("Current table row: " + currentTableRow);
            //_Memory.addToMemory(memoryLocation, opCode);
            //console.log("Limit: " + this.limit);
            //console.log("Row: " + currentTableRow);
        };
        //getters and setters
        MemoryManager.prototype.getBase = function () {
            return this.base;
        };
        MemoryManager.prototype.getLimit = function () {
            return this.limit;
        };
        MemoryManager.prototype.setBase = function (base) {
            this.base = base;
        };
        MemoryManager.prototype.setLimit = function (limit) {
            this.limit = limit;
        };
        return MemoryManager;
    }());
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
