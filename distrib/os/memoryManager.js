//This is supposed to like manage the memory I guess
var TSOS;
(function (TSOS) {
    var MemoryManager = (function () {
        function MemoryManager() {
            this.base = 0;
            this.limit = 255;
        }
        MemoryManager.prototype.init = function () { };
        //loading the program into memory
        MemoryManager.prototype.loadProgram = function (opCode) {
            _Memory.clearMemory();
            this.base = 0;
            this.limit = 255;
            for (var i = 0; i < opCode.length; i++) {
                this.updateMemoryLocation(i, opCode[i]);
            }
            return "kfjdksajfkdsa" + _PID;
        };
        //updating the table
        MemoryManager.prototype.updateMemoryLocation = function (memoryLocation, opCode) {
            var hexCode = opCode.toString(16); //setting the hexCode equal to the passed in opCode
            var currentBlock = _Memory.getMemory(); //setting the current block from Memory
            if (hexCode.length < 2) {
                hexCode = "0" + hexCode;
            }
            //var newMemoryLocation = (location + base); //setting the new mem location
            //currentBlock
            var currentTableRow = Math.floor(memoryLocation / 8);
            TSOS.Control.updateMemoryTable(currentTableRow, memoryLocation % 8, hexCode);
        };
        return MemoryManager;
    }());
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
