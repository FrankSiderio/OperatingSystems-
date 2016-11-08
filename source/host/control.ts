///<reference path="../globals.ts" />
///<reference path="../os/canvastext.ts" />
///<reference path="memory.ts" />
///<reference path="../os/memoryManager.ts" />

/* ------------
     Control.ts

     Requires globals.ts.

     Routines for the hardware simulation, NOT for our client OS itself.
     These are static because we are never going to instantiate them, because they represent the hardware.
     In this manner, it's A LITTLE BIT like a hypervisor, in that the Document environment inside a browser
     is the "bare metal" (so to speak) for which we write code that hosts our client OS.
     But that analogy only goes so far, and the lines are blurred, because we are using TypeScript/JavaScript
     in both the host and client environments.

     This (and other host/simulation scripts) is the only place that we should see "web" code, such as
     DOM manipulation and event handling, and so on.  (Index.html is -- obviously -- the only place for markup.)

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */

//
// Control Services
//
module TSOS {

    export class Control {

        public static hostInit(): void {
            // This is called from index.html's onLoad event via the onDocumentLoad function pointer.

            // Get a global reference to the canvas.  TODO: Should we move this stuff into a Display Device Driver?
            _Canvas = <HTMLCanvasElement>document.getElementById('display');

            // Get a global reference to the drawing context.
            _DrawingContext = _Canvas.getContext("2d");

            // Enable the added-in canvas text functions (see canvastext.ts for provenance and details).
            CanvasTextFunctions.enable(_DrawingContext);   // Text functionality is now built in to the HTML5 canvas. But this is old-school, and fun, so we'll keep it.

            // Clear the log text box.
            // Use the TypeScript cast to HTMLInputElement
            (<HTMLInputElement> document.getElementById("taHostLog")).value="";

            // Set focus on the start button.
            // Use the TypeScript cast to HTMLInputElement
            (<HTMLInputElement> document.getElementById("btnStartOS")).focus();

            // Check for our testing and enrichment core, which
            // may be referenced here (from index.html) as function Glados().
            if (typeof Glados === "function") {
                // function Glados() is here, so instantiate Her into
                // the global (and properly capitalized) _GLaDOS variable.
                _GLaDOS = new Glados();
                _GLaDOS.init();
            }
        }

        public static hostLog(msg: string, source: string = "?"): void {
            // Note the OS CLOCK.
            var clock: number = _OSclock;

            // Note the REAL clock in milliseconds since January 1, 1970.
            var now: number = new Date().getTime();

            // Build the log string.
            var str: string = "({ clock:" + clock + ", source:" + source + ", msg:" + msg + ", now:" + now  + " })"  + "\n";

            // Update the log console.
            var taLog = <HTMLInputElement> document.getElementById("taHostLog");
            taLog.value = str + taLog.value;

            // TODO in the future: Optionally update a log database or some streaming service.
        }


        //
        // Host Events
        //
        public static hostBtnStartOS_click(btn): void {
            // Disable the (passed-in) start button...
            btn.disabled = true;

            // .. enable the Halt and Reset buttons ...
            (<HTMLButtonElement>document.getElementById("btnHaltOS")).disabled = false;
            (<HTMLButtonElement>document.getElementById("btnReset")).disabled = false;
            (<HTMLButtonElement>document.getElementById("btnSingleStep")).disabled = false;
            (<HTMLButtonElement>document.getElementById("btnNextStep")).disabled = false;

            // .. set focus on the OS console display ...
            document.getElementById("display").focus();

            // ... Create and initialize the CPU (because it's part of the hardware)  ...
            _CPU = new Cpu();  // Note: We could simulate multi-core systems by instantiating more than one instance of the CPU here.
            _CPU.init();       //       There's more to do, like dealing with scheduling and such, but this would be a start. Pretty cool.
            //_CPU.test();
            // ... then set the host clock pulse ...
            _hardwareClockID = setInterval(Devices.hostClockPulse, CPU_CLOCK_INTERVAL);
            // .. and call the OS Kernel Bootstrap routine.
            _Kernel = new Kernel();
            _Kernel.krnBootstrap();  // _GLaDOS.afterStartup() will get called in there, if configured.

            //initializing memory stuff
            _Memory = new Memory(768);
            //console.log(_Memory.getMemory());
            _MemoryManager = new MemoryManager();
            _CpuScheduler = new CpuScheduler();
            _MemoryAllocation[0] = "-1";
            _MemoryAllocation[1] = "-1";
            _MemoryAllocation[2] = "-1";

            _Pcb0 = new PCB();
            _Pcb1 = new PCB();
            _Pcb2 = new PCB();
            _Pcb0.PC = 0;
            _Pcb1.PC = 256;
            _Pcb2.PC = 512;
            //draw memory table
            this.drawMemory();
        }

        public static hostBtnHaltOS_click(btn): void {
            Control.hostLog("Emergency halt", "host");
            Control.hostLog("Attempting Kernel shutdown.", "host");
            // Call the OS shutdown routine.
            _Kernel.krnShutdown();
            // Stop the interval that's simulating our clock pulse.
            clearInterval(_hardwareClockID);
            // TODO: Is there anything else we need to do here?
        }

        public static hostBtnReset_click(btn): void {
            // The easiest and most thorough way to do this is to reload (not refresh) the document.
            location.reload(true);
            // That boolean parameter is the 'forceget' flag. When it is true it causes the page to always
            // be reloaded from the server. If it is false or not specified the browser may reload the
            // page from its cache, which is not what we want.
        }

        public static hostBtnSingleStep_click(btn): void
        {
          if(_SingleStep == true)
          {
            _SingleStep = false;
            (<HTMLButtonElement>document.getElementById("btnSingleStep")).style.background = "white";
          }
          else
          {
            _SingleStep = true;
            (<HTMLButtonElement>document.getElementById("btnSingleStep")).style.background = "blue";
          }
        }

        public static hostBtnNextStep_click(btn): void
        {
          _CPU.isExecuting = true;
        }

        public static updateMemoryTable(row, cell, newCode)
        {
          _MemoryTable.rows[row].cells[cell + 1].innerHTML = newCode;
        }

        //draws memory table
        public static drawMemory(): void
        {
          _MemoryTable = <HTMLTableElement>document.getElementById("memoryTable");

          for(var i = 0; i < 96; i++)
          {
            if(i == 96)
            {
              var tr = document.createElement("tr");
              tr.id = "bottomRow";
              _MemoryTable.appendChild(tr);
            }
            else
            {
                var tr = document.createElement("tr");
                _MemoryTable.appendChild(tr);
            }
            for(var j = 0; j < 9; j++)
            {
              if(j == 0)
              {
                var td = document.createElement("td");
                //td.innerHTML = "0x";
                td.innerHTML += "00" + i.toString();
              }
              else
              {
                var td = document.createElement("td");
                td.innerHTML = "00";
              }
                tr.appendChild(td);
            }

            //add the line
            //var s = document.createElement("s");
            //s.innerHTML = "<br>";
            //_MemoryTable.appendChild(s);

          }
        }

        public static clearMemoryTable()
        {
          for(var row = 0; row < 96; row++)
          {
            for(var cell = 1; cell < 9; cell++)
            {
              _MemoryTable.rows[row].cells[cell].innerHTML = "00";
            }
          }
        }


    }
}
