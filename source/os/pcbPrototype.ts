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

    public updateDisplay()
    {
      var runningDisplay: Array<string> = ["waiting", "waiting", "waiting"];
      var b = _MemoryManager.getBase();
      var l = _MemoryManager.getLimit();

      document.getElementById("pcbPID0").innerHTML = _MemoryAllocation[0].toString();
      document.getElementById("ir0").innerHTML = _Pcb0.instruction;
      document.getElementById("pcbPC0").innerHTML = _Pcb0.PC.toString();
      document.getElementById("pcbAcc0").innerHTML = _Pcb0.Acc.toString();
      document.getElementById("pcbX0").innerHTML = _Pcb0.XReg.toString();
      document.getElementById("pcbY0").innerHTML = _Pcb0.YReg.toString();
      document.getElementById("pcbZ0").innerHTML = _Pcb0.ZFlag.toString();
      if(b == 0)
      {
        runningDisplay[0] = "running";
      }
      else
      {
        if(_MemoryAllocation[0] != "-1")
        {
          _WaitTime[0]++;
        }
      }
      document.getElementById("state0").innerHTML = runningDisplay[0];

      document.getElementById("pcbPID1").innerHTML = _MemoryAllocation[1].toString();
      document.getElementById("ir1").innerHTML = _Pcb1.instruction;
      document.getElementById("pcbPC1").innerHTML = _Pcb1.PC.toString();
      document.getElementById("pcbAcc1").innerHTML = _Pcb1.Acc.toString();
      document.getElementById("pcbX1").innerHTML = _Pcb1.XReg.toString();
      document.getElementById("pcbY1").innerHTML = _Pcb1.YReg.toString();
      document.getElementById("pcbZ1").innerHTML = _Pcb1.ZFlag.toString();
      if(b == 256)
      {
        runningDisplay[1] = "running";
      }
      else
      {
        if(_MemoryAllocation[0] != "-1")
        {
          _WaitTime[1]++;
        }
      }
      document.getElementById("state1").innerHTML = runningDisplay[1];

      document.getElementById("pcbPID2").innerHTML = _MemoryAllocation[2].toString();
      document.getElementById("ir2").innerHTML = _Pcb2.instruction;
      document.getElementById("pcbPC2").innerHTML = _Pcb2.PC.toString();
      document.getElementById("pcbAcc2").innerHTML = _Pcb2.Acc.toString();
      document.getElementById("pcbX2").innerHTML = _Pcb2.XReg.toString();
      document.getElementById("pcbY2").innerHTML = _Pcb2.YReg.toString();
      document.getElementById("pcbZ2").innerHTML = _Pcb2.ZFlag.toString();
      if(b == 512)
      {
        runningDisplay[2] = "running";
      }
      else
      {
        if(_MemoryAllocation[0] != "-1")
        {
          _WaitTime[2]++;
        }
      }
      document.getElementById("state2").innerHTML = runningDisplay[2];
    }
  }
}
