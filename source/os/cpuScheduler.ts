///<reference path="../globals.ts" />

//CPU Scheduling class
//We have 3 instances of the pcb class that contains everything so we can swap back and forth
//Probably not the best way to do this but it works.

module TSOS
{
  export class CpuScheduler
  {
    public counter = 0;

    constructor()
    {}

    //figures out which scheduling algorithm we are using and calls that function
    public scheduler(): void
    {
      switch(_SchedulingAlgorithm)
      {
        case "rr":
          if(_QuantumCounter >= _Quantum && _ReadyQueue.length > 0)
          {
            this.roundRobin();
            _QuantumCounter = 0;
          }
        break;

        case "fcfs":
          this.fcfs();
        break;

        case "priority":
        break;
      }

      _QuantumCounter++;
      _CPU.cycle();
    }

    //round robin scheduling
    public roundRobin()
    {
      //if theres more than one program in the queue we need to switch
      if(_ReadyQueue.length > 1)
      {
        _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CONTEXT_SWITCH_IRQ, ""));

        //switch if process is over
        if(_CurrentPCB.state == TERMINATED)
        {
          //console.log("Process is done");
          //terminate the process
          var terminate = _ReadyQueue.shift();
          //reset the quantum counter
          _QuantumCounter = 0;

          //change the current pcb
          _CurrentPCB = _ReadyQueue[0];
          //update the running pid
          _RunningPID = parseInt(_ReadyQueue[0].pid);
          //now the new process is running
          _ReadyQueue[0].state = RUNNING;
          _CPU.PC = _ReadyQueue[0].PC - 1;
        }
        //regular context switch
        else
        {
          //console.log("Regular context switch");
          //declare the pcb that will be pushed
          var pcbPushed = _CurrentPCB;
          //change the state
          _ReadyQueue[0].state = WAITING;
          //add the new pcb and shift the ready queue
          _ReadyQueue.push(pcbPushed);
          _ReadyQueue.shift();
          //update the ready queue
          _CurrentPCB = _ReadyQueue[0];

          var location = _CurrentPCB.location;
          if(location == "Disk")
          {
            //var opCode = _FileSystem.findProgram(_CurrentPCB.pid);
            //console.log("Op code rolling onto memory: " + opCode);
            this.rollInOutRunAll();
          }

          _RunningPID = parseInt(_ReadyQueue[0].pid);
          //update the state and pc
          _ReadyQueue[0].state = RUNNING;
          _CPU.PC = _ReadyQueue[0].PC;
        }

        //update the cpu so it runs the right stuff
        _CPU.Acc = _ReadyQueue[0].Acc;
        _CPU.Xreg = _ReadyQueue[0].XReg;
        _CPU.Yreg = _ReadyQueue[0].YReg;
        _CPU.Zflag = _ReadyQueue[0].ZFlag;

        _CurrentMemoryBlock = _CurrentPCB.base / 256;

      }
      _CPU.isExecuting = true;
    }


    public fcfs()
    {
      console.log("FCFS");
      _Quantum = 123214342;

      //TODO: Find a better way to do this
      _SchedulingAlgorithm = "rr";
    }

    public rollInOut(opCode)
    {
      _CurrentPCB.location = "Memory";
      var swappedProgram = "";

      for(var i = 0; i < 255; i++)
      {
        swappedProgram += _Memory.getMemoryLocation(i);
        _MemoryManager.base = 0;
        _MemoryManager.updateMemoryAtLocation(i, "00");
        swappedProgram += " ";
      }

      var pidProgramAtBase0;

      for(var i = 0; i < _ResidentList.length; i++)
      {
        if(_ResidentList[i].base == 0)
        {
          _ResidentList[i].location = "Disk";
          _ResidentList[i].base = -1;
          _ResidentList[i].limit = -1;
          pidProgramAtBase0 = _ResidentList[i].pid;
        }
      }

      var fileName = DEFAULT_FILE_NAME + pidProgramAtBase0;
      _FileSystem.writeFile(fileName, swappedProgram);
      //opCode = opCode.replace(/(.{2})/g, " ");
      var newOpCode = "";

      //adding a space after every two characters
      for(var i = 0; i < opCode.length; i++)
      {
        if((i % 2) == 0 && i != 0)
        {
          newOpCode += " ";
        }
        newOpCode += opCode.charAt(i);

      }
      //making it nice so it loads into memory properly
      var program = newOpCode.replace(/\n/g, " " ).split( " " );

      //console.log("Returned mem: " + _Memory.getMemory());
      //getting the op code from the last segment of memory
      var memory = "";
      for(var i = 0; i < 256; i++)
      {
        memory += _Memory.getMemoryLocation(i);
      }

      //var oldProgram = mem.substr(512, _Memory.getMemory.length);
      //console.log("Program length: " + _ProgramLength[2]);
      //console.log("Old program: " + memory.substr(0, (_ProgramLength[2] * 2)));
      //_SwappedProgram = memory.substr(0, (_ProgramLength[2] * 2));

      _CurrentPCB.base = 0;
      _MemoryManager.setBase(0);
      _MemoryManager.loadProgram(0, program);
    }

    //if we have to swap while runall is in effect
    public rollInOutRunAll()
    {
      var currentPCBpid = _CurrentPCB.pid;
      //alert(currentPCBpid);
      _CurrentPCB.location = "Memory";
      var dataInMemory = "";

      for(var i = 0; i < 255; i++)
      {
        dataInMemory += _Memory.getMemoryLocation(i);
        _MemoryManager.base = 0;
        _MemoryManager.updateMemoryAtLocation(i, "00");
      }
      //console.log("Memory data to be moved: " + dataInMemory);
      //console.log("Supposed to be running: " + _CurrentPCB.pid + " Location: " + _CurrentPCB.location);

      var pidProgramAtBase0;
      for(var i = 0; i < _ReadyQueue.length; i++)
      {
        if(_ReadyQueue[i].base == 0)
        {
          _ReadyQueue[i].location = "Disk";
          pidProgramAtBase0 = _ReadyQueue[i].pid;
          //console.log("PID of program at 0: " + pidProgramAtBase0);
        }
      }
      _ResidentList[pidProgramAtBase0].base = -1;
      _ResidentList[pidProgramAtBase0].limit = -1;

      //console.log("Supposed to be running: " + _CurrentPCB.pid + " Location " + _CurrentPCB.location);
      var fileName = DEFAULT_FILE_NAME + pidProgramAtBase0;
      var fileToDisk = _FileSystem.findProgram(pidProgramAtBase0);

      //console.log("File to disk: " + fileToDisk);

      if(fileToDisk == "")
      {
        _FileSystem.createFile(fileName);
      }
      else
      {
        _FileSystem.deleteFile(fileName);
        _FileSystem.createFile(fileName);
      }

      //console.log("DATA IN MEMORY THAT WE ARE WRITING: " + dataInMemory);
      dataInMemory = _FileSystem.stringToHex(dataInMemory);
      _FileSystem.writeFile(fileName, dataInMemory);

      var getFileWithName = DEFAULT_FILE_NAME + currentPCBpid;
      var fileOnDisk = _FileSystem.findProgram(currentPCBpid);
      fileOnDisk = _FileSystem.hexToString(fileOnDisk);

      //console.log("Supposed to be running: " + _CurrentPCB.pid + " location " + _CurrentPCB.location);
      fileOnDisk = fileOnDisk.replace(/\s+/g, '');
      console.log("FILE THAT WE GOT FROM DISK: " + fileOnDisk);

      var fileOnDiskArray = [];
      var i = 0;

      while(fileOnDisk.length > 0 && i <= 255)
      {
        var subString = fileOnDisk.substr(0, 2);
        fileOnDiskArray.push(subString);
        var newLength = fileOnDisk.length - 2;
        fileOnDisk = fileOnDisk.substr(2, newLength);
        i++;
      }

      console.log("FILE ON DISK ARRAY: " + fileOnDiskArray);

      //console.log("File on disk array" + fileOnDiskArray);
      for(var i = 0; i < fileOnDiskArray.length; i++)
      {
        //alert("HEY");
        var code = fileOnDiskArray[i];
        _MemoryManager.base = 0;
        _MemoryManager.updateMemoryAtLocation(i, code);

      }
      //console.log("Code: " + code);

      _CurrentPCB.base = 0;
      _CurrentPCB.limit = 255;

    }
  }
}
