///<reference path="../globals.ts"/>
var TSOS;
(function (TSOS) {
    var PCB = (function () {
        function PCB(PC, Acc, XReg, YReg, ZFlag, pid, instruction, base, limit, running, state, location, priority) {
            if (PC === void 0) { PC = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (XReg === void 0) { XReg = 0; }
            if (YReg === void 0) { YReg = 0; }
            if (ZFlag === void 0) { ZFlag = 0; }
            if (pid === void 0) { pid = (_PID + 1); }
            if (instruction === void 0) { instruction = ""; }
            if (base === void 0) { base = (_CurrentMemoryBlock * 256); }
            if (limit === void 0) { limit = ((_CurrentMemoryBlock * 256) + 255); }
            if (running === void 0) { running = false; }
            if (state === void 0) { state = ""; }
            if (location === void 0) { location = null; }
            if (priority === void 0) { priority = null; }
            this.PC = PC;
            this.Acc = Acc;
            this.XReg = XReg;
            this.YReg = YReg;
            this.ZFlag = ZFlag;
            this.pid = pid;
            this.instruction = instruction;
            this.base = base;
            this.limit = limit;
            this.running = running;
            this.state = state;
            this.location = location;
            this.priority = priority;
        }
        return PCB;
    }());
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
