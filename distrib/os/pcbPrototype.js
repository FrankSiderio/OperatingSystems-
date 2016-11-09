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
        PCB.prototype.updateDisplay = function () {
            var runningDisplay = ["waiting", "waiting", "waiting"];
            var b = _MemoryManager.getBase();
            var l = _MemoryManager.getLimit();
            document.getElementById("pcbPID0").innerHTML = _MemoryAllocation[0].toString();
            document.getElementById("ir0").innerHTML = _Pcb0.instruction;
            document.getElementById("pcbPC0").innerHTML = _Pcb0.PC.toString();
            document.getElementById("pcbAcc0").innerHTML = _Pcb0.Acc.toString();
            document.getElementById("pcbX0").innerHTML = _Pcb0.XReg.toString();
            document.getElementById("pcbY0").innerHTML = _Pcb0.YReg.toString();
            document.getElementById("pcbZ0").innerHTML = _Pcb0.ZFlag.toString();
            if (b == 0) {
                runningDisplay[0] = "running";
            }
            else {
                if (_MemoryAllocation[0] != "-1") {
                    _WaitTime[0]++;
                }
            }
            document.getElementById("state0").innerHTML = runningDisplay[0];
            document.getElementById("pcbPID1").innerHTML = _MemoryAllocation[1].toString();
            document.getElementById("ir1").innerHTML = _Pcb1.instruction;
            document.getElementById("pcbPC1").innerHTML = _Pcb1.PC.toString();
            document.getElementById("pcbAcc1").innerHTML = _Pcb1.Acc.toString();
            document.getElementById("pcbX1").innerHTML = _Pcb1.XReg.toString();
            document.getElementById("pcbY1").innerHTML = _Pcb1.YReg.toString();
            document.getElementById("pcbZ1").innerHTML = _Pcb1.ZFlag.toString();
            if (b == 256) {
                runningDisplay[1] = "running";
            }
            else {
                if (_MemoryAllocation[0] != "-1") {
                    _WaitTime[1]++;
                }
            }
            document.getElementById("state1").innerHTML = runningDisplay[1];
            document.getElementById("pcbPID2").innerHTML = _MemoryAllocation[2].toString();
            document.getElementById("ir2").innerHTML = _Pcb2.instruction;
            document.getElementById("pcbPC2").innerHTML = _Pcb2.PC.toString();
            document.getElementById("pcbAcc2").innerHTML = _Pcb2.Acc.toString();
            document.getElementById("pcbX2").innerHTML = _Pcb2.XReg.toString();
            document.getElementById("pcbY2").innerHTML = _Pcb2.YReg.toString();
            document.getElementById("pcbZ2").innerHTML = _Pcb2.ZFlag.toString();
            if (b == 512) {
                runningDisplay[2] = "running";
            }
            else {
                if (_MemoryAllocation[0] != "-1") {
                    _WaitTime[2]++;
                }
            }
            document.getElementById("state2").innerHTML = runningDisplay[2];
        };
        return PCB;
    }());
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
