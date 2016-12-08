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
              if(i >= 0 && i <=3)
              {
                blank+="0";
              }
              else
              {
                blank+="~";
              }
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

      //get the next available block
      var freeBlock = this.findNextAvailableBlock();
      //console.log("Free block: " + freeBlock);

      //setting the meta and data to put into the table
      var meta = "1" + freeBlock;
      var data = meta + name;

      //console.log("Meta: " + meta);
      sessionStorage.setItem(freeBlock, data);
      //console.log("Whats here: " + sessionStorage.getItem(this.keyGenerator(0,0,0)));

      //add to the list of files
      _ListOfFiles.push(name);
      this.createTable();
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
            var data = value.substr(0, 4);

            //console.log("Meta block: " + data);
            if(data.substr(0, 1) == "0") //checking the in-use bit
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

  }

}
