///<reference path="../globals.ts"/>
var TSOS;
(function (TSOS) {
    var PCB = (function () {
        function PCB(PC, Acc, XReg, YReg, ZFlag, 
            //public pid:number = ++ _PID,
            instruction, base, max, running, location) {
            if (PC === void 0) { PC = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (XReg === void 0) { XReg = 0; }
            if (YReg === void 0) { YReg = 0; }
            if (ZFlag === void 0) { ZFlag = 0; }
            if (instruction === void 0) { instruction = ""; }
            if (base === void 0) { base = 0; }
            if (max === void 0) { max = 0; }
            if (running === void 0) { running = false; }
            if (location === void 0) { location = null; }
            this.PC = PC;
            this.Acc = Acc;
            this.XReg = XReg;
            this.YReg = YReg;
            this.ZFlag = ZFlag;
            this.instruction = instruction;
            this.base = base;
            this.max = max;
            this.running = running;
            this.location = location;
        }
        return PCB;
    }());
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
