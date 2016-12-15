///<reference path="../globals.ts" />
//This is supposed to like manage the memory I guess
module TSOS
{
  export class MemoryManager
  {
    base: number = 0;
    limit: number = 255;

    //constructor(){}
    //public init(){}
    //loading the program into memory
    public loadProgram(opCode)
    {

      //_Memory.clearMemory();
      //Chooses with memory block to allocate
      if(_MemoryAllocation[0] == "-1")
      {
        this.base = 0;
        this.limit = 255;
        _MemoryAllocation[0] = _PID.toString();
        this.setProgramLength(0, opCode);
        //console.log("mem alloc 0: " + _MemoryAllocation[0]);
      }
      else if(_MemoryAllocation[1] == "-1")
      {
        this.base = 256;
        this.limit = 511;
        _MemoryAllocation[1] = _PID.toString();
        this.setProgramLength(1, opCode);
        //console.log("mem alloc 1: " + _MemoryAllocation[1]);
      }
      else if(_MemoryAllocation[2] == "-1")
      {
        this.base = 512;
        this.limit = 768;
        _MemoryAllocation[2] = _PID.toString();
        //this.setProgramLength(2, opCode);
        _ProgramLength[2] = opCode.length - 1;
      }

      //console.log("base: " + this.base);
      //console.log("limit: " + this.limit);

      //calls updateMemoryLocation to update the physical address
      for(var i = 0; i < opCode.length; i++)
      {
        this.updateMemoryAtLocation(i, opCode[i]);
      }
      return "PID: " + _PID;
    }

    private setProgramLength(loc, code)
    {
      var length = 0;
      //gets the length of the program
      for(var i = 0; i < code.length; i++)
      {
        if(code[i] != "00") //if there isn't a break
        {
          length++;
        }
      }
      _ProgramLength[loc] = length;

      //console.log("Program length for location: " + loc + " is: " + _ProgramLength[loc]);
    }
    //gets the memory at a specified location
    public getMemoryAtLocation(location)
    {
      return _Memory.getMemoryLocation(location);
    }

    public clearMemorySegment(base)
    {
      var zero = "00";
      //console.log("Base: " + base);
      for(var i = 0; i < 256; i++)
      {
        _Memory.memoryArray[i + base] = "0";
        Control.clearMemoryTableSegment(base / 8);
      }
    }

    //updates the table, given a specific location and opCode
    public updateMemoryAtLocation(memoryLocation, opCode): void
    {
      var startingRow = 0;

      if(this.base == 0)
      {
        startingRow = 0;
      }
      else if(this.base == 256)
      {
        startingRow = 32;
      }
      else if(this.base == 512)
      {
        startingRow = 64;
      }

      var hexCode = opCode.toString(16); //setting the hexCode equal to the passed in opCode
      var currentBlock = _Memory.getMemory(); //setting the current block from Memory

      //console.log("Mem loc: " + memoryLocation);
      //console.log("Op code: " + opCode);
      //console.log("Starting row: " + startingRow);
      if(hexCode.length < 2) //if there is no zero in front
      {
        hexCode = "0" + hexCode;
      }

      var newMemLocation = (memoryLocation + this.base);
      currentBlock[newMemLocation] = hexCode;

      var currentTableRow = ((Math.floor(memoryLocation / 8)) + startingRow);
      //console.log("Current table row: " + currentTableRow);
      //_Memory.addToMemory(memoryLocation, opCode);
      //console.log("Limit: " + this.limit);
      //console.log("Row: " + currentTableRow);

      if(this.base == 0)
      {
        if(currentTableRow < 32)
        {
          Control.updateMemoryTable(currentTableRow, memoryLocation % 8, hexCode);
        }
      }
      else if(this.base == 256)
      {
        if(currentTableRow < 64)
        {
          Control.updateMemoryTable(currentTableRow, memoryLocation % 8, hexCode);
        }
      }
      else if(this.base == 512)
      {
        if(currentTableRow < 96)
        {
          Control.updateMemoryTable(currentTableRow, memoryLocation % 8, hexCode);
        }
      }
      else
      {
        //alert("Memory exceeded!");
        _Kernel.krnTrapError("MemoryExceeded!");
        _CPU.isExecuting = false;
      }

      //Control.updateMemoryTable(currentTableRow, memoryLocation % 8, hexCode);

      //console.log(_Memory.getMemory());
    }

    //getters and setters
    public getBase()
    {
      return this.base;
    }

    public getLimit()
    {
      return this.limit;
    }

    public setBase(base)
    {
      this.base = base;
    }

    public setLimit(limit)
    {
      this.limit = limit;
    }




  }
}
