import { BadRequestException, ConflictException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { unlinkSync } from 'fs';
import { IFile } from 'src/api/interfaces/file.interfaces';
import { StorageType } from '../../common/enums/StorageType.enum';
import { getHash } from 'src/common/utils';
import { LocalFileStorageService } from './../localFileStorage/localFileStorage.service';
import { GoogleFileStorageService } from '../googleFileStorage/googleFileStorage.service';
import * as fs from 'fs';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);

  private folderPath: string;
  private activePeriod: number;
  constructor(
    private config: ConfigService,
    private localFileStorageService: LocalFileStorageService,
    private googleFileStorageService: GoogleFileStorageService,
  ) {
    this.folderPath = this.config.get('folderPath');
    this.activePeriod = this.config.get('activePeriod');
  }
  async save(files: Array<Express.Multer.File>): Promise<IFile[]> {
    try {
      let provider: StorageType = this.config.get('provider');
      const { privateKey, publicKey } = this.generateKeys()
      let data: IFile[] = files.map((item) => {
        let path = `${this.folderPath}/${item.filename}`
        return {
          name: item.filename,
          provider,
          path,
          publicKey,
          privateKey,
        }
      });
      if (provider === StorageType.Google) {
        // await this.googleFileStorageService.saveFiles(files, publicKey)
      } else if (provider === StorageType.Local) {
        const path = await this.localFileStorageService.saveFiles(files, publicKey)
        if (path && typeof path === 'string') {
          data = data.map(d => {
            let local = JSON.parse(JSON.stringify(d));
            unlinkSync(local.path);
            return { ...d, path }
          })
        }
      }
      return data
    } catch (error) {
      this.logger.error(error)
      throw new ConflictException(error.message || 'Could not save the file!!')
    }
  }

  generateKeys() {
    let publicKey = getHash(`PUBLIC_SECRET_${Math.random()}`, 'sha512');
    let privateKey = getHash(`PRIVATE_SECRET_${publicKey}`, 'sha512');
    return {
      publicKey,
      privateKey,
    }
  }

  async cleanup(files) {
    this.logger.debug("CLEANUP CALL");
    files.forEach(file => {
      if(file && file.path) {
        if(fs.existsSync(file.path)){
          unlinkSync(file.path);
        }
      }
    });
  }
}
