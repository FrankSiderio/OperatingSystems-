///<reference path="../globals.ts" />
/* ------------
     CPU.ts

     Requires global.ts.

     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */
var TSOS;
(function (TSOS) {
    //for updating memory table
    var row = 0;
    var counter = 0;
    var Cpu = (function () {
        function Cpu(PC, Acc, Xreg, Yreg, Zflag, isExecuting, instruction) {
            if (PC === void 0) { PC = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (isExecuting === void 0) { isExecuting = false; }
            if (instruction === void 0) { instruction = ""; }
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
            this.instruction = instruction;
        }
        Cpu.prototype.init = function () {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
            //this.drawMemory();
        };
        Cpu.prototype.cycle = function () {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            this.turnAroundTime();
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            //console.log("code being loaded: " + _MemoryManager.getMemoryAtLocation(this.PC));
            //console.log("PC: " + this.PC);
            //console.log("Memory at location" + _MemoryManager.getMemoryAtLocation(this.PC));
            //console.log("PC: " + this.PC);
            if (this.isExecuting == true) {
                this.runOpCode(_MemoryManager.getMemoryAtLocation(this.PC));
                TSOS.Control.updateReadyQueue();
                this.updateCPUDisplay();
            }
            /*
            if(_RunAll == true)
            {
              _CpuScheduler.scheduler();
              //_CpuScheduler.roundRobin();
            }
            */
            //console.log("Mem at this loc: " + _MemoryManager.getMemoryAtLocation(this.PC));
            //console.log("PC: " + this.PC);
            //console.log(_Memory.getMemory());
            //this.updateCPUDisplay();
            //this.updatePCB();
            //this.updateCPU();
            //_Pcb0.updateDisplay();
            //_Memory.clearMemory();
            if (_SingleStep == true) {
                this.isExecuting = false;
            }
            //console.log("PC: " + this.PC);
            //console.log("Program Length " + _ProgramLength);
        };
        Cpu.prototype.turnAroundTime = function () {
            //calculating turn around time...lets find which program is running
            if (_MemoryManager.getBase() == 0) {
                if (_MemoryAllocation[0] != "-1") {
                    _TurnAroundTime[0]++;
                }
            }
            else if (_MemoryManager.getBase() == 256) {
                if (_MemoryAllocation[1] != "-1") {
                    _TurnAroundTime[1]++;
                }
            }
            else if (_MemoryManager.getBase() == 512) {
                if (_MemoryAllocation[2] != "-1") {
                    _TurnAroundTime[2]++;
                }
            }
        };
        //this function runs the op codes by using a switch statement
        //the switch statement calls different functions depending on which opCode is executed in memory
        Cpu.prototype.runOpCode = function (code) {
            this.instruction = code.toUpperCase();
            //console.log("Instruction: " + this.instruction);
            //console.log("PC: " + this.PC);
            //console.log("Counter: " + counter);
            //don't really need the counter in there. I'll take it out later
            //console.log("Instruction: " + this.instruction);
            //console.log("PC: " + this.PC);
            switch (this.instruction) {
                case "A9":
                    //load the accumulator with a constant
                    this.loadAccWithConstant();
                    counter++;
                    break;
                case "AD":
                    //load the accumulator from memory
                    this.loadAccFromMemory();
                    counter++;
                    break;
                case "8D":
                    //store the accumulator in memory
                    this.storeAccInMemory();
                    counter++;
                    break;
                case "6D":
                    //add with carry
                    this.addWithCarry();
                    counter++;
                    break;
                case "A2":
                    //Load the X register with a constant
                    this.loadXregisterWithConstant();
                    counter++;
                    break;
                case "AE":
                    //Load the X register from memory
                    this.loadXregisterFromMemory();
                    counter++;
                    break;
                case "A0":
                    //Load the Y register with a constant
                    this.loadYregisterWithConstant();
                    counter++;
                    break;
                case "AC":
                    //Load the Y register from memory
                    this.loadYregisterFromMemory();
                    counter++;
                    break;
                case "EA":
                    //No operation
                    //doing nothing (this is how you do it)
                    counter++;
                    break;
                case "00":
                    //Break (which is really a system call)
                    this.break();
                    counter++;
                    break;
                case "EC":
                    //Compare a byte in memory to the X reg. Sets the Z (zero) flag if equal
                    this.compareToXregister();
                    counter++;
                    break;
                case "D0":
                    //Branch n bytes if Z flag = 0
                    this.branchNbytes();
                    counter++;
                    break;
                case "EE":
                    //Increment the value of a byte
                    this.incrementValueOfByte();
                    counter++;
                    //this.PC++;
                    break;
                case "FF":
                    //System call
                    this.systemCall();
                    counter++;
                    break;
            }
            this.PC++;
            _CurrentPCB.PC = this.PC;
            _CurrentPCB.Acc = this.Acc;
            _CurrentPCB.XReg = this.Xreg;
            _CurrentPCB.YReg = this.Yreg;
            _CurrentPCB.ZFlag = this.Zflag;
            //}
            //his.isExecuting = false;
        };
        //loads the Accumulator with a constant
        Cpu.prototype.loadAccWithConstant = function () {
            this.Acc = this.getNextByte(); //get the next byte and convert it to hex, set it equal to the Acc
            this.PC++; //update PC
        };
        //loads the Accumulator from memory
        Cpu.prototype.loadAccFromMemory = function () {
            var nxtTwoBytes = this.getNextTwoBytes();
            if (_CurrentPCB.base > 0) {
                nxtTwoBytes += _CurrentPCB.base;
            }
            var decimal = this.conversionToDecimal(_MemoryManager.getMemoryAtLocation(nxtTwoBytes));
            this.Acc = decimal;
            this.PC += 2;
        };
        //Stores the Accumulator in memory
        Cpu.prototype.storeAccInMemory = function () {
            var nextTwoBytes = this.getNextTwoBytes();
            var hexNum = this.Acc;
            _MemoryManager.base = _CurrentPCB.base;
            _MemoryManager.updateMemoryAtLocation(nextTwoBytes, hexNum); //updates memory
            this.PC += 2;
        };
        //adds with a carry
        Cpu.prototype.addWithCarry = function () {
            var memoryLocation = this.getNextTwoBytes();
            if (_CurrentPCB.base > 0) {
                memoryLocation += _CurrentPCB.base;
            }
            this.Acc += this.conversionToDecimal(_MemoryManager.getMemoryAtLocation(memoryLocation));
            this.PC += 2;
        };
        //loads the x register with a constant
        Cpu.prototype.loadXregisterWithConstant = function () {
            this.Xreg = this.getNextByte();
            this.PC++; //update pc
        };
        //loads the x register from memory
        Cpu.prototype.loadXregisterFromMemory = function () {
            var memoryLocation = this.conversionToDecimal(_MemoryManager.getMemoryAtLocation(this.PC + 1));
            if (_CurrentPCB.base > 0) {
                memoryLocation += _CurrentPCB.base;
            }
            this.Xreg = this.conversionToDecimal(_MemoryManager.getMemoryAtLocation(memoryLocation));
            this.PC += 2; //update pc
        };
        //loads the y register with a constant
        Cpu.prototype.loadYregisterWithConstant = function () {
            this.Yreg = this.getNextByte();
            this.PC++; //update pc
        };
        Cpu.prototype.loadYregisterFromMemory = function () {
            var memoryLocation = this.conversionToDecimal(_MemoryManager.getMemoryAtLocation(this.PC + 1));
            if (_CurrentPCB.base > 0) {
                memoryLocation += _CurrentPCB.base;
            }
            this.Yreg = this.conversionToDecimal(_MemoryManager.getMemoryAtLocation(memoryLocation));
            this.PC += 2; //update pc
        };
        Cpu.prototype.compareToXregister = function () {
            var memoryLocation = this.getNextByte(); //getting the location of the byte to get
            if (_CurrentPCB.base > 0) {
                memoryLocation += _CurrentPCB.base;
            }
            var hexNum = this.conversionToDecimal(_MemoryManager.getMemoryAtLocation(memoryLocation));
            if (hexNum == this.Xreg) {
                this.Zflag = 1;
            }
            else {
                this.Zflag = 0;
            }
            this.PC += 2;
        };
        Cpu.prototype.branchNbytes = function () {
            if (this.Zflag == 0) {
                var value = this.getNextByte();
                this.PC += value;
                this.PC++;
                var combined = (_ProgramSize + _CurrentPCB.base);
                if (this.PC >= combined) {
                    this.PC = this.PC - _ProgramSize;
                }
            }
            else {
                this.PC++;
            }
        };
        Cpu.prototype.incrementValueOfByte = function () {
            var memoryLocation = this.conversionToDecimal(_MemoryManager.getMemoryAtLocation(this.PC + 1));
            if (_CurrentPCB.base > 0) {
                memoryLocation += _CurrentPCB.base;
            }
            var hexAtLocation = _MemoryManager.getMemoryAtLocation(memoryLocation);
            var decimalNum = this.conversionToDecimal(hexAtLocation);
            decimalNum++;
            _MemoryManager.base = _CurrentPCB.base;
            _MemoryManager.updateMemoryAtLocation(memoryLocation, decimalNum);
            this.PC += 2;
        };
        //gets the next byte location in memory
        Cpu.prototype.getNextByte = function () {
            var nextByte = _MemoryManager.getMemoryAtLocation(this.PC + 1);
            return this.conversionToDecimal(nextByte);
        };
        //gets the next two byte location from memory
        Cpu.prototype.getNextTwoBytes = function () {
            var next = _MemoryManager.getMemoryAtLocation(this.PC + 1); //get the next byte and convert it to hex
            var next2 = _MemoryManager.getMemoryAtLocation(this.PC + 2); //get the next next byte and convert it to hex
            var combine = (next2 + next); //once we've got them lets combine them and return
            return this.conversionToDecimal(combine);
        };
        Cpu.prototype.conversionToDecimal = function (value) {
            //value = value.toString(16);
            var decValue = parseInt(value, 16);
            //alert(hexValue);
            return decValue;
        };
        //handles the sytem call
        Cpu.prototype.systemCall = function () {
            //console.log("Base: " + _MemoryManager.base);
            if (this.Xreg == 1) {
                //console.log("Y reg: " + this.conversionToDecimal(this.Yreg).toString());
                _StdOut.putText(this.Yreg.toString());
            }
            else if (this.Xreg == 2) {
                var characterString = "";
                var char = "";
                var location = this.Yreg;
                if (_CurrentPCB.base > 0) {
                    location += _CurrentPCB.base;
                }
                var character = _MemoryManager.getMemoryAtLocation(location);
                var characterCode = 0;
                while (character != "00") {
                    //console.log("Character: " + character);
                    var decimalNum = this.conversionToDecimal(character);
                    //console.log("character: " + character);
                    char = String.fromCharCode(decimalNum);
                    //console.log(char);
                    characterString += char;
                    this.Yreg++;
                    var location2 = this.Yreg;
                    if (_CurrentPCB.base > 0) {
                        location2 += _CurrentPCB.base;
                    }
                    character = _MemoryManager.getMemoryAtLocation(location2);
                }
                _StdOut.putText(characterString);
            }
        };
        Cpu.prototype.break = function () {
            if (_ReadyQueue.length > 1) {
                for (var i = 0; i < _ReadyQueue.length; i++) {
                    //Maybe use this to prevent zombie processes
                    if (_ReadyQueue[i].location == "Disk") {
                    }
                }
                _ReadyQueue[0].state = "Terminated";
                _CpuScheduler.roundRobin();
            }
            else {
                //if we used fcfs algorithm
                if (_FCFS == true) {
                    _SchedulingAlgorithm = "fcfs";
                    _FCFS = false;
                }
                //if we used priority algorithm
                if (_PriorityAlg == true) {
                    _SchedulingAlgorithm = "priority";
                    _PriorityAlg = false;
                }
                this.isExecuting = false;
                _StdOut.advanceLine();
                _StdOut.putText(">");
            }
        };
        /*
        public displayStats(loc)
        {
          //console.log("Turn around: " + _TurnAroundTime[loc]);
          //console.log("Wait Time: " + _WaitTime[loc]);
          //display the running and wait time..if there is one
          if(_TurnAroundTime[loc] > 0)
          {
            //temp fix for kill command bug that makes mem log -1
            if(_MemoryAllocation[loc] == "-1")
            {
              _StdOut.putText("Turn around time is not available");
            }
            else
            {
              _StdOut.putText("Turn around time of process: " + _MemoryAllocation[loc] + " is: " + _TurnAroundTime[loc]);
              _StdOut.advanceLine();
              _TurnAroundTime[loc] = 0;
            }
          }
  
          if(_WaitTime[loc] > 0)
          {
            //temp fix for kill command bug that makes mem log -1
            if(_MemoryAllocation[loc] == "-1")
            {
              _StdOut.putText("Wait time is not available");
            }
            else
            {
              _StdOut.putText("Wait time of process: " + _MemoryAllocation[loc] + " is: " + _WaitTime[loc]);
              _StdOut.advanceLine();
              _WaitTime[loc] = 0;
            }
          }
        }
        */
        Cpu.prototype.updateCPUDisplay = function () {
            document.getElementById("cpuPC").innerHTML = this.PC.toString();
            document.getElementById("cpuACC").innerHTML = this.Acc.toString();
            document.getElementById("cpuXReg").innerHTML = this.Xreg.toString();
            document.getElementById("cpuYReg").innerHTML = this.Yreg.toString();
            document.getElementById("cpuZFlag").innerHTML = this.Zflag.toString();
        };
        return Cpu;
    }());
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
