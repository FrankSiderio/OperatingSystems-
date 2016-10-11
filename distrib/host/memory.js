//this class is like something to do with memory
var TSOS;
(function (TSOS) {
    var memory = (function () {
        function memory(size) {
            this.totalMemory = 256;
            this.totalMemory = size;
            var zero = "00";
            for (var x = 0; x < size; x++) {
                this.memoryArray[x] = zero;
            }
        }
        memory.prototype.getMemoryLocation = function (memoryLocation) {
            return this.memoryArray[memoryLocation];
        };
        return memory;
    }());
    TSOS.memory = memory;
})(TSOS || (TSOS = {}));
