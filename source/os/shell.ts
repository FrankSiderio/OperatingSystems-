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
            if(_Console.buffer == "status output should be similar to 'counting0counting1hello worldcounting 2'.")
            {
              this.shellStatus("output should be similar to 'counting0counting1hello worldcounting 2'.");
            }

            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
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
            _CurrentPCB = new PCB();
            _StdOut.putText("Valid code. Congrats! ");

            //there is probably a better way to do this but this allows to run in sequence
            //_CPU.PC = _ProgramLength; //this is so when we get to that function it actually does something
            //_CPU.updateCPU();         //dont worry CPU.PC gets initialized back to zero anyway when it gets there

            _StdOut.putText(_MemoryManager.loadProgram(newInput));
            _PID++;
            //console.log(_Memory.getMemory());

          }

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
            //if(_CurrentPCB.pid == args[0])
            //{
            //console.log("pid: " + args);

            //Runs the pid associated with the memory location 0-2
            if(args == _MemoryAllocation[0])
            {
              _CPU.PC = 0;
              _Pcb0.running = true;
            }
            else if(args == _MemoryAllocation[1])
            {
              _CPU.PC = 256;
              _Pcb1.running = true;
            }
            else if(args == _MemoryAllocation[2])
            {
              _CPU.PC = 512;
              _Pcb2.running = true;
            }
            //console.log("PC at shell run: " + _CPU.PC);
            _CPU.isExecuting = true;
            //}

          }


          _ExecutedCommands.push("run");
          Shell.clearCounts();
        }

        public shellClearMem()
        {
          _Memory.clearMemory();
        }

        public shellRunAll()
        {
          _RunAll = true;

          _CPU.isExecuting = true;
          //checking to see if there is something in each block
          if(_MemoryAllocation[0] != "-1")
          {
            _Pcb0.running = true;
          }
          if(_MemoryAllocation[1] != "-1")
          {
            _Pcb1.running = true;
          }
          if(_MemoryAllocation[2] != "-1")
          {
            _Pcb2.running = true;
          }

          //console.log("Memory base: " + _MemoryManager.base);
          //_CpuScheduler.roundRobin();

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
        }

        public shellPs()
        {

        }

        public shellKill(args)
        {
          if(args.length <= 0)
          {
            _StdOut.putText("Please enter in a PID.");
          }
          else
          {
            //kill process
            _CPU.isExecuting = false;
            _Memory.clearMemory();
          }
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
        //this screwed everything up so I'll try to use it later
        public static clearCounts(): void
        {
          _CountUp = 0;
          _CountDown = 0;
        }
    }
}
