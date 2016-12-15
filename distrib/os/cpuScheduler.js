///<reference path="../globals.ts" />
///<reference path="../host/control.ts" />
//CPU Scheduling class
//We have 3 instances of the pcb class that contains everything so we can swap back and forth
//Probably not the best way to do this but it works.
var TSOS;
(function (TSOS) {
    var CpuScheduler = (function () {
        function CpuScheduler() {
            this.counter = 0;
        }
        //figures out which scheduling algorithm we are using and calls that function
        CpuScheduler.prototype.scheduler = function () {
            switch (_SchedulingAlgorithm) {
                case "rr":
                    _QuantumCounter++;
                    this.roundRobin();
                    break;
                case "fcfs":
                    this.fcfs();
                    break;
                case "priority":
                    break;
            }
        };
        CpuScheduler.prototype.roundRobin = function () {
            console.log("RR");
            //do the round robin stuff here
            //console.log("Counter: " + counter);
            //if we are doing round robin
            if (_QuantumCounter < _Quantum) {
                //console.log("Counter: " + _ScheduleCounter);
                if (_ScheduleCounter == 0) {
                    _MemoryManager.base = 0;
                    _MemoryManager.limit = 255;
                    _ScheduleCounter = 1;
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
                    if (_MemoryAllocation[1] != "-1") {
                        _MemoryManager.base = 256;
                        _MemoryManager.limit = 511;
                        //_Kernel.krnTrace("Context Switch");
                        _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CONTEXT_SWITCH_IRQ, ""));
                        this.setValues(0);
                    }
                }
                else if (_MemoryManager.base == 256) {
                    if (_MemoryAllocation[2] != "-1") {
                        _MemoryManager.base = 512;
                        _MemoryManager.limit = 768;
                        _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CONTEXT_SWITCH_IRQ, ""));
                        this.setValues(1);
                    }
                    else if (_MemoryAllocation[0] != "-1") {
                        _MemoryManager.base = 0;
                        _MemoryManager.limit = 255;
                        _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CONTEXT_SWITCH_IRQ, ""));
                        this.setValues(7);
                    }
                }
                else if (_MemoryManager.base == 512) {
                    console.log("Counter: " + this.counter);
                    if (this.counter == 1) {
                        console.log("Theres a program on disk!");
                        //need to get that program off of disk and onto memory
                        var program = _FileSystem.findProgram(3);
                        console.log("Op code that we need to load into mem: " + program);
                        this.counter = 0;
                        this.rollIntoMemory(program);
                    }
                    else {
                        //we need to
                        //counter = 0;
                        if (_MemoryAllocation[0] != "-1") {
                            _MemoryManager.base = 0;
                            _MemoryManager.limit = 255;
                            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CONTEXT_SWITCH_IRQ, ""));
                            this.setValues(2);
                        }
                        else if (_MemoryAllocation[1] != "-1") {
                            _MemoryManager.base = 256;
                            _MemoryManager.limit = 511;
                            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CONTEXT_SWITCH_IRQ, ""));
                            this.setValues(4);
                        }
                    }
                }
            }
            //_Kernel.krnInterruptHandler(CONTEXT_SWITCH_IRQ, "fdsafdsa");
        };
        CpuScheduler.prototype.fcfs = function () {
            console.log("FCFS");
        };
        CpuScheduler.prototype.rollIntoMemory = function (opCode) {
            //opCode = opCode.replace(/(.{2})/g, " ");
            var newOpCode = "";
            //adding a space after every two characters
            for (var i = 0; i < opCode.length; i++) {
                if ((i % 2) == 0 && i != 0) {
                    newOpCode += " ";
                }
                newOpCode += opCode.charAt(i);
            }
            //making it nice so it loads into memory properly
            var program = newOpCode.replace(/\n/g, " ").split(" ");
            //console.log("Returned mem: " + _Memory.getMemory());
            //getting the op code from the last segment of memory
            var memory = "";
            for (var i = 0; i < 256; i++) {
                memory += _Memory.getMemoryLocation(i);
            }
            //var oldProgram = mem.substr(512, _Memory.getMemory.length);
            console.log("Program length: " + _ProgramLength[2]);
            console.log("Old program: " + memory.substr(0, (_ProgramLength[2] * 2)));
            _SwappedProgram = memory.substr(0, (_ProgramLength[2] * 2));
            _MemoryManager.setBase(0);
            _MemoryManager.loadProgram(program);
        };
        CpuScheduler.prototype.rollOntoDisk = function (program) {
        };
        // this might change...better way to implement
        CpuScheduler.prototype.setValues = function (num) {
            //save the current CPU values so we can get them later
            //num tells us which block we are saving the values from
            if (num == 0) {
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
            else if (num == 4) {
                _Pcb2.PC = _CPU.PC;
                _Pcb2.Acc = _CPU.Acc;
                _Pcb2.XReg = _CPU.Xreg;
                _Pcb2.YReg = _CPU.Yreg;
                _Pcb2.ZFlag = _CPU.Zflag;
                _Pcb2.instruction = _CPU.instruction;
                _CPU.PC = _Pcb1.PC;
                _CPU.Acc = _Pcb1.Acc;
                _CPU.Xreg = _Pcb1.XReg;
                _CPU.Yreg = _Pcb1.YReg;
                _CPU.Zflag = _Pcb1.ZFlag;
            }
            else if (num == 7) {
                _Pcb1.PC = _CPU.PC;
                _Pcb1.Acc = _CPU.Acc;
                _Pcb1.XReg = _CPU.Xreg;
                _Pcb1.YReg = _CPU.Yreg;
                _Pcb1.ZFlag = _CPU.Zflag;
                _Pcb1.instruction = _CPU.instruction;
                _CPU.PC = _Pcb0.PC;
                _CPU.Acc = _Pcb0.Acc;
                _CPU.Xreg = _Pcb0.XReg;
                _CPU.Yreg = _Pcb0.YReg;
                _CPU.Zflag = _Pcb0.ZFlag;
            }
            else if (num == 8) {
            }
        };
        return CpuScheduler;
    }());
    TSOS.CpuScheduler = CpuScheduler;
})(TSOS || (TSOS = {}));
