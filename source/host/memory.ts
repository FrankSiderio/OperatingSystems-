///<reference path="../globals.ts" />
///<reference path="control.ts" />

//this class is like something to do with memory
module TSOS
{
  export class Memory
  {
    public memoryArray:string [];
    public totalMemory:number = 768;

    constructor(size: number)
    {
      this.totalMemory = size;
      this.init(this.totalMemory);
    }
    //initializes memory
    public init(memorySize)
    {
      this.memoryArray = [memorySize];
      var z:string = "00";

      for(var x = 0; x < memorySize; x++)
      {
        this.memoryArray[x] = z;
      }
    }
    //returns memory
    public getMemory()
    {
      return this.memoryArray;
    }
    //returns memory location
    public getMemoryLocation(memoryLocation):string
    {
      return this.memoryArray[memoryLocation];
    }
    //clears and resets memory
    public clearMemory()
    {
      //Control resets table
      Control.clearMemoryTable();
      this.memoryArray = null;
      _CPU.init();

      _CurrentMemoryBlock = -1;
      _ResidentList = [];
      _ReadyQueue = [];
      _RunnablePIDs = [];
      this.init(768);
    }

    public addToMemory(location, opCode)
    {
      this.memoryArray[location] = opCode;
    }





  }
}
