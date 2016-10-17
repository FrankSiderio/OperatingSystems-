//this class is like something to do with memory
module TSOS
{
  export class Memory
  {
    public memoryArray:string [];
    public totalMemory:number = 256;

    constructor(size:number)
    {
      this.totalMemory = size;
      this.init(this.totalMemory);
    }
    //initializes memory
    public init(memorySize)
    {
      this.memoryArray = [memorySize];
      var z = "00"

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
      //Control
      this.init(256);
      this.memoryArray = null;

    }




  }
}
