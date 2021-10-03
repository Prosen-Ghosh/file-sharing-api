import { BadRequestException, ConflictException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { unlinkSync } from 'fs';
import { IFile } from 'src/api/interfaces/file.interfaces';
import { StorageType } from '../../common/enums/StorageType.enum';
import { getHash } from 'src/common/utils';
import { LocalFileStorageService } from './../localFileStorage/localFileStorage.service';
import { GoogleFileStorageService } from '../googleFileStorage/googleFileStorage.service';

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
        console.log("files", files)
        let path = `${this.folderPath}/${item.filename}`
        return {
          name: item.filename,
          provider,
          path,
          publicKey,
          privateKey,
        }
      });
      this.logger.debug("HERE", provider, publicKey)
      if (provider === StorageType.Google) {
        // await this.googleFileStorageService.saveFiles(files, publicKey)
      } else if (provider === StorageType.Local) {
        const path = await this.localFileStorageService.saveFiles(files, publicKey)
        if(path && typeof path === 'string'){
          data =data.map(d => {
            let local = JSON.parse(JSON.stringify(d));
            unlinkSync(local.path);
            return {...d, path }
          })
        }
      }
      return data
    } catch (error) {
      Logger.error(error)
      throw new ConflictException(error.message || 'Could not save the file!!')
    }
  }

  // async remove(privateKey: string) {
  //   try {
  //     let files: IFile[] = await this.repository.findByPrivateKey(privateKey);
  //     files = files.map((item) => {
  //       item.status = StatusType.Deleted
  //       return item
  //     })
  //     if (!files.length) {
  //       return {};
  //     }
  //     if (files[0].provider == StorageProviderType.Local) {
  //       this.localFileStorageService.removeFiles(files)
  //     } else {
  //       this.googleFileStorageService.removeFiles(files)
  //     }
  //     await this.repository.save(files);
  //     return {};
  //   } catch (error) {
  //     Logger.error(error.message)
  //     throw new ConflictException(error.message || 'Could not remove the file!!')
  //   }
  // }

  // async removeExpired() {
  //   try {
  //     //getting files that will be deleted
  //     let date = new Date(moment().subtract(this.activePeriod, 'days').format())
  //     let files: IFile[] = await this.repository.findExpired(date);
  //     if (!files.length) {
  //       return {};
  //     }
  //     let localFiles: IFile[] = []
  //     let googleFiles: IFile[] = []

  //     files = files.map((item) => {
  //       //updating status to deleted
  //       item.status = StatusType.Deleted;

  //       //seperating the array by provider type
  //       if (item.provider == StorageProviderType.Local) {
  //         localFiles.push(item)
  //       } else {
  //         googleFiles.push(item)
  //       }
  //       return item;
  //     })

  //     this.localFileStorageService.removeFiles(localFiles);
  //     this.googleFileStorageService.removeFiles(googleFiles);
  //     await this.repository.save(files);

  //     return {};
  //   } catch (error) {
  //     Logger.error(error);
  //     throw new ConflictException('Could not save the file!!');
  //   }
  // }

  generateKeys() {
    let publicKey = getHash(`PUBLIC_SECRET_${Math.random()}`, 'sha512');
    let privateKey = getHash(`PRIVATE_SECRET_${publicKey}`, 'sha512');
    return {
      publicKey,
      privateKey,
    }
  }

  async cleanup() {
    this.logger.debug("CLEANUP CALL");
  }
}
