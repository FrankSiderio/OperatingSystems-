//this class is like something to do with memory
module TSOS
{
  export class memory
  {
    public memoryArray:string[];
    public totalMemory:number = 256;

    constructor(size:number)
    {
      this.totalMemory = size;
      var zero = "00";

      for(var x = 0; x < size; x++)
      {
        this.memoryArray[x] = zero;
      }
    }

    public getMemoryLocation(memoryLocation):string
    {
      return this.memoryArray[memoryLocation];
    }


  }
}
