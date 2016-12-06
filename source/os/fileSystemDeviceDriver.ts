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
              blank+="~";
            }
            sessionStorage.setItem(this.keyGenerator(t,s,b), blank);
          }
        }
      }

      this.createTable();
    }

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
    public createFile()
    {

    }

  }

}
