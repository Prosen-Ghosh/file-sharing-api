import { Controller, Delete, Get, Param, Post, Res, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiService } from './api.service';
import { getHash } from '../common/utils';
import { Response } from 'express';
import { IFile } from './interfaces/file.interfaces';
import { CleanUpService } from '../services';
import { ConfigService } from '@nestjs/config';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('files')
export class ApiController {
  constructor(
    private readonly apiService: ApiService,
    private readonly cleanUpService: CleanUpService,
    private readonly configService: ConfigService) { 
      this.cleanUpService.addInterval('File Clean Up', this.configService.get('inactivity'))
    }

  @Post()
  @UseGuards(ThrottlerGuard)
  @UseInterceptors(FilesInterceptor('files', 10, {
    storage: diskStorage({ //setting up file saving configuration
      filename: (req, file, cb) => {
        const fileExtension = extname(file.originalname);
        const hash = getHash(`${file.originalname}_${Math.random()}`);
        cb(null, `${hash}${fileExtension}`);
      },
      destination: process.env.FOLDER || 'uploads'
    })
  }))
  async saveFiles(@UploadedFiles() files: Array<Express.Multer.File>, @Res() res: Response): Promise<any> {
    const { publicKey, privateKey } = await this.apiService.saveFile(files);
    return res.status(201).send( { publicKey, privateKey });
  }

  @Get(':publicKey')
  @UseGuards(ThrottlerGuard)
  async getFiles(@Param('publicKey') publicKey: string, @Res() res: Response): Promise<any> {
    console.log("publicKey: ", publicKey)
    const data: IFile = await this.apiService.findByPublicKey(publicKey);

    if (data) {
      return res.download(data.path);
    }
    return res.send({
      message: "Public Key Invalid"
    });
  }

  @Delete(':publicKey')
  @UseGuards(ThrottlerGuard)
  async deleteFiles(@Param('publicKey') publicKey: string, @Res() res: Response): Promise<any> {
    try {
      const data = await this.apiService.removeByPublicKey(publicKey);
      console.log(data)
      if (data) {
        return res.send({
          message: "File Deleted Successfully",
          data
        })
      }
      return res.send({
        message: "File Delete Action Failed"
      })
    } catch (err) {

    }
  }
}
