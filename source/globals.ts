
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
const APP_NAME: string    = "Frank's Awesome OS";   // 'cause Bob and I were at a loss for a better name.
const APP_VERSION: string = "0.7";   // What did you expect?...I wanted to keep 007 though

const CPU_CLOCK_INTERVAL: number = 100;   // This is in ms (milliseconds) so 1000 = 1 second.

const TIMER_IRQ: number = 0;  // Pages 23 (timer), 9 (interrupts), and 561 (interrupt priority).
                              // NOTE: The timer is different from hardware/host clock pulses. Don't confuse these.
const KEYBOARD_IRQ: number = 1;
const CONTEXT_SWITCH_IRQ: number = 7;
const CREATE_FILE_IRQ: number = 5;
const WRITE_FILE_IRQ: number = 4;
const READ_FILE_IRQ: number = 3;
const DELETE_FILE_IRQ: number = 2;

//for change/checking the states of the pcbs
const TERMINATED: string = "Terminated";
const RUNNING: string = "Running";
const WAITING: string = "Waiting";

const DEFAULT_FILE_NAME: string = "Process-"; //the default file name for a process going into the disk
//
// Global Variables
// TODO: Make a global object and use that instead of the "_" naming convention in the global namespace.
//
var _CPU: TSOS.Cpu;  // Utilize TypeScript's type annotation system to ensure that _CPU is an instance of the Cpu class.

var _OSclock: number = 0;  // Page 23.

var _Mode: number = 0;     // (currently unused)  0 = Kernel Mode, 1 = User Mode.  See page 21.

var _Canvas: HTMLCanvasElement;         // Initialized in Control.hostInit().
var _DrawingContext: any; // = _Canvas.getContext("2d");  // Assigned here for type safety, but re-initialized in Control.hostInit() for OCD and logic.
var _DefaultFontFamily: string = "sans";        // Ignored, I think. The was just a place-holder in 2008, but the HTML canvas may have use for it.
var _DefaultFontSize: number = 13;
var _FontHeightMargin: number = 4;              // Additional space added to font size when advancing a line.

var _Trace: boolean = true;  // Default the OS trace to be on.

var _TurnAroundTime = new Array<number>();
var _WaitTime = new Array<number>();

var _Priority: number = 10;
var _PriorityAlg: boolean = false;
var _DefaultPriority: number = 10;
var _FCFS: boolean = false; //this is so we know when we used fcfs so we make sure the global variable for scheduling is correct

// The OS Kernel and its queues.
var _Kernel: TSOS.Kernel;
var _KernelInterruptQueue;          // Initializing this to null (which I would normally do) would then require us to specify the 'any' type, as below.
var _KernelInputQueue: any = null;  // Is this better? I don't like uninitialized variables. But I also don't like using the type specifier 'any'
var _KernelBuffers: any[] = null;   // when clearly 'any' is not what we want. There is likely a better way, but what is it?

var _CpuScheduler: TSOS.CpuScheduler;

// Standard input and output
var _StdIn;    // Same "to null or not to null" issue as above.
var _StdOut;

// UI
var _Console: TSOS.Console;
var _OsShell: TSOS.Shell;

// At least this OS is not trying to kill you. (Yet.)
var _SarcasticMode: boolean = false;

// Global Device Driver Objects - page 12
var _krnKeyboardDriver; //  = null;

var _hardwareClockID: number = null;

// For testing (and enrichment)...
var Glados: any = null;  // This is the function Glados() in glados.js on Labouseur.com.
var _GLaDOS: any = null; // If the above is linked in, this is the instantiated instance of Glados.

//Memory stuff
var _MemoryTable: any = null; // Memory table
var _MemoryManager: any = null;
var _Memory: any = null;
var _MemoryArray = new Array<string>();
var _ProgramLength = new Array<number>(); //contains program lengths for each program
var _ProgramSize = 256; //size of our biggest program
var _MemoryAllocation = new Array<string>(); // Array that contains the pids that are loaded into memory
var _ResidentList: any[] = [];
var _ReadyQueue: any[] = [];
var _CurrentMemoryBlock: number = -1;
var _RunnablePIDs: any[] = [];
var _RunningPID: any = null;

var _SingleStep: boolean = false;
var _CurrentPCB: any = null;
var _State = "Not Running"; //to update the PCB with

var _Pcb0: any = null;
var _Pcb1: any = null;
var _Pcb2: any = null;
var _PcbDisk = new Array();

var _Quantum: number = 6;
var _QuantumCounter: number = 0;
var _SchedulingAlgorithm = "rr"; //round robin is the default schedule
var _ScheduleCounter = 0;
var _RunAll: boolean = false;

var _ConsoleBuffers = new Array<string>(); //this is for line wrap keeps track of the buffer previous when the next line is advanced

var _ExecutedCommands = new Array<string>();  // Keeps track of all the commands enter
var _CountUp: number = 0; // Keeps count of up key presses
var _CountDown: number = 0; // Keeps count of down key presses
var _ExecutedCommandsPointer: number = null; // This points to where we are in the executedCommands list where scrolling through with the arrow keys
var _PID: number = 0; // pid

var _LineCount: number = 0;
var _LastCharOnLine = "";
var _LastCursorPosition: number = 0;

var _SwappedProgram = "";
var _ProgramCounter = 0;

//hardrive stuff
var _HardDriveTable: any = null;
var _FileSystem: any = null;
var _ListOfFiles = new Array<string>(); //for keeping track of the files on the disk...easier than going through the disk
var _Format: boolean = false;

var onDocumentLoad = function() {
	TSOS.Control.hostInit();
};
