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
      _ProgramLength = opCode.length;

      _Memory.clearMemory();
      this.base = 0;
      this.limit = 255;

      //calls updateMemoryLocation to update the physical address
      for(var i = 0; i < opCode.length; i++)
      {
        this.updateMemoryAtLocation(i, opCode[i]);
      }
      return "PID: " + _PID;
    }
    //gets the memory at a specified location
    public getMemoryAtLocation(location)
    {
      return _Memory.getMemoryLocation(location);
    }

    //updates the table, given a specific location and opCode
    public updateMemoryAtLocation(memoryLocation, opCode): void
    {
      var hexCode = opCode.toString(16); //setting the hexCode equal to the passed in opCode
      var currentBlock = _Memory.getMemory(); //setting the current block from Memory

      //console.log("Mem loc: " + memoryLocation);
      //console.log("Op code: " + opCode);

      if(hexCode.length < 2) //if there is no zero in front
      {
        hexCode = "0" + hexCode;
      }

      currentBlock[memoryLocation] = hexCode;
      var currentTableRow = Math.floor(memoryLocation / 8);
      //_Memory.addToMemory(memoryLocation, opCode);
      Control.updateMemoryTable(currentTableRow, memoryLocation % 8, hexCode);
    }





  }
}
