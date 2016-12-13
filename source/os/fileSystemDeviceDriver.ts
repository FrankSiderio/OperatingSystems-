///<reference path="../globals.ts" />

module TSOS
{
  export class fileSystemDeviceDriver
  {
    public tracks = 4;
    public blocks = 8;
    public sectors = 8;
    public metaSize = 4;
    public fileSize = 64;
    public loc = 100;

    public init()
    {
      sessionStorage.clear();

      for(var t = 0; t < this.tracks; t++)
      {
        for(var s = 0; s < this.sectors; s++)
        {
          for(var b = 0; b < this.blocks; b++)
          {
            var blank = "";
            for(var i = 0; i < this.fileSize; i++)
            {
              if(t == 0 && s == 0 && b == 0 && i == 4)
              {
                blank+="MBR";
              }
              blank+="~";
            }
            sessionStorage.setItem(this.keyGenerator(t,s,b), blank);
          }
        }
      }

      this.createTable();
    }

    //this also updates the table
    public createTable()
    {
      var table = " <thead><tr><th> T S B  </th><th> Meta   </th><th> Data  </th></tr>";
      for(var t = 0; t < this.tracks; t++)
      {
        for(var s = 0; s < this.sectors; s++)
        {
          for(var b = 0; b < this.blocks; b++)
          {
            var data = sessionStorage.getItem(this.keyGenerator(t, s, b));
            var meta = (data.substr(0, 4));

            data = data.substr(4, 60);

            var key = this.keyGenerator(t, s, b);
            table += "<tr><td>"+key+"</td><td>"+meta+"</td><td>"+data+"</td></tr>";
          }
        }
      }

      _HardDriveTable.innerHTML = table;

    }
    public keyGenerator(t, s, b)
    {
        return (t + "" + s + "" + b);
    }

    public createFile(name)
    {
      if(_Format == false)
      {
        if(_SarcasticMode == true)
        {
          _StdOut.putText("You bitch. You know it's not formatted you smart ass.");
        }
        else
        {
          _StdOut.putText("Please format the disk first");
        }
      }
      else
      {
        //setting name to it's hex value
        name = this.stringToHex(name);

        //get the next available block
        var freeBlock = this.findNextAvailableBlock();
        var freeDirtyBlock = this.findNextDirtyBlock();
        console.log("Free dirty block: " + freeDirtyBlock);

        //setting the meta and data to put into the table
        var meta = "1" + freeDirtyBlock;
        var data = meta + name;

        for(var i = data.length; i < this.fileSize; i++)
        {
          data+="~";
        }

        sessionStorage.setItem(freeBlock, data);

        //add to the list of files
        _ListOfFiles.push(name);
        this.createTable();
      }
    }

    public writeFile(file, write)
    {
      if(_Format == false)
      {
        if(_SarcasticMode == true)
        {
          _StdOut.putText("Are you trying to be sarcastic? It's not funny...");
        }
        else
        {
          _StdOut.putText("Please format the disk first");
        }
      }
      var hexFileName = this.stringToHex(file);
      for(var i = hexFileName.length; i < (this.fileSize - 4); i++)
      {
        hexFileName+="~";
      }

      console.log("File: " + file);
      console.log("Writing: " + write);

      //find which file to write to using a linear search
      for(var t = 0; t < this.tracks; t++)
      {
        for(var s = 0; s < this.sectors; s++)
        {
          for(var b = 0; b < this.blocks; b++)
          {
            //getting the meta block
            var key = this.keyGenerator(t, s, b);
            var value = sessionStorage.getItem(key);
            var data = value.substr(4, 64);
            var meta = value.substr(1, 3);

            //found the file
            if(hexFileName == data)
            {
              //now lets write
              write = this.stringToHex(write);
              write = key + write;
              write = "1" + write; //setting the in-use bit so we know it's in use

              sessionStorage.setItem(meta, write);
              this.createTable();

              //break
              t = this.tracks + 1;
              s = this.sectors + 1;
              b = this.blocks + 1;
            }

          }
        }
      }

    }

    public readFile(fileName)
    {
      fileName = this.stringToHex(fileName);

      for(var t = 0; t < this.tracks; t++)
      {
        for(var s = 0; s < this.sectors; s++)
        {
          for(var b = 0; b < this.blocks; b++)
          {
            var key = this.keyGenerator(t, s, b);
            var value = sessionStorage.getItem(key);
            var data = value.substr(4, fileName.length);

            if(data == fileName)
            {
              console.log("Found the file!");
              var meta = value.substr(1, 3);
              var fileContent = sessionStorage.getItem(meta);
              fileContent = fileContent.substr(4, fileContent.length); //taking out the meta portion

              console.log("File content: " + fileContent);
              fileContent = this.hexToString(fileContent);
              _StdOut.putText(fileContent);
            }
          }
        }
      }
    }

    //finds the next abailable block on the disk
    public findNextAvailableBlock()
    {
      var freeKey;

      for(var t = 0; t < this.tracks; t++)
      {
        for(var s = 0; s < this.sectors; s++)
        {
          for(var b = 0; b < this.blocks; b++)
          {
            //getting the meta block
            var key = this.keyGenerator(t, s, b);
            var value = sessionStorage.getItem(key);
            var data = value.substr(4, 1);

            if(data == "~") //checking the in-use bit
            {
              freeKey = key;
              //breaking out of the loop
              t = this.tracks + 1;
              s = this.sectors + 1;
              b = this.blocks + 1;
            }
          }
        }
      }

      return freeKey;
    }

    //This is for finding the next block to write to...so it should start from 100 and the next one would be 101
    public findNextDirtyBlock()
    {
      var freeDirtyKey;

      for(var t = 1; t < this.tracks; t++)
      {
        for(var s = 0; s < this.sectors; s++)
        {
          for(var b = 0; b < this.blocks; b++)
          {
            //getting the meta block
            var key = this.keyGenerator(t, s, b);
            var value = sessionStorage.getItem(key);
            var data = value.substr(4, 1);

            if(data == "~") //checking the in-use bit
            {
              sessionStorage.setItem(key, "000");
              freeDirtyKey = key;
              //breaking out of the loop
              t = this.tracks + 1;
              s = this.sectors + 1;
              b = this.blocks + 1;
            }
          }
        }
      }

      return freeDirtyKey;
    }




    //converts a string into a hex value
    public stringToHex(s)
    {
      var hexString = "";

      for(var i = 0; i < s.length; i++)
      {
        hexString += s.charCodeAt(i).toString(16);
      }

      return hexString;
    }

    //converts a hex value into a string
    public hexToString(hex)
    {
      var s = '';
      for (var i = 0; i < hex.length; i += 2)
      {
        var v = parseInt(hex.substr(i, 2), 16);
        if (v) s += String.fromCharCode(v);
      }

      return s;
    }


  }

}
