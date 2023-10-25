
export class Song {
    private readonly id: number;
    private _artist: string;
    private _title: string;
  
    constructor(artist: string, title: string) {
      this._artist = artist;
      this._title = title;
      this.id = new Date().getTime();
    }
  
    get artist(): string {
      return this._artist;
    }
  
    public get title(): string {
      return this._title;
    }
  
    public set artist(artist: string) {
      this._artist = artist;
    }
  
    public set title(title: string) {
      this._title = title;
    }
  
  
    getInfo() {
      return `artist: ${this._artist} | title: ${this._title}`;
    }
  }