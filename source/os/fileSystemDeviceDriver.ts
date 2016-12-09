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
      //removing the quotes
      name = name.replace(/"/g,"");

      //setting name to it's hex value
      name = this.stringToHex(name);

      //get the next available block
      var freeBlock = this.findNextAvailableBlock();
      //var freeDirtyBlock = this.findNextDirtyBlock();
      //console.log("Free block: " + freeBlock);

      //setting the meta and data to put into the table
      var meta = "1" + freeBlock;
      var data = meta + name;

      for(var i = data.length; i < this.fileSize; i++)
      {
        data+="~";
      }

      /*
      var fileData = "1---";
      for(var i = fileData.length; i < this.fileSize; i++)
      {
        fileData+="~";
      }
      */

      //console.log("Meta: " + meta);
      //console.log("Free block: " + freeBlock);
      //console.log("Data: " + data);

      //sessionStorage.setItem(freeDirtyBlock, data)
      sessionStorage.setItem(freeBlock, data);
      //console.log("Whats here: " + sessionStorage.getItem(this.keyGenerator(0,0,0)));

      //add to the list of files
      _ListOfFiles.push(name);
      this.createTable();
    }

    public writeFile(file, write)
    {
      file = file.replace(/"/g,"");
      write = write.replace(/"/g,"");

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

            if(hexFileName == data)
            {
              console.log("File Found!");
              console.log("Key: " + key);
              console.log("Value: " + value);
              t = this.tracks + 1;
              s = this.sectors + 1;
              b = this.blocks + 1;
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

    /*
    public findNextDirtyBlock()
    {
      var freeDirtyKey;

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
    */



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
      var s = "";

      for(var i = 0; i < hex.length; i++)
      {
        s += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
      }

      return s;
    }


  }

}
