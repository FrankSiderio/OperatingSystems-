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
    var x = 0;
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
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            //console.log("code being loaded: " + _MemoryManager.getMemoryAtLocation(this.PC));
            //console.log("PC: " + this.PC);
            this.runOpCode(_MemoryManager.getMemoryAtLocation(this.PC));
            this.updateCPU();
            this.updateCPU();
            //_Memory.clearMemory();
            if (_SingleStep == true) {
                this.isExecuting = false;
            }
        };
        //load op codes
        Cpu.prototype.loadOpCode = function (opCode) {
            var i = 0;
            while (i != opCode.length) {
                this.updateMemoryTable(opCode[i]);
                /*
    
              */
                i++;
            }
        };
        //updates the memory table with the opCodes
        Cpu.prototype.updateMemoryTable = function (opCode) {
            //go to the next row
            if (x == 8) {
                row++;
                x = 0;
            }
            _MemoryTable.rows[row].cells[x + 1].innerHTML = opCode;
            x++;
            _MemoryArray.push(opCode);
            //_memory.addToMemory();
            //console.log("x: " + x);
        };
        //this function runs the op codes by using a switch statement
        //the switch statement calls different functions depending on which opCode is executed in memory
        Cpu.prototype.runOpCode = function (code) {
            this.instruction = code.toUpperCase();
            //var x = 0;
            console.log("instruction: " + this.instruction);
            switch (this.instruction) {
                case "A9":
                    //load the accumulator with a constant
                    this.loadAccWithConstant();
                    break;
                case "AD":
                    //load the accumulator from memory
                    this.loadAccFromMemory();
                    break;
                case "8D":
                    //store the accumulator in memory
                    this.storeAccInMemory();
                    break;
                case "6D":
                    //add with carry
                    this.addWithCarry();
                    break;
                case "A2":
                    //Load the X register with a constant
                    this.loadXregisterWithConstant();
                    break;
                case "AE":
                    //Load the X register from memory
                    this.loadXregisterFromMemory();
                    break;
                case "A0":
                    //Load the Y register with a constant
                    this.loadYregisterWithConstant();
                    break;
                case "AC":
                    //Load the Y register from memory
                    this.loadYregisterFromMemory();
                    break;
                case "EA":
                    //No operation
                    //doing nothing (this is how you do it)
                    break;
                case "00":
                    //Break (which is really a system call)
                    this.isExecuting = false;
                    _Console.advanceLine();
                    _Console.putText(">");
                    break;
                case "EC":
                    //Compare a byte in memory to the X reg. Sets the Z (zero) flag if equal
                    this.compareToXregister();
                    break;
                case "D0":
                    //Branch n bytes if Z flag = 0
                    this.branchNbytes();
                    break;
                case "EE":
                    //Increment the value of a byte
                    this.incrementValueOfByte();
                    //this.PC++;
                    break;
                case "FF":
                    //System call
                    this.systemCall();
                    break;
            }
            this.PC++;
            //x++;
            //}
            //his.isExecuting = false;
        };
        //loads the Accumulator with a constant
        Cpu.prototype.loadAccWithConstant = function () {
            this.Acc = this.getNextByte(); //get the next byte and convert it to hex, set it equal to the Acc
            console.log("Acc: " + this.Acc);
            this.PC++; //update PC
        };
        //loads the Accumulator from memory
        Cpu.prototype.loadAccFromMemory = function () {
            var nxtTwoBytes = this.getNextTwoBytes();
            var decimal = this.conversionToDecimal(_MemoryManager.getMemoryAtLocation(nxtTwoBytes));
            this.Acc = decimal;
            this.PC += 2;
        };
        //Stores the Accumulator in memory
        Cpu.prototype.storeAccInMemory = function () {
            var nextTwoBytes = this.getNextTwoBytes();
            var hexNum = this.Acc;
            _MemoryManager.updateMemoryAtLocation(nextTwoBytes, hexNum); //updates memory
            this.PC += 2;
            console.log("PC: " + this.PC);
        };
        //adds with a carry
        Cpu.prototype.addWithCarry = function () {
            this.Acc += this.conversionToDecimal(_MemoryManager.getMemoryAtLocation(this.getNextTwoBytes()));
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
            this.Yreg = this.conversionToDecimal(_MemoryManager.getMemoryAtLocation(memoryLocation));
            this.PC += 2; //update pc
        };
        Cpu.prototype.compareToXregister = function () {
            var memoryLocation = this.getNextByte(); //getting the location of the byte to get
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
                this.PC++;
                this.PC += value;
                if (this.PC >= _ProgramSize) {
                    this.PC = this.PC - _ProgramSize;
                }
            }
            else {
                this.PC++;
            }
        };
        Cpu.prototype.incrementValueOfByte = function () {
            var memoryLocation = this.conversionToDecimal(_MemoryManager.getMemoryAtLocation(this.PC + 1));
            var hexAtLocation = _MemoryManager.getMemoryAtLocation(memoryLocation);
            var decimalNum = this.conversionToDecimal(hexAtLocation);
            decimalNum++;
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
            if (this.Xreg == 1) {
                _StdOut.putText(this.conversionToDecimal(this.Yreg).toString());
            }
            else if (this.Xreg == 2) {
                var characterString = "";
                var char = "";
                var character = _MemoryManager.getMemoryAtLocation(this.Yreg);
                console.log("Hex character: " + character);
                var characterCode = 0;
                while (character != "00") {
                    var decimalNum = this.conversionToDecimal(character);
                    console.log("character: " + character);
                    char = String.fromCharCode(decimalNum);
                    console.log(char);
                    characterString += char;
                    this.Yreg++;
                    character = _MemoryManager.getMemoryAtLocation(this.Yreg);
                }
                _StdOut.putText(characterString);
            }
        };
        Cpu.prototype.updateCPU = function () {
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
