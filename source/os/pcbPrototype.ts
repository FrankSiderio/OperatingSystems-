///<reference path="../globals.ts"/>

module TSOS
{
  export class PCB
  {
    constructor
    (
      public PC: number = 0,
      public Acc: number = 0,
      public XReg: number = 0,
      public YReg: number = 0,
      public ZFlag: number = 0,
      public pid:number = (_PID + 1),
      public instruction:string = "",
      public base: number = (_CurrentMemoryBlock * 256),
      public limit: number = ((_CurrentMemoryBlock * 256) + 255),
      public running: boolean = false,
      public state: string = "",
      public location: any = null,
      public priority: number = null)
      {

      }
  }
}
