import { Injectable } from '@nestjs/common';
import { Song } from './song';

@Injectable()
export class AppService {

  private songs = [];

  getHello(): string {
    return 'Hello World!';
  }

  getRandomNumber(): number {
    return Math.floor(Math.random() * 100) + 1;
  }

  getSongs(): Song[] {
    return this.songs;
  }

  createSong(artist: string, title: string): void {

    const song = new Song(artist, title);
    this.songs.push(song);
  }
}
