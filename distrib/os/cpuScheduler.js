///<reference path="../globals.ts" />
///<reference path="../host/control.ts" />
//CPU Scheduling class
//We have 3 instances of the pcb class that contains everything so we can swap back and forth
//Probably not the best way to do this but it works.
var TSOS;
(function (TSOS) {
    //var pcb0 = new PCB();
    var pc0;
    var acc0;
    var xreg0;
    var yreg0;
    var zflag0;
    var pc1 = 256;
    var acc1;
    var xreg1;
    var yreg1;
    var zflag1;
    var pc2 = 512;
    var acc2;
    var xreg2;
    var yreg2;
    var zflag2;
    var counter = 0;
    var CpuScheduler = (function () {
        function CpuScheduler() {
        }
        CpuScheduler.prototype.roundRobin = function () {
            //do the round robin stuff here
            //console.log("Counter: " + counter);
            //if we are doing round robin
            if (_QuantumCounter < _Quantum) {
                if (counter == 0) {
                    _MemoryManager.base = 0;
                    _MemoryManager.limit = 255;
                    counter = 1;
                }
                _CPU.isExecuting = true;
            }
            else if (_QuantumCounter == _Quantum) {
                _QuantumCounter = 0;
                //alert("switch");
                //alert("Base: " + _MemoryManager.base);
                //console.log("Memory base: " + _MemoryManager.base);
                //figure out where to switch to
                if (_MemoryManager.base == 0) {
                    _MemoryManager.base = 256;
                    _MemoryManager.limit = 511;
                    this.setValues(0);
                }
                else if (_MemoryManager.base == 256) {
                    _MemoryManager.base = 512;
                    _MemoryManager.limit = 768;
                    this.setValues(1);
                }
                else if (_MemoryManager.base == 512) {
                    _MemoryManager.base = 0;
                    _MemoryManager.limit = 255;
                    this.setValues(2);
                }
                console.log("Base: " + _MemoryManager.base);
                console.log("Limit: " + _MemoryManager.limit);
                /*
                pc = _CPU.PC;
                acc = _CPU.Acc;
                xreg = _CPU.Xreg;
                yreg = _CPU.Yreg;
                zflag = _CPU.Zflag;
        
                _CPU.PC = 256;
                */
                //console.log("Memory base after: " + _MemoryManager.base);
                _Kernel.krnTrace("Context Switch");
            }
            //_Kernel.krnInterruptHandler(CONTEXT_SWITCH_IRQ, "fdsafdsa");
        };
        // this might change...better way to implement
        CpuScheduler.prototype.setValues = function (num) {
            //save the current CPU values so we can get them later
            //num tells us which block we are saving the values from
            if (num == 0) {
                /*
                pc0 = _CPU.PC;
                acc0 = _CPU.Acc;
                xreg0 = _CPU.Xreg;
                yreg0 = _CPU.Yreg;
                zflag0 = _CPU.Zflag;
        
                _CPU.PC = pc1;
                _CPU.Acc = acc1;
                _CPU.Xreg = xreg1;
                _CPU.Yreg = yreg1;
                _CPU.Zflag = zflag1;
                */
                _Pcb0.PC = _CPU.PC;
                _Pcb0.Acc = _CPU.Acc;
                _Pcb0.XReg = _CPU.Xreg;
                _Pcb0.YReg = _CPU.Yreg;
                _Pcb0.ZFlag = _CPU.Zflag;
                _Pcb0.instruction = _CPU.instruction;
                _CPU.PC = _Pcb1.PC;
                _CPU.Acc = _Pcb1.Acc;
                _CPU.Xreg = _Pcb1.XReg;
                _CPU.Yreg = _Pcb1.YReg;
                _CPU.Zflag = _Pcb1.ZFlag;
            }
            else if (num == 1) {
                /*
                pc1 = _CPU.PC;
                acc1 = _CPU.Acc;
                xreg1 = _CPU.Xreg;
                yreg1 = _CPU.Yreg;
                zflag1 = _CPU.Zflag;
        
                _CPU.PC = pc2;
                _CPU.Acc = acc2;
                _CPU.Xreg = xreg2;
                _CPU.Yreg = yreg2;
                _CPU.Zflag = zflag2;
                */
                _Pcb1.PC = _CPU.PC;
                _Pcb1.Acc = _CPU.Acc;
                _Pcb1.XReg = _CPU.Xreg;
                _Pcb1.YReg = _CPU.Yreg;
                _Pcb1.ZFlag = _CPU.Zflag;
                _Pcb1.instruction = _CPU.instruction;
                _CPU.PC = _Pcb2.PC;
                _CPU.Acc = _Pcb2.Acc;
                _CPU.Xreg = _Pcb2.XReg;
                _CPU.Yreg = _Pcb2.YReg;
                _CPU.Zflag = _Pcb2.ZFlag;
            }
            else if (num == 2) {
                /*
                pc2 = _CPU.PC;
                acc2 = _CPU.Acc;
                xreg2 = _CPU.Xreg;
                yreg2 = _CPU.Yreg;
                zflag2 = _CPU.Zflag;
        
                _CPU.PC = pc0;
                _CPU.Acc = acc0;
                _CPU.Xreg = xreg0;
                _CPU.Yreg = yreg0;
                _CPU.Zflag = zflag0;
                */
                _Pcb2.PC = _CPU.PC;
                _Pcb2.Acc = _CPU.Acc;
                _Pcb2.XReg = _CPU.Xreg;
                _Pcb2.YReg = _CPU.Yreg;
                _Pcb2.ZFlag = _CPU.Zflag;
                _Pcb2.instruction = _CPU.instruction;
                _CPU.PC = _Pcb0.PC;
                _CPU.Acc = _Pcb0.Acc;
                _CPU.Xreg = _Pcb0.XReg;
                _CPU.Yreg = _Pcb0.YReg;
                _CPU.Zflag = _Pcb0.ZFlag;
            }
        };
        CpuScheduler.prototype.updateQueue = function () {
        };
        return CpuScheduler;
    }());
    TSOS.CpuScheduler = CpuScheduler;
})(TSOS || (TSOS = {}));
