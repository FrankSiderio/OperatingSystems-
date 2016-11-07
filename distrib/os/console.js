///<reference path="../globals.ts" />
/* ------------
     Console.ts

     Requires globals.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */
var TSOS;
(function (TSOS) {
    var Console = (function () {
        function Console(currentFont, currentFontSize, currentXPosition, currentYPosition, buffer) {
            if (currentFont === void 0) { currentFont = _DefaultFontFamily; }
            if (currentFontSize === void 0) { currentFontSize = _DefaultFontSize; }
            if (currentXPosition === void 0) { currentXPosition = 0; }
            if (currentYPosition === void 0) { currentYPosition = _DefaultFontSize; }
            if (buffer === void 0) { buffer = ""; }
            this.currentFont = currentFont;
            this.currentFontSize = currentFontSize;
            this.currentXPosition = currentXPosition;
            this.currentYPosition = currentYPosition;
            this.buffer = buffer;
        }
        Console.prototype.init = function () {
            this.clearScreen();
            this.resetXY();
        };
        Console.prototype.clearScreen = function () {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        };
        Console.prototype.resetXY = function () {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        };
        Console.prototype.handleInput = function () {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) {
                    //console.log(_Console.buffer);
                    var totalBuffer = "";
                    //if we went to the next line
                    if (_ConsoleBuffers.length > 0) {
                        for (var x = 0; x < _ConsoleBuffers.length; x++) {
                            totalBuffer += _ConsoleBuffers[x]; //add the previous buffer
                        }
                        totalBuffer += this.buffer; //don't forget our current one
                        //console.log(totalBuffer);
                        _OsShell.handleInput(totalBuffer); //send her off
                        totalBuffer = ""; //reset the buffer
                        //reset the array
                        _ConsoleBuffers = [];
                    }
                    else {
                        _OsShell.handleInput(this.buffer);
                    }
                    // ... and reset our buffer.
                    this.buffer = "";
                }
                else {
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);
                    // ... and add it to our buffer.
                    this.buffer += chr;
                    //var bufferLength = _Console.buffer.length;
                    //line wrap
                    var canvas = document.getElementById("display");
                    var currentLength = TSOS.CanvasTextFunctions.measure(_DefaultFontFamily, _DefaultFontSize, _Console.buffer);
                    //console.log(currentLength);
                    //console.log(canvas.width);
                    //if the buffer is as long as the canvas width
                    if (currentLength >= canvas.width - 20) {
                        //advancing the line, setting the length back to 0 and resetting the buffer
                        this.advanceLine();
                        currentLength = 0;
                        //console.log(currentLength);
                        _ConsoleBuffers.push(_Console.buffer); //so when we have to execute the command we have the previous buffers
                        _Console.buffer = "";
                    }
                }
            }
        };
        //handles the backspace
        Console.prototype.handleBackspace = function () {
            var inputString = _Console.buffer;
            var cursorPosition = _Console.currentXPosition;
            var newBuffer = "";
            var lastChar = inputString[inputString.length - 1];
            for (var i = 0; i < inputString.length - 1; i++) {
                newBuffer += inputString[i];
            }
            if (_Console.buffer.length != 0) {
                //moves the cursor
                _Console.currentXPosition = cursorPosition - TSOS.CanvasTextFunctions.measure(_DefaultFontFamily, _DefaultFontSize, lastChar);
                _DrawingContext.fillStyle = "#DFDBC3";
                //replaces the character
                _DrawingContext.fillRect(_Console.currentXPosition, _Console.currentYPosition - _DefaultFontSize - 2, TSOS.CanvasTextFunctions.measure(_DefaultFontFamily, _DefaultFontSize, _Console.buffer.charAt(_Console.buffer.length - 1)), _DefaultFontSize + _FontHeightMargin + 4);
            }
            //Sets the new buffer
            _Console.buffer = newBuffer;
        };
        //handles the up key
        Console.prototype.upArrow = function () {
            //setting to the last executed command
            var command = _ExecutedCommands[_ExecutedCommands.length - _CountUp];
            _ExecutedCommandsPointer = _ExecutedCommands.length - _CountUp; //set the pointer
            //alert(_ExecutedCommandsPointer);
            //I dont think I need this
            if (command == null || command == "") {
                var command = _ExecutedCommands[_ExecutedCommands.length - 1];
            }
            //clear the buffer and text
            this.clearCommandLine();
            //setting the buffer (so the os completes the correct command)
            _Console.buffer = command;
            //puts the text on the cli
            this.putText(command);
        };
        //handles the down key
        Console.prototype.downArrow = function () {
            //alert(_ExecutedCommandsPointer);
            if (_ExecutedCommandsPointer != null) {
                //setting to the command previous
                var command = _ExecutedCommands[_ExecutedCommandsPointer + 1];
                this.clearCommandLine();
                _Console.buffer = command;
                this.putText(command);
                _ExecutedCommandsPointer = _ExecutedCommandsPointer + 1; //sets the pointer
            }
            //else if(_ExecutedCommandsPointer == 0 && _ExecutedCommands == null)
            //{
            //this.clearCommandLine();
            //}
        };
        //clears the command line
        Console.prototype.clearCommandLine = function () {
            var inputString = _Console.buffer;
            var cursorPosition = _Console.currentXPosition;
            var newBuffer = "";
            var length = TSOS.CanvasTextFunctions.measure(_DefaultFontFamily, _DefaultFontSize, inputString);
            //set the cursor
            _Console.currentXPosition = cursorPosition - length;
            _DrawingContext.fillStyle = "#DFDBC3";
            _DrawingContext.fillRect(_Console.currentXPosition, _Console.currentYPosition - _DefaultFontSize - 2, length, _DefaultFontSize + _FontHeightMargin + 4);
            _Console.buffer = newBuffer;
        };
        //handles tab for command completion
        Console.prototype.handleTab = function () {
            //this loop goes through all the commands and compares them to what is on the buffer
            for (var i = 0; i < _OsShell.commandList.length; i++) {
                if (_OsShell.commandList[i].command.search(_Console.buffer) == 0) {
                    this.clearCommandLine();
                    var c = _OsShell.commandList[i].command;
                    _Console.buffer = c;
                    this.putText(c);
                }
            }
        };
        Console.prototype.putText = function (text) {
            // My first inclination here was to write two functions: putChar() and putString().
            // Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
            // between the two.  So rather than be like PHP and write two (or more) functions that
            // do the same thing, thereby encouraging confusion and decreasing readability, I
            // decided to write one function and use the term "text" to connote string or char.
            //
            // UPDATE: Even though we are now working in TypeScript, char and string remain undistinguished.
            //         Consider fixing that.
            var lastChar;
            var currentLength = TSOS.CanvasTextFunctions.measure(_DefaultFontFamily, _DefaultFontSize, text);
            if (text !== "") {
                if ((this.currentXPosition + currentLength) < _Canvas.width) {
                    _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
                    // Move the current X position.
                    var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                    this.currentXPosition = this.currentXPosition + offset;
                    _LastCharOnLine = text;
                }
                else {
                    _LastCursorPosition = _Console.currentXPosition;
                    this.advanceLine();
                    _LineCount += 1;
                    this.currentXPosition = TSOS.CanvasTextFunctions.measure(_DefaultFontFamily, _DefaultFontSize, ">");
                    _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
                    var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                    this.currentXPosition = this.currentXPosition + offset;
                }
            }
        };
        Console.prototype.advanceLine = function () {
            this.currentXPosition = 0;
            /*
             * Font size measures from the baseline to the highest point in the font.
             * Font descent measures from the baseline to the lowest point in the font.
             * Font height margin is extra spacing between the lines.
             */
            //gets line height
            this.currentYPosition += _DefaultFontSize +
                _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                _FontHeightMargin;
            // TODO: Handle scrolling. (iProject 1)
            //scrolling
            var canvas = document.getElementById("display");
            var canvasContext = canvas.getContext("2d");
            if (this.currentYPosition >= canvas.height) {
                var moveDown = 13 + TSOS.CanvasTextFunctions.descent(this.currentFont, this.currentFontSize) + 4;
                var currentCanvas = canvasContext.getImageData(0, moveDown, canvas.width, canvas.height);
                canvasContext.putImageData(currentCanvas, 0, 0);
                this.currentYPosition = canvas.height - this.currentFontSize;
            }
        };
        return Console;
    }());
    TSOS.Console = Console;
})(TSOS || (TSOS = {}));
