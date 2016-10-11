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
    var Cpu = (function () {
        function Cpu(PC, Acc, Xreg, Yreg, Zflag, isExecuting) {
            if (PC === void 0) { PC = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (isExecuting === void 0) { isExecuting = false; }
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
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
        };
        //load op codes
        Cpu.prototype.loadOpCode = function (opCode) {
            var i = 0;
            while (i != opCode.length) {
                switch (opCode[i]) {
                    case "A9":
                        //this.Acc
                        //displays it onto memory
                        this.updateMemoryTable(opCode);
                        this.PC = this.PC + 1;
                        break;
                    case "AD":
                        //load the accumulator from memory
                        this.updateMemoryTable(opCode);
                        break;
                    case "8D":
                        //store the accumulator in memory
                        this.updateMemoryTable(opCode);
                    case "6D":
                        //add with carry
                        this.updateMemoryTable(opCode);
                        break;
                    case "A2":
                        //Load the X register with a constant
                        this.updateMemoryTable(opCode);
                        break;
                    case "AE":
                        //Load the X register from memory
                        this.updateMemoryTable(opCode);
                        break;
                    case "A0":
                        //Load the Y register with a constant
                        this.updateMemoryTable(opCode);
                        break;
                    case "AC":
                        //Load the Y register from memory
                        this.updateMemoryTable(opCode);
                        break;
                    case "EA":
                        //No operation
                        this.updateMemoryTable(opCode);
                        break;
                    case "00":
                        //Break (which is really a system call)
                        this.updateMemoryTable(opCode);
                        break;
                    case "EC":
                        //Compare a byte in memory to the X reg. Sets the Z (zero) flag if equal
                        this.updateMemoryTable(opCode);
                        break;
                    case "D0":
                        //Branch n bytes if Z flag = 0
                        this.updateMemoryTable(opCode);
                        break;
                    case "EE":
                        //Increment the value of a byte
                        this.updateMemoryTable(opCode);
                        break;
                    case "FF":
                        //System call
                        this.updateMemoryTable(opCode);
                        break;
                }
                i++;
            }
        };
        //updates the memory table with the opCodes
        Cpu.prototype.updateMemoryTable = function (opCode) {
            var row = 0;
            for (var x = 0; x < opCode.length; x++) {
                TSOS.Control.updateMemoryTable(row, x + 1, opCode[x]);
                //if we need to move to the next row
                if (x == 8) {
                    row++;
                }
            }
        };
        return Cpu;
    }());
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
