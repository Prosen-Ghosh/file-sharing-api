import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { unlinkSync } from 'fs';
import { IFile } from 'src/api/interfaces/file.interfaces';
// import { FileService } from './../file/file.service';
import * as AdmZip from 'adm-zip';
import * as fs from 'fs';
import { LocalFileStorageService } from '../localFileStorage/localFileStorage.service';

@Injectable()
export class GoogleFileStorageService {
    private logger = new Logger(GoogleFileStorageService.name);
    private folderPath: string;
    constructor(
        private localFileStorageService: LocalFileStorageService,
        private config: ConfigService,
    ) {
        this.folderPath = this.config.get('folderPath');

    }
    async saveFiles(files: Array<Express.Multer.File>, publicKey: string): Promise<void> {
        
        return;
    }
}
