///<reference path="../globals.ts" />

/* ------------
     Console.ts

     Requires globals.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */

module TSOS {

    export class Console {

        constructor(public currentFont = _DefaultFontFamily,
                    public currentFontSize = _DefaultFontSize,
                    public currentXPosition = 0,
                    public currentYPosition = _DefaultFontSize,
                    public buffer = "") {
        }

        public init(): void {
            this.clearScreen();
            this.resetXY();
        }

        private clearScreen(): void {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        }

        private resetXY(): void {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        }

        public handleInput(): void {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();

                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) { //     Enter key

                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    _OsShell.handleInput(this.buffer);
                    // ... and reset our buffer.
                    this.buffer = "";
                }

                else {
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);
                    // ... and add it to our buffer.
                    this.buffer += chr;
                }
                // TODO: Write a case for Ctrl-C.
            }
        }



        //handles the backspace
        public handleBackspace(): void
        {
          var inputString = _Console.buffer;
          var cursorPosition = _Console.currentXPosition;
          var newBuffer= "";
          var lastChar = inputString[inputString.length-1];

          for(var i=0; i<inputString.length-1; i++)
          {
            newBuffer += inputString[i];
          }

          if(_Console.buffer.length != 0)
          {

            //moves the cursor
            _Console.currentXPosition = cursorPosition - CanvasTextFunctions.measure(_DefaultFontFamily, _DefaultFontSize, lastChar);
            _DrawingContext.fillStyle = "#DFDBC3";

            //replaces the character
            _DrawingContext.fillRect(_Console.currentXPosition, _Console.currentYPosition - _DefaultFontSize - 2, CanvasTextFunctions.measure(_DefaultFontFamily, _DefaultFontSize, _Console.buffer.charAt(_Console.buffer.length - 1)), _DefaultFontSize + _FontHeightMargin + 4);

          }

          //Sets the new buffer
          _Console.buffer = newBuffer;
        }

        //handles the up key
        public upArrow(): void
        {
          //setting to the last executed command
          var command = _ExecutedCommands[_ExecutedCommands.length - _CountUp];
          _ExecutedCommandsPointer = _ExecutedCommands.length - _CountUp; //set the pointer
          //I dont think I need this
          if(command == null || command == "")
          {
            var command = _ExecutedCommands[_ExecutedCommands.length - 1];
          }

          //clear the buffer and text
          this.clearCommandLine();

          //setting the buffer (so the os completes the correct command)
          _Console.buffer = command;
          //puts the text on the cli
          this.putText(command);
        }

        //handles the down key
        public downArrow(): void
        {
          if(_ExecutedCommandsPointer != 0)
          {
            //setting to the command previous
            var command = _ExecutedCommands[_ExecutedCommandsPointer + 1];
            this.clearCommandLine();
            _Console.buffer = command;
            this.putText(command);
            _ExecutedCommandsPointer = _ExecutedCommandsPointer + 1; //sets the pointer
          }
        }

        //clears the command line
        private clearCommandLine(): void
        {
          var inputString = _Console.buffer;
          var cursorPosition = _Console.currentXPosition;
          var newBuffer= "";
          var length = CanvasTextFunctions.measure(_DefaultFontFamily, _DefaultFontSize, inputString);

          //set the cursor
          _Console.currentXPosition = cursorPosition - length;
          _DrawingContext.fillStyle = "#DFDBC3";

          _DrawingContext.fillRect(_Console.currentXPosition, _Console.currentYPosition - _DefaultFontSize - 2, length, _DefaultFontSize + _FontHeightMargin + 4);
        }

        public putText(text): void {
            // My first inclination here was to write two functions: putChar() and putString().
            // Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
            // between the two.  So rather than be like PHP and write two (or more) functions that
            // do the same thing, thereby encouraging confusion and decreasing readability, I
            // decided to write one function and use the term "text" to connote string or char.
            //
            // UPDATE: Even though we are now working in TypeScript, char and string remain undistinguished.
            //         Consider fixing that.
            if (text !== "")
            {
                // Move the current X position.
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);

                // Draw the text at the current X and Y coordinates.
                _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
                this.currentXPosition = this.currentXPosition + offset;



            }
         }


        public advanceLine(): void {
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
            var canvas = <HTMLCanvasElement> document.getElementById("display");
            var canvasContext = canvas.getContext("2d");

            if(this.currentYPosition >= canvas.height)
            {
              var moveDown = 13 + CanvasTextFunctions.descent(this.currentFont, this.currentFontSize) + 4;
              var currentCanvas = canvasContext.getImageData(0, moveDown, canvas.width, canvas.height);

              canvasContext.putImageData(currentCanvas, 0, 0);
              this.currentYPosition = canvas.height - this.currentFontSize;
            }


        }




    }
 }
