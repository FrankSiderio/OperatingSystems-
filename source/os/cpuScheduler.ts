///<reference path="../globals.ts" />
///<reference path="../host/control.ts" />

//CPU Scheduling class

module TSOS
{
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
      else if(_QuantumCounter == _Quantum)
      {
        _QuantumCounter = 0;
        //alert("switch");
        //console.log("Memory base: " + _MemoryManager.base);
        if(_MemoryManager.base == 0) //if its running program in location[0]
        {
          _MemoryManager.base = 256;
          _MemoryManager.limit = 511;

          this.setValues(0);
        }
        else if(_MemoryManager.base == 256) //if its running program in location[1]
        {
          _MemoryManager.base = 512;
          _MemoryManager.limit = 768;

          this.setValues(1);
        }
        else if(_MemoryManager.base == 512) //if its running program in location[2]
        {
          _MemoryManager.base = 0;
          _MemoryManager.limit = 255;

          this.setValues(2);
        }

        //console.log("Base: " + _MemoryManager.base);
        //console.log("Limit: " + _MemoryManager.limit);
        /*
        pc = _CPU.PC;
        acc = _CPU.Acc;
        xreg = _CPU.Xreg;
        yreg = _CPU.Yreg;
        zflag = _CPU.Zflag;

        _CPU.PC = 256;
        */
      }

      //_Kernel.krnInterruptHandler(CONTEXT_SWITCH_IRQ, null);
    }

    // this might change...better way to implement
    private setValues(num)
    {
      //save the current CPU values so we can get them later
      if(num == 0)
      {
        pc0 = _CPU.PC;
        acc0 = _CPU.Acc;
        xreg0 = _CPU.Xreg;
        yreg0 = _CPU.Yreg;
        zflag0 = _CPU.Zflag;

        _CPU.PC = pc1;
        _CPU.Acc = acc1;
        _CPU.Xreg = xreg1;
        _CPU.Yreg = yreg1;
        _CPU.Zflag = zflag1;
      }
      else if(num == 1)
      {
        pc1 = _CPU.PC;
        acc1 = _CPU.Acc;
        xreg1 = _CPU.Xreg;
        yreg1 = _CPU.Yreg;
        zflag1 = _CPU.Zflag;

        _CPU.PC = pc2;
        _CPU.Acc = acc2;
        _CPU.Xreg = xreg2;
        _CPU.Yreg = yreg2;
        _CPU.Zflag = zflag2;
      }
      else if(num == 2)
      {
        pc2 = _CPU.PC;
        acc2 = _CPU.Acc;
        xreg2 = _CPU.Xreg;
        yreg2 = _CPU.Yreg;
        zflag2 = _CPU.Zflag;

        _CPU.PC = pc0;
        _CPU.Acc = acc0;
        _CPU.Xreg = xreg0;
        _CPU.Yreg = yreg0;
        _CPU.Zflag = zflag0;
      }
    }

  }
}
