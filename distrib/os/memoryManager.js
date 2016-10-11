//This is supposed to like manage the memory I guess
var TSOS;
(function (TSOS) {
    var MemoryManager = (function () {
        function MemoryManager() {
        }
        //constructor{}
        //loading the program into memory
        MemoryManager.prototype.loadProgram = function (opCode) {
            for (var i = 0; i < opCode.length; i++) {
                this.updateMemoryLocation(i, opCode[i]);
            }
        };
        //updating the table
        MemoryManager.prototype.updateMemoryLocation = function (memoryLocation, opCode) {
            var hexCode = opCode.toString(16);
            TSOS.Control.updateMemoryTable(memoryLocation, memoryLocation % 8, opCode);
        };
        return MemoryManager;
    }());
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
