import { Controller, Delete, Get, Param, Post, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiService } from './api.service';
import { getHash } from 'src/common/utils';
import { Response } from 'express';
import { IFile } from './interfaces/file.interfaces';

@Controller('files')
export class ApiController {
  constructor(private readonly apiService: ApiService) { }

  @Post()
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
  async saveFiles(@UploadedFiles() files: Array<Express.Multer.File>): Promise<{ publicKey: string; privateKey: string; }> {
    const { publicKey, privateKey } = await this.apiService.saveFile(files);
    return { publicKey, privateKey };
  }

  @Get(':publicKey')
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
