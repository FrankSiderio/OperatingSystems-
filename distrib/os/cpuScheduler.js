///<reference path="../globals.ts" />
///<reference path="../host/control.ts" />
//CPU Scheduling class
var TSOS;
(function (TSOS) {
    var CpuScheduler = (function () {
        function CpuScheduler() {
        }
        CpuScheduler.prototype.roundRobin = function () {
            //do the round robin stuff here
        };
        return CpuScheduler;
    }());
    TSOS.CpuScheduler = CpuScheduler;
})(TSOS || (TSOS = {}));
