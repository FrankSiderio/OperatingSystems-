/* ------------
   Globals.ts

   Global CONSTANTS and _Variables.
   (Global over both the OS and Hardware Simulation / Host.)

   This code references page numbers in the text book:
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */
//
// Global CONSTANTS (TypeScript 1.5 introduced const. Very cool.)
//																									//This one is better I think
var APP_NAME = "Frank's Awesome OS"; // 'cause Bob and I were at a loss for a better name.
var APP_VERSION = "0.7"; // What did you expect?...I wanted to keep 007 though
var CPU_CLOCK_INTERVAL = 100; // This is in ms (milliseconds) so 1000 = 1 second.
var TIMER_IRQ = 0; // Pages 23 (timer), 9 (interrupts), and 561 (interrupt priority).
// NOTE: The timer is different from hardware/host clock pulses. Don't confuse these.
var KEYBOARD_IRQ = 1;
var CONTEXT_SWITCH_IRQ = 7;
//
// Global Variables
// TODO: Make a global object and use that instead of the "_" naming convention in the global namespace.
//
var _CPU; // Utilize TypeScript's type annotation system to ensure that _CPU is an instance of the Cpu class.
var _OSclock = 0; // Page 23.
var _Mode = 0; // (currently unused)  0 = Kernel Mode, 1 = User Mode.  See page 21.
var _Canvas; // Initialized in Control.hostInit().
var _DrawingContext; // = _Canvas.getContext("2d");  // Assigned here for type safety, but re-initialized in Control.hostInit() for OCD and logic.
var _DefaultFontFamily = "sans"; // Ignored, I think. The was just a place-holder in 2008, but the HTML canvas may have use for it.
var _DefaultFontSize = 13;
var _FontHeightMargin = 4; // Additional space added to font size when advancing a line.
var _Trace = true; // Default the OS trace to be on.
var _TurnAroundTime = new Array();
var _WaitTime = new Array();
// The OS Kernel and its queues.
var _Kernel;
var _KernelInterruptQueue; // Initializing this to null (which I would normally do) would then require us to specify the 'any' type, as below.
var _KernelInputQueue = null; // Is this better? I don't like uninitialized variables. But I also don't like using the type specifier 'any'
var _KernelBuffers = null; // when clearly 'any' is not what we want. There is likely a better way, but what is it?
var _CpuScheduler = null;
// Standard input and output
var _StdIn; // Same "to null or not to null" issue as above.
var _StdOut;
// UI
var _Console;
var _OsShell;
// At least this OS is not trying to kill you. (Yet.)
var _SarcasticMode = false;
// Global Device Driver Objects - page 12
var _krnKeyboardDriver; //  = null;
var _hardwareClockID = null;
// For testing (and enrichment)...
var Glados = null; // This is the function Glados() in glados.js on Labouseur.com.
var _GLaDOS = null; // If the above is linked in, this is the instantiated instance of Glados.
//Memory stuff
var _MemoryTable = null; // Memory table
var _MemoryManager = null;
var _Memory = null;
var _MemoryArray = new Array();
var _ProgramLength = new Array(); //contains program lengths for each program
var _ProgramSize = 256; //size of our biggest program
var _MemoryAllocation = new Array(); // Array that contains the pids that are loaded into memory
var _SingleStep = false;
var _CurrentPCB = null;
var _State = "Not Running"; //to update the PCB with
var _Pcb0 = null;
var _Pcb1 = null;
var _Pcb2 = null;
var _Quantum = 6;
var _QuantumCounter = 0;
var _SchedulingAlgorithm = "rr"; //round robin is the default schedule
var _ScheduleCounter = 0;
var _RunAll = false;
var _ConsoleBuffers = new Array(); //this is for line wrap keeps track of the buffer previous when the next line is advanced
var _ExecutedCommands = new Array(); // Keeps track of all the commands enter
var _CountUp = 0; // Keeps count of up key presses
var _CountDown = 0; // Keeps count of down key presses
var _ExecutedCommandsPointer = null; // This points to where we are in the executedCommands list where scrolling through with the arrow keys
var _PID = 0; // pid
var _LineCount = 0;
var _LastCharOnLine = "";
var _LastCursorPosition = 0;
//hardrive stuff
var _HardDriveTable = null;
var _FileSystem = null;
var _ListOfFiles = new Array(); //for keeping track of the files on the disk...easier than going through the disk
var _Format = false;
var onDocumentLoad = function () {
    TSOS.Control.hostInit();
};
