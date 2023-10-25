import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller("songs")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getSongs() {
    return this.appService.getSongs();
  }

  @Post()
  postSong(@Body() body): void {
    const { artist, title } = body;
    this.appService.createSong(artist, title);
  }

}
