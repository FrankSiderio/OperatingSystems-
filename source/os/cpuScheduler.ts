///<reference path="../globals.ts" />
///<reference path="../host/control.ts" />

//CPU Scheduling class
//We have 3 instances of the pcb class that contains everything so we can swap back and forth
//Probably not the best way to do this but it works.

module TSOS
{
  //var pcb0 = new PCB();

  var pc0;
  var acc0;
  var xreg0;
  var yreg0;
  var zflag0;

  var pc1 = 256;
  var acc1;
  var xreg1;
  var yreg1;
  var zflag1;

  var pc2 = 512;
  var acc2;
  var xreg2;
  var yreg2;
  var zflag2;

  var counter = 0;

  export class CpuScheduler
  {
    public roundRobin()
    {
      //do the round robin stuff here
      //console.log("Counter: " + counter);
      //if we are doing round robin
      if(_QuantumCounter < _Quantum)
      {
        if(counter == 0) //first round
        {
          _MemoryManager.base = 0;
          _MemoryManager.limit = 255;
          counter = 1;
        }

        _CPU.isExecuting = true;
      }
      //switch
      else if(_QuantumCounter == _Quantum)
      {
        _QuantumCounter = 0;
        //alert("switch");
        //alert("Base: " + _MemoryManager.base);
        //console.log("Memory base: " + _MemoryManager.base);
        //figure out where to switch to
        if(_MemoryManager.base == 0) //if its running program in location[0]
        {
          if(_MemoryAllocation[1] != "-1")
          {
            _MemoryManager.base = 256;
            _MemoryManager.limit = 511;
            _Kernel.krnTrace("Context Switch");

            this.setValues(0);
          }
        }
        else if(_MemoryManager.base == 256) //if its running program in location[1]
        {
          if(_MemoryAllocation[2] != "-1")//lets make sure there is something there
          {
            _MemoryManager.base = 512;
            _MemoryManager.limit = 768;
            _Kernel.krnTrace("Context Switch");

            this.setValues(1);
          }

          //this allows us to do round robin with just 2 programs
          //probably a better way to do this than all these ifs
          else if(_MemoryAllocation[0] != "-1")//check to see if theres something in the previous spot
          {
            _MemoryManager.base = 0;
            _MemoryManager.limit = 255;

            this.setValues(7);
          }

        }
        else if(_MemoryManager.base == 512) //if its running program in location[2]
        {
          if(_MemoryAllocation[0] != "-1")
          {
            _MemoryManager.base = 0;
            _MemoryManager.limit = 255;
            _Kernel.krnTrace("Context Switch");

            this.setValues(2);
          }
          else if(_MemoryAllocation[1] != "-1")
          {
            _MemoryManager.base = 256;
            _MemoryManager.limit = 511;
            _Kernel.krnTrace("Context Switch");

            this.setValues(4);
          }
        }

        console.log("Base: " + _MemoryManager.base);
        console.log("Limit: " + _MemoryManager.limit);

        //console.log("Memory base after: " + _MemoryManager.base);
        //var interrupt = _KernelInterruptQueue.queue();
        //_Kernel.krnInterruptHandler(interrupt.irq, interrupt.params);

      }

      //_Kernel.krnInterruptHandler(CONTEXT_SWITCH_IRQ, "fdsafdsa");
    }

    // this might change...better way to implement
    private setValues(num)
    {
      //save the current CPU values so we can get them later
      //num tells us which block we are saving the values from
      if(num == 0)
      {
        _Pcb0.PC = _CPU.PC;
        _Pcb0.Acc = _CPU.Acc;
        _Pcb0.XReg = _CPU.Xreg;
        _Pcb0.YReg = _CPU.Yreg;
        _Pcb0.ZFlag = _CPU.Zflag;
        _Pcb0.instruction = _CPU.instruction;

        _CPU.PC = _Pcb1.PC;
        _CPU.Acc = _Pcb1.Acc;
        _CPU.Xreg = _Pcb1.XReg;
        _CPU.Yreg = _Pcb1.YReg;
        _CPU.Zflag = _Pcb1.ZFlag;

      }
      else if(num == 1)
      {
        _Pcb1.PC = _CPU.PC;
        _Pcb1.Acc = _CPU.Acc;
        _Pcb1.XReg = _CPU.Xreg;
        _Pcb1.YReg = _CPU.Yreg;
        _Pcb1.ZFlag = _CPU.Zflag;
        _Pcb1.instruction = _CPU.instruction;

        _CPU.PC = _Pcb2.PC;
        _CPU.Acc = _Pcb2.Acc;
        _CPU.Xreg = _Pcb2.XReg;
        _CPU.Yreg = _Pcb2.YReg;
        _CPU.Zflag = _Pcb2.ZFlag;

      }
      else if(num == 2)
      {

        _Pcb2.PC = _CPU.PC;
        _Pcb2.Acc = _CPU.Acc;
        _Pcb2.XReg = _CPU.Xreg;
        _Pcb2.YReg = _CPU.Yreg;
        _Pcb2.ZFlag = _CPU.Zflag;
        _Pcb2.instruction = _CPU.instruction;

        _CPU.PC = _Pcb0.PC;
        _CPU.Acc = _Pcb0.Acc;
        _CPU.Xreg = _Pcb0.XReg;
        _CPU.Yreg = _Pcb0.YReg;
        _CPU.Zflag = _Pcb0.ZFlag;

      }
      else if(num == 4)
      {
        _Pcb2.PC = _CPU.PC;
        _Pcb2.Acc = _CPU.Acc;
        _Pcb2.XReg = _CPU.Xreg;
        _Pcb2.YReg = _CPU.Yreg;
        _Pcb2.ZFlag = _CPU.Zflag;
        _Pcb2.instruction = _CPU.instruction;

        _CPU.PC = _Pcb1.PC;
        _CPU.Acc = _Pcb1.Acc;
        _CPU.Xreg = _Pcb1.XReg;
        _CPU.Yreg = _Pcb1.YReg;
        _CPU.Zflag = _Pcb1.ZFlag;
      }
      else if(num == 7) //if we want to see the values back to the previous pcb
      {
        _Pcb1.PC = _CPU.PC;
        _Pcb1.Acc = _CPU.Acc;
        _Pcb1.XReg = _CPU.Xreg;
        _Pcb1.YReg = _CPU.Yreg;
        _Pcb1.ZFlag = _CPU.Zflag;
        _Pcb1.instruction = _CPU.instruction;

        _CPU.PC = _Pcb0.PC;
        _CPU.Acc = _Pcb0.Acc;
        _CPU.Xreg = _Pcb0.XReg;
        _CPU.Yreg = _Pcb0.YReg;
        _CPU.Zflag = _Pcb0.ZFlag;
      }
    }
  }
}
