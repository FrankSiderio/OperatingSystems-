//This is supposed to like manage the memory I guess
var TSOS;
(function (TSOS) {
    var memoryManager = (function () {
        function memoryManager() {
        }
        return memoryManager;
    }());
    TSOS.memoryManager = memoryManager;
})(TSOS || (TSOS = {}));
