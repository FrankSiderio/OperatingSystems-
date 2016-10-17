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

module TSOS {
    //for updating memory table
    var row = 0;
    var x = 0;

    export class Cpu {



        constructor(public PC: number = 0,
                    public Acc: number = 0,
                    public Xreg: number = 0,
                    public Yreg: number = 0,
                    public Zflag: number = 0,
                    public isExecuting: boolean = false,
                    public instruction: string = "") {

        }

        public init(): void {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;

            //this.drawMemory();
        }

        public cycle(): void {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            console.log("code being loaded: " + _MemoryManager.getMemoryAtLocation(this.PC));
            console.log("PC: " + this.PC);

            this.runOpCode(_MemoryManager.getMemoryAtLocation(this.PC));

            //this.updateCPU();
            _Memory.clearMemory();

            if(_SingleStep == true)
            {
              this.isExecuting = false;
            }


        }

        //load op codes
        public loadOpCode(opCode): void
        {
          var i = 0;
          while(i != opCode.length) //iterates through each different hex code
          {
            this.updateMemoryTable(opCode[i]);
            /*

          */
          i++;
          }
        }

      //updates the memory table with the opCodes
      public updateMemoryTable(opCode)
      {
        //go to the next row
        if(x == 8)
        {
          row++;
          x = 0;
          //console.log("row: " + row);
        }
        _MemoryTable.rows[row].cells[x + 1].innerHTML = opCode;
        x++;
        _MemoryArray.push(opCode);
        //_memory.addToMemory();
        //console.log("x: " + x);
      }

      public runOpCode(code)
      {
        this.instruction = code.toUpperCase();
        var x = 0;
        //while(x < _MemoryArray.length)
        //{
          //console.log("running: " + _MemoryArray[x]);
        console.log("Op code: " + code);
        switch (this.instruction)
        {
          case "A9":
            //load the accumulator with a constant
            this.PC = this.PC + 1; //update PC
            var nextByte = _MemoryManager.getMemoryAtLocation(this.PC + 1); //get the next byte and convert it to hex
            nextByte = this.conversionToHex(nextByte); //set the next byte to it's hex value
            this.Acc = nextByte; //update the Acc
            //this.loadAccumulatorWithConstant();
            //console.log("Acc: " + this.Acc);
            //console.log("PC: " + this.PC);
          break;

            case "AD":
              //load the accumulator from memory
            break;

            case "8D":
              //store the accumulator in memory
            case "6D":
              //add with carry
            break;

            case "A2":
              //Load the X register with a constant
            break;

            case "AE":
              //Load the X register from memory
            break;

            case "A0":
              //Load the Y register with a constant
            break;

            case "AC":
              //Load the Y register from memory
            break;

            case "EA":
              //No operation
            break;

            case "00":
              //Break (which is really a system call)
            break;

            case "EC":
              //Compare a byte in memory to the X reg. Sets the Z (zero) flag if equal
            break;

            case "D0":
              //Branch n bytes if Z flag = 0
            break;

            case "EE":
              //Increment the value of a byte
            break;

            case "FF":
              //System call
            break;
            //default: alert("default");

        }

          //x++;
        //}
        //his.isExecuting = false;
      }

      public loadAccumulatorWithConstant()
      {
        //alert("hey");
      }

      public conversionToHex(value)
      {
        var hexValue = parseInt(value, 16);
        return value;
      }
      public updateCPU()
      {
        document.getElementById("cpuPC").innerHTML = this.PC.toString();
        document.getElementById("cpuACC").innerHTML = this.Acc.toString();
        document.getElementById("cpuXReg").innerHTML = this.Xreg.toString();
        document.getElementById("cpuYReg").innerHTML = this.Yreg.toString();
        document.getElementById("cpuZFlag").innerHTML = this.Zflag.toString();
      }




    }
}
