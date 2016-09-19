///<reference path="../globals.ts" />
///<reference path="deviceDriver.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* ----------------------------------
   DeviceDriverKeyboard.ts

   Requires deviceDriver.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */
var TSOS;
(function (TSOS) {
    // Extends DeviceDriver
    var DeviceDriverKeyboard = (function (_super) {
        __extends(DeviceDriverKeyboard, _super);
        function DeviceDriverKeyboard() {
            // Override the base method pointers.
            // The code below cannot run because "this" can only be
            // accessed after calling super.
            //super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            _super.call(this);
            this.driverEntry = this.krnKbdDriverEntry;
            this.isr = this.krnKbdDispatchKeyPress;
        }
        DeviceDriverKeyboard.prototype.krnKbdDriverEntry = function () {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        };
        DeviceDriverKeyboard.prototype.krnKbdDispatchKeyPress = function (params) {
            // Parse the params.    TODO: Check that the params are valid and osTrapError if not.
            var keyCode = params[0];
            var isShifted = params[1];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            var chr = "";
            // Check to see if we even want to deal with the key that was pressed.
            if (((keyCode >= 65) && (keyCode <= 90)) ||
                ((keyCode >= 97) && (keyCode <= 123))) {
                // Determine the character we want to display.
                // Assume it's lowercase...
                chr = String.fromCharCode(keyCode + 32);
                // ... then check the shift key and re-adjust if necessary.
                if (isShifted) {
                    chr = String.fromCharCode(keyCode);
                }
                // TODO: Check for caps-lock and handle as shifted if so.
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 222 && isShifted == false) {
                chr = String.fromCharCode(39);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 222 && isShifted == true) {
                chr = String.fromCharCode(34);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 186 && isShifted == false) {
                chr = String.fromCharCode(59);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 186 && isShifted == true) {
                chr = String.fromCharCode(58);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 57 && isShifted == true) {
                chr = String.fromCharCode(40);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 48 && isShifted == true) {
                chr = String.fromCharCode(41);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 56 && isShifted == true) {
                chr = String.fromCharCode(42);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 55 && isShifted == true) {
                chr = String.fromCharCode(38);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 54 && isShifted == true) {
                chr = String.fromCharCode(94);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 53 && isShifted == true) {
                chr = String.fromCharCode(37);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 52 && isShifted == true) {
                chr = String.fromCharCode(36);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 51 && isShifted == true) {
                chr = String.fromCharCode(35);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 50 && isShifted == true) {
                chr = String.fromCharCode(64);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 49 && isShifted == true) {
                chr = String.fromCharCode(33);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 191 && isShifted == false) {
                chr = String.fromCharCode(47);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 191 && isShifted == true) {
                chr = String.fromCharCode(63);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 190 && isShifted == false) {
                chr = String.fromCharCode(46);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 190 && isShifted == true) {
                chr = String.fromCharCode(62);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 188 && isShifted == false) {
                chr = String.fromCharCode(44);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 188 && isShifted == true) {
                chr = String.fromCharCode(60);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 219 && isShifted == false) {
                chr = String.fromCharCode(91);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 219 && isShifted == true) {
                chr = String.fromCharCode(123);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 221 && isShifted == false) {
                chr = String.fromCharCode(93);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 221 && isShifted == true) {
                chr = String.fromCharCode(125);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 220 && isShifted == false) {
                chr = String.fromCharCode(92);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 220 && isShifted == true) {
                chr = String.fromCharCode(124);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 189 && isShifted == false) {
                chr = String.fromCharCode(45);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 189 && isShifted == true) {
                chr = String.fromCharCode(95);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 187 && isShifted == false) {
                chr = String.fromCharCode(61);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 187 && isShifted == true) {
                chr = String.fromCharCode(43);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 192 && isShifted == false) {
                chr = String.fromCharCode(96);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 192 && isShifted == true) {
                chr = String.fromCharCode(126);
                _KernelInputQueue.enqueue(chr);
            }
            else if (((keyCode >= 48) && (keyCode <= 57)) ||
                (keyCode == 32) ||
                (keyCode == 13)) {
                chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);
            }
        };
        return DeviceDriverKeyboard;
    }(TSOS.DeviceDriver));
    TSOS.DeviceDriverKeyboard = DeviceDriverKeyboard;
})(TSOS || (TSOS = {}));
