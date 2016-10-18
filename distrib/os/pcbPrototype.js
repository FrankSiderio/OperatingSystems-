///<reference path="../globals.ts"/>
var TSOS;
(function (TSOS) {
    var PCB = (function () {
        function PCB(PC, Acc, XReg, YReg, ZFlag, pid, instructionRegister, base, max, location) {
            if (PC === void 0) { PC = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (XReg === void 0) { XReg = 0; }
            if (YReg === void 0) { YReg = 0; }
            if (ZFlag === void 0) { ZFlag = 0; }
            if (pid === void 0) { pid = ++_PID; }
            if (instructionRegister === void 0) { instructionRegister = ""; }
            if (base === void 0) { base = 0; }
            if (max === void 0) { max = 0; }
            if (location === void 0) { location = null; }
            this.PC = PC;
            this.Acc = Acc;
            this.XReg = XReg;
            this.YReg = YReg;
            this.ZFlag = ZFlag;
            this.pid = pid;
            this.instructionRegister = instructionRegister;
            this.base = base;
            this.max = max;
            this.location = location;
        }
        return PCB;
    }());
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
