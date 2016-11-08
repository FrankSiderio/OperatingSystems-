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
      //public pid:number = ++ _PID,
      public instruction:string = "",
      public base: number = 0,
      public max: number = 0,
      public running: boolean = false,
      public location: any = null
    ){}
  }
}
