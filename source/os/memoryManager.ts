
//This is supposed to like manage the memory I guess
module TSOS
{
  export class MemoryManager
  {
    base: number = 0;
    limit: number = 255;

    constructor(){}
    public init(){}
    //loading the program into memory
    public loadProgram(opCode)
    {
      _Memory.clearMemory();
      this.base = 0;
      this.limit = 255;

      for(var i = 0; i < opCode.length; i++)
      {
        this.updateMemoryLocation(i, opCode[i]);
      }
      return "kfjdksajfkdsa" + _PID;
    }

    //updating the table
    public updateMemoryLocation(memoryLocation, opCode): void
    {
      var hexCode = opCode.toString(16); //setting the hexCode equal to the passed in opCode
      var currentBlock = _Memory.getMemory(); //setting the current block from Memory

      if(hexCode.length < 2) //if there is no zero in front
      {
        hexCode = "0" + hexCode;
      }

      //var newMemoryLocation = (location + base); //setting the new mem location
      //currentBlock
      var currentTableRow = Math.floor(memoryLocation / 8);
      Control.updateMemoryTable(currentTableRow, memoryLocation % 8, hexCode);
    }





  }
}
