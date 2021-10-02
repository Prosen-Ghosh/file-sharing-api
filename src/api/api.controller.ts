import { Controller, Delete, Get, Param, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiService } from './api.service';

@Controller('files')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  saveFiles(@UploadedFiles() files: Array<Express.Multer.File>): Array<Express.Multer.File> {
    console.log(files);
    return files;
  }

  @Get(':publicKey')
  getFiles(@Param('publicKey') publicKey: string): string {
    console.log("publicKey: ", publicKey)
    return publicKey;
  }

  @Delete(':publicKey')
  deleteFiles(@Param('publicKey') publicKey: string): string {
    console.log("publicKey: ", publicKey)
    return publicKey;
  }
}
