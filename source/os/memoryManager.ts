//This is supposed to like manage the memory I guess
module TSOS
{
  export class MemoryManager
  {
    //constructor{}

    //loading the program into memory
    public loadProgram(opCode)
    {

      for(var i = 0; i < opCode.length; i++)
      {
        this.updateMemoryLocation(i, opCode[i]);
      }
    }

    //updating the table
    public updateMemoryLocation(memoryLocation, opCode): void
    {
      var hexCode = opCode.toString(16);

      Control.updateMemoryTable(memoryLocation, memoryLocation % 8, opCode);
    }

  }
}
