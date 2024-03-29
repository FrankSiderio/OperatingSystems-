///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="shellCommand.ts" />
///<reference path="userCommand.ts" />
///<reference path="memoryManager.ts"/>
///<reference path="../host/memory.ts"/>


/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */

// TODO: Write a base class / prototype for system services and let Shell inherit from it.
// TODO: Enable more sarcasm so it's more fun for Alan to read

module TSOS {
    export class Shell {
        // Properties
        public promptStr = ">";
        public commandList = [];
        public curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
        public apologies = "[sorry]";

        constructor() {
        }

        public init() {
            var sc;
            //
            // Load the command list.

            // ver
            sc = new ShellCommand(this.shellVer,
                                  "ver",
                                  "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;

            // help
            sc = new ShellCommand(this.shellHelp,
                                  "help",
                                  "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;

            // shutdown
            sc = new ShellCommand(this.shellShutdown,
                                  "shutdown",
                                  "- Shuts down the virtual OS");
            this.commandList[this.commandList.length] = sc;

            // cls
            sc = new ShellCommand(this.shellCls,
                                  "cls",
                                  "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;

            // man <topic>
            sc = new ShellCommand(this.shellMan,
                                  "man",
                                  "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;

            // trace <on | off>
            sc = new ShellCommand(this.shellTrace,
                                  "trace",
                                  "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;

            // rot13 <string>
            sc = new ShellCommand(this.shellRot13,
                                  "rot13",
                                  "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;

            // prompt <string>
            sc = new ShellCommand(this.shellPrompt,
                                  "prompt",
                                  "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;

            //whereami command
            sc = new ShellCommand(this.shellWhereAmI, "whereami", "Tells you where you are.");
            this.commandList[this.commandList.length] = sc;

            //date and time command
            sc = new ShellCommand(this.shellDate, "date", "Displays the current date and time.");
            this.commandList[this.commandList.length] = sc;

            //joke command
            sc = new ShellCommand(this.shellJoke, "joke", "Tells a joke");
            this.commandList[this.commandList.length] = sc;

            //status command
            sc = new ShellCommand(this.shellStatus, "status", "<string> - Sets the status");
            this.commandList[this.commandList.length] = sc;

            //load command
            sc = new ShellCommand(this.shellLoad, "load", "loads user code from the text area");
            this.commandList[this.commandList.length] = sc;

            //bsod
            sc = new ShellCommand(this.shellBsod, "bsod", "blue screen of death");
            this.commandList[this.commandList.length] = sc;

            //run
            sc = new ShellCommand(this.shellRun, "run", "<pid> runs the specified program");
            this.commandList[this.commandList.length] = sc;

            //clearmem
            sc = new ShellCommand(this.shellClearMem, "clearmem", "clears memory");
            this.commandList[this.commandList.length] = sc;

            //runall
            sc = new ShellCommand(this.shellRunAll, "runall", "runs all programs at once");
            this.commandList[this.commandList.length] = sc;

            //quantum
            sc = new ShellCommand(this.shellQuantum, "quantum", "quantum <int> sets round robin");
            this.commandList[this.commandList.length] = sc;

            // ps  - list the running processes and their IDs
            sc = new ShellCommand(this.shellPs, "ps", "display the PIDs of all active processes");
            this.commandList[this.commandList.length] = sc;

            // kill <id> - kills the specified process id.
            sc = new ShellCommand(this.shellKill, "kill", "kill <pid> to kill an active process");
            this.commandList[this.commandList.length] = sc;

            //get schedule command
            sc = new ShellCommand(this.shellGetSchedule, "getschedule", "gets current selected scheduling algorithm");
            this.commandList[this.commandList.length] = sc;

            //set schedule command
            sc = new ShellCommand(this.shellSetSchedule, "setschedule", "sets scheduling algorithm");
            this.commandList[this.commandList.length] = sc;

            //format
            sc = new ShellCommand(this.shellFormat, "format", "initialize all blocks");
            this.commandList[this.commandList.length] = sc;

            //ls command
            sc = new ShellCommand(this.shellLs, "ls", "list all the different files stored on disk");
            this.commandList[this.commandList.length] = sc;

            //create file
            sc = new ShellCommand(this.shellCreate, "create", "create <filename>");
            this.commandList[this.commandList.length] = sc;

            //write file
            sc = new ShellCommand(this.shellWrite, "write", "write <filename> 'data'");
            this.commandList[this.commandList.length] = sc;

            //read file
            sc = new ShellCommand(this.shellRead, "read", "read <filename>");
            this.commandList[this.commandList.length] = sc;

            //delete file
            sc = new ShellCommand(this.shellDelete, "delete", "delete <filename>");
            this.commandList[this.commandList.length] = sc;

            //
            // Display the initial prompt.
            this.putPrompt();
        }

        public putPrompt() {
            _StdOut.putText(this.promptStr);
        }

        public handleInput(buffer) {
            _Kernel.krnTrace("Shell Command~" + buffer);
            //
            // Parse the input...
            //
            var userCommand = this.parseInput(buffer);
            // ... and assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;
            //
            // Determine the command and execute it.
            //
            // TypeScript/JavaScript may not support associative arrays in all browsers so we have to iterate over the
            // command list in attempt to find a match.  TODO: Is there a better way? Probably. Someone work it out and tell me in class.
            var index: number = 0;
            var found: boolean = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                } else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args);
            } else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + Utils.rot13(cmd) + "]") >= 0) {     // Check for curses.
                    this.execute(this.shellCurse);
                } else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {        // Check for apologies.
                    this.execute(this.shellApology);
                } else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        }

        // Note: args is an option parameter, ergo the ? which allows TypeScript to understand that.
        public execute(fn, args?) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();
            // ... call the command function passing in the args with some über-cool functional programming ...
            fn(args);
            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }
            // ... and finally write the prompt again.
            this.putPrompt();
        }

        public parseInput(buffer): UserCommand {
            var retVal = new UserCommand();

            // 1. Remove leading and trailing spaces.
            buffer = Utils.trim(buffer);

            // 2. Lower-case it.
            buffer = buffer.toLowerCase();

            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");

            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift();  // Yes, you can do that to an array in JavaScript.  See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;

            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        }

        //
        // Shell Command Functions.  Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        public shellInvalidCommand() {
            console.log(_Console.buffer);

            if(_Console.buffer == "sarcasticmode on")
            {
              _SarcasticMode = true;
              console.log("Wow. What a great idea this is.");
              alert("You aren't gonna regret this. ;)");
            }

            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, piece of s***,");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of a ******* ****** place.");
            } else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        }

        public shellCurse() {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        }

        public shellApology() {
           if (_SarcasticMode) {
              _StdOut.putText("I think we can put our differences behind us.");
              _StdOut.advanceLine();
              _StdOut.putText("For science . . . You monster.");
              _SarcasticMode = false;
           } else {
              _StdOut.putText("For what?");
           }
        }

        public shellVer(args) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
            _ExecutedCommands.push("ver");
            Shell.clearCounts();
        }

        public shellHelp(args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
            _ExecutedCommands.push("help");
            Shell.clearCounts();
        }

        public shellShutdown(args) {
             _StdOut.putText("Shutting down...");
             // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)

            _ExecutedCommands.push("shutdown");
            Shell.clearCounts();
        }

        public shellCls(args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();

            _ExecutedCommands.push("cli");
            Shell.clearCounts();
        }

        public shellWhereAmI(args)
        {
          _StdOut.putText("You are in front of a computer screen");
          _ExecutedCommands.push("whereami");
          Shell.clearCounts();
        }

        public shellDate(args)
        {
          //gets the date and time
          var displayDateAndTime = new Date().toString();

          _StdOut.putText(displayDateAndTime);
          _ExecutedCommands.push("dateandtime");
          Shell.clearCounts();
        }

        public shellJoke(args)
        {
          _StdOut.putText("Why did the plane crash?Because the pilot was a pineapple.");
          _ExecutedCommands.push("joke");
          Shell.clearCounts();
        }

        public shellStatus(args)
        {
          var status = "";

          //makes it look nice (deletes commas)
          for(var x = 0; x < args.length; x++)
          {
            status += args[x] + " ";
          }

          (<HTMLInputElement>document.getElementById("statusBox2")).value = status;

          _ExecutedCommands.push("status");
          Shell.clearCounts();
        }

        public shellLoad(args)
        {
          var input = (<HTMLInputElement>document.getElementById("taProgramInput")).value;
          var valid = true;

          //validate its hex
          for(var x = 0; input.length > x; x++)
          {
            if(input.charAt(x) == "0"){
            }else if(input.charAt(x) == '1'){
            }else if(input.charAt(x) == '2'){
            }else if(input.charAt(x) == '3'){
            }else if(input.charAt(x) == '4'){
            }else if(input.charAt(x) == '5'){
            }else if(input.charAt(x) == '6'){
            }else if(input.charAt(x) == '7'){
            }else if(input.charAt(x) == '8'){
            }else if(input.charAt(x) == '9'){
            }else if(input.charAt(x).toLocaleUpperCase() == 'A'){
            }else if(input.charAt(x).toLocaleUpperCase() == 'B'){
            }else if(input.charAt(x).toLocaleUpperCase() == 'C'){
            }else if(input.charAt(x).toLocaleUpperCase() == 'D'){
            }else if(input.charAt(x).toLocaleUpperCase() == 'E'){
            }else if(input.charAt(x).toLocaleUpperCase() == 'F'){
            }else if(input.charAt(x).toLocaleUpperCase() == 'G'){
            }else if(input.charAt(x) == ' '){
            }
            else
            {
                valid = false;
            }
          }

          //You don't want this to happen to you
          if(valid == false)
          {
            //Use this for torture later
            //alert("Yes. The infamous alert. That is the punishment you get for having incorrect input. HEX VALUES ONLY!");
            _StdOut.putText("Invalid code entered. Please try again");
            //console.log(inputString);
          }
          else
          {
            var newInput = input.replace(/\n/g, " " ).split( " " );
            var base = 0;
            var limit = 0;


            if(_CurrentMemoryBlock >= 2)
            {
              base = -1;
              limit = -1;
              _CurrentMemoryBlock++;
            }
            //if we are still loading less than 3 programs
            else if(_CurrentMemoryBlock < 2)
            {
              _CurrentMemoryBlock++;
              base = _CurrentMemoryBlock * 256;
              limit = (_CurrentMemoryBlock * 256) + 255;
            }

            _CurrentPCB = new PCB(); //setting the current pcb
            _CurrentPCB.priority = _Priority;
            //setting the base and limit for the current PCB
            if(_CurrentMemoryBlock <= 2)
            {
              _CurrentPCB.base = base;
              _CurrentPCB.limit = limit;
            }

            if(_CurrentMemoryBlock <= 2)
            {
              //setting the base in memory and then loading the program
              var pid = (_MemoryManager.loadProgram(_CurrentMemoryBlock, newInput));
              //_StdOut.putText(pid);
              //_StdOut.putText("PID: " + pid);
              //setting the current pcbs base and pid and then adding it to the runnable pids array
              _CurrentPCB.PC = base;
              _CurrentPCB.pid = _PID;
              //console.log("Current pcb pid: " + _CurrentPCB.pid);
              _RunnablePIDs.push(_CurrentPCB.pid);

              //This program is in memory
              _CurrentPCB.location = "Memory";
              //Adding it to the resident list
              _ResidentList.push(_CurrentPCB);

              _StdOut.putText("Valid code. Congrats! PID: " + _PID);
              _PID++;
            }

            //otherwise we need to load it onto the disk
            else if(_CurrentMemoryBlock > 2 && _Format == true)
            {
                console.log("Need to load onto disk!");
                //set the pid to the currentpcb pid then add it to the runnable pid list
                _CurrentPCB.pid = _PID;
                _RunnablePIDs.push(_CurrentPCB.pid);

                _CurrentPCB.location = "Disk";
                _CurrentPCB.base = -1;
                //_CurrentPCB.limit = -1;

                _ResidentList.push(_CurrentPCB);
                var fileName = DEFAULT_FILE_NAME + _PID;
                _FileSystem.createFile(fileName);

                var fileData = "";
                for(var i = 0; i < newInput.length; i++)
                {
                  if(newInput[i] != ",")
                  {
                    fileData += newInput[i];
                  }
                }
                //console.log("FILE DATA: " + fileData);

                fileData = _FileSystem.stringToHex(fileData);
                _FileSystem.writeFile(fileName, fileData);

                _StdOut.putText(fileName + " was created!");
                _StdOut.advanceLine();
                _StdOut.putText(">");

                _StdOut.putText("Valid code. Congrats! PID: " + _PID);
                _PID++;
            }
            else if(_Format == false)
            {
              if(_SarcasticMode == true)
              {
                _StdOut.putText("Ha. You are the smartest user i've seen.");
              }
              else
              {
                _StdOut.putText("Please format the disk first");
              }
            }
          }
          //console.log("Resident list: " + _ResidentList);
          //console.log(_Formatted);

          _ExecutedCommands.push("load");
          Shell.clearCounts();
        }

        public shellBsod(args)
        {
          _Kernel.krnTrapError("Oh no");
        }

        public shellRun(args)
        {
          if(args.length <= 0)
          {
            _StdOut.putText("Please enter in a PID.");
          }
          else
          {
            var runningPID = args[0];
            var validPID = false;

            //finding the pid the user has requested to run
            for(var i = 0; i < _ResidentList.length; i++)
            {
              //checking the pid entered with the pids in the array
              if(runningPID == _ResidentList[i].pid)
              {
                _CurrentPCB = _ResidentList[i];
                validPID = true;
              }
            }

            if(validPID == true)
            {
              if(_CurrentPCB.location === "Disk")
              {
                //swap to mem
                console.log("Need to swap from the disk");
                var opCode = _FileSystem.findProgram(_CurrentPCB.pid);
                opCode = _FileSystem.hexToString(opCode);
                console.log("OP CODE: " + opCode);
                _CpuScheduler.rollInOut(opCode);
              }
              _CPU.PC = _CurrentPCB.base;
              _CPU.isExecuting = true;
            }
          }
          _ExecutedCommands.push("run");
          Shell.clearCounts();
        }

        public shellClearMem()
        {
          _Memory.clearMemory();

          _ExecutedCommands.push("clearmem");
          Shell.clearCounts();
        }

        public shellRunAll()
        {
          _RunAll = true;
          //_MemoryManager.base = 0;
          _ReadyQueue = [];

          //adding the programs to the ready queue
          for(var i = 0; i < _ResidentList.length; i++)
          {
            _ReadyQueue.push(_ResidentList[i]);

            if(i > 0)
            {
              _ReadyQueue[i].state = WAITING;
            }
          }
          //console.log("Ready queue 0: " + _ReadyQueue[0].pid);
          _CurrentPCB = _ReadyQueue[0];
          //console.log("Current PCB PID: " + _CurrentPCB.pid);
          _CurrentPCB.state = RUNNING;
          _CPU.isExecuting = true;

          //console.log("Current PCB pid: " + _CurrentPCB.pid);

          _ExecutedCommands.push("runall");
          Shell.clearCounts();
        }

        public shellQuantum(args)
        {
          if(args.length <= 0)
          {
            _StdOut.putText("Please provide a quantum.");
          }
          else
          {
            _Quantum = args;
          }

          _ExecutedCommands.push("quantum");
          Shell.clearCounts();
        }

        public shellPs()
        {
          for(var i = 0; i < 3; i++)
          {
            if(_MemoryAllocation[i] != "-1")
            {
              _StdOut.putText("Running PID: " + _MemoryAllocation[i]);
              _StdOut.advanceLine();
            }
          }

          _ExecutedCommands.push("ps");
          Shell.clearCounts();
        }

        public shellKill(args)
        {
          if(args.length <= 0)
          {
            _StdOut.putText("Please enter in a PID.");
          }
          else
          {
            if(_SarcasticMode == true)
            {
              _StdOut.putText("I don't wanna and you can't stop me");
            }
            else
            {
              var pid = args[0];
              //removing from ready queue
              for(var i = 0; i < _ReadyQueue.length; i++)
              {
                if(pid == _ReadyQueue[i].pid)
                {
                  _ReadyQueue.splice(i, 1);
                }
              }
              //removing from runnable pid array
              for(var i = 0; i < _RunnablePIDs.length; i++)
              {
                var pidCheck = _RunnablePIDs[i];

                if(pid == pidCheck)
                {
                  _RunnablePIDs.splice(i, 1);
                }
              }
            }
          }

          _ExecutedCommands.push("kill");
          Shell.clearCounts();
        }

        public shellGetSchedule()
        {
          if(_SarcasticMode == true)
          {
            _StdOut.putText("Open your calendar app on your phone");
          }
          else
          {
            _StdOut.putText("The current selected schedule is: " + _SchedulingAlgorithm);
          }

          _ExecutedCommands.push("getschedule");
          Shell.clearCounts();
        }

        public shellSetSchedule(args)
        {
          if(args.length > 0)
          {
            if(args[0] == "rr" || args[0] == "fcfs" || args[0] == "priority")
            {
              _SchedulingAlgorithm = args[0];
              _StdOut.putText("Set schedule to: " + _SchedulingAlgorithm);
            }
            else
            {
              _StdOut.putText("You've entered in the wrong algorithm");
            }
          }
          else
          {
            //they used the command wrong
            if(_SarcasticMode == true)
            {
              _StdOut.putText("Hahahaha. You're so smart.");
            }
            else
            {
              _StdOut.putText("It looks like you used the command wrong.");
            }
          }

          _ExecutedCommands.push("setschedule");
          Shell.clearCounts();
        }

        public shellFormat()
        {
          //dont want user to format while programs are running
          if(_CPU.isExecuting == false)
          {
            _Format = true;
            _FileSystem.init();

            _FileSystem.displayMessage(1, "Format");
          }
          else
          {
            if(_SarcasticMode == true)
            {
              alert("NO");
            }
            else
            {
              _StdOut.putText("You cannot format disk will executing programs");
            }
          }
          _ExecutedCommands.push("format");
          Shell.clearCounts();
        }

        public shellLs()
        {
          //check if there are any files created first
          if(_ListOfFiles.length > 0)
          {
            for(var i = 0; i < _ListOfFiles.length; i++)
            {
              _StdOut.putText(_ListOfFiles[i]);
              _StdOut.advanceLine();
            }
          }
          else
          {
            _StdOut.putText("Sorry. You don't seem to have any files");
          }

          _ExecutedCommands.push("ls");
          Shell.clearCounts();
        }

        public shellCreate(args)
        {
          if(args.length > 0)
          {
            //removing the quotes
            var name = args[0].replace(/"/g,"");
            _FileSystem.createFile(name);
          }
          else
          {
            if(_SarcasticMode == true)
            {
              _StdOut.putText("Wow. Just wow. You must be so fricken smart");
            }
            else
            {
              _StdOut.putText("You must have used the create command incorectly. Try again");
            }
          }

          _FileSystem.displayMessage(1, "Creating file " + name);
          _ExecutedCommands.push("create");
          Shell.clearCounts();
        }

        public shellWrite(args)
        {
          if(args.length > 1)
          {
            var write = "";
            //combining what they want to write into one string
            for(var i = 1; i < args.length; i++)
            {
              write+=args[i];
              write+=" ";//adding a space after every word
            }

            //removing quotes
            var name = args[0].replace(/"/g,"");
            write = write.replace(/"/g,"");

            _FileSystem.writeFile(name, write);
          }
          else
          {
            _StdOut.putText("Use the command right");
          }

          _FileSystem.displayMessage(1, "Writing to file");
          _ExecutedCommands.push("write");
          Shell.clearCounts();
        }

        public shellRead(args)
        {
          if(args.length > 0)
          {
            //removing quotes first
            var name = args[0].replace(/"/g,"");
            _FileSystem.readFile(name);
          }
          else
          {
            if(_SarcasticMode == true)
            {
              _StdOut.putText("Use it right you piece of s***");
            }
            else
            {
              _StdOut.putText("It looks like you've used the command wrong. Try again");
            }
          }


          _ExecutedCommands.push("read");
          Shell.clearCounts();
        }

        public shellDelete(args)
        {
          if(args.length > 0)
          {
            var deleteFileName = args[0].replace(/"/g,"");
            _FileSystem.deleteFile(deleteFileName);
          }
          else
          {
            if(_SarcasticMode == true)
            {
              _StdOut.putText("You wanna maybe use the command right? Yes? No?");
            }
            else
            {
              _StdOut.putText("It looks like you've used the command wrong. Try again");
            }
          }

          _FileSystem.displayMessage(1, "Delete");
          _ExecutedCommands.push("delete");
          Shell.clearCounts();
        }

        public shellMan(args)
        {
            if (args.length > 0)
            {
                var topic = args[0];
                // TODO: Have some fun with this with sarcastic mode set to true
                switch (topic)
                {
                    case "help":
                        _StdOut.putText("Help displays a list of (hopefully) valid commands.");
                        break;
                    // TODO: Make descriptive MANual page entries for the the rest of the shell commands here.

                    case "whereami":
                      _StdOut.putText("Displays where you are. Kind of funny");
                      break;

                    case "ver":
                      _StdOut.putText("Displays the version of the operating system(which is awesome)");
                      break;

                    case "shutdown":
                      _StdOut.putText("Shuts down the os.");
                      break;

                    case "cls":
                      _StdOut.putText("Clears the screen completely and resets the position");
                      break;

                    case "man":
                      _StdOut.putText("Gives a description for the given topic");
                      break;

                    case "trace":
                      _StdOut.putText("Can enable or disable os trace. Example: trace on");
                      break;

                    case "rot13":
                      _StdOut.putText("Does rot13 obfuscation on a given string");
                      break;

                    case "prompt":
                      _StdOut.putText("Sets the prompt with a given string");
                      break;

                    case "dateandtime":
                      _StdOut.putText("Hopefully displays the right date.");
                      break;

                    case "joke":
                      _StdOut.putText("Best command in the os. Tells a funny joke");
                      break;

                    case "status":
                      _StdOut.putText("Sets a status at the top bar. Example: status I love os!");
                      break;

                    case "load":
                      _StdOut.putText("Loads code from the user program input box. Hex only.");
                      break;

                    case "bsod":
                      _StdOut.putText("Blue screen of death yay!");
                      break;

                    case "run":
                      _StdOut.putText("Runs the loaded program from memory. Run <pid>.");

                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            }

            else
            {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
            _ExecutedCommands.push("man");
            Shell.clearCounts();
        }

        public shellTrace(args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        } else {
                            _Trace = true;
                            _StdOut.putText("Trace ON");
                        }
                        break;
                    case "off":
                        _Trace = false;
                        _StdOut.putText("Trace OFF");
                        break;
                    default:
                        _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.");
                }
            } else {
                _StdOut.putText("Usage: trace <on | off>");
            }
            _ExecutedCommands.push("trace");
            Shell.clearCounts();
        }

        public shellRot13(args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + Utils.rot13(args.join(' ')) +"'");
            } else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
            _ExecutedCommands.push("rot13");
            Shell.clearCounts();
        }

        public shellPrompt(args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            } else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
            _ExecutedCommands.push("prompt");
            Shell.clearCounts();
        }
        //clears the counts (this is better than executing these two lines every time a command is completed plus I am lazy)
        public static clearCounts(): void
        {
          _CountUp = 0;
          _CountDown = 0;
        }
    }
}
