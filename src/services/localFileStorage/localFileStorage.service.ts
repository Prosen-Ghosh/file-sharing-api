import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { unlinkSync } from 'fs';
import { IFile } from 'src/api/interfaces/file.interfaces';
// import { FileService } from './../file/file.service';
import * as AdmZip from 'adm-zip';
import * as fs from 'fs';

@Injectable()
export class LocalFileStorageService {
    private logger = new Logger(LocalFileStorageService.name);
    private folderPath: string;
    constructor(
        private configService: ConfigService,
    ) {
        this.folderPath = this.configService.get<string>('folderPath');
        // createing folder if not exist
        if (this.folderPath && !fs.existsSync(this.folderPath)){
            fs.mkdirSync(this.folderPath, { recursive: true });
        }
    }
    async saveFiles(files: Array<Express.Multer.File>, publicKey: string): Promise<string> {
        if (files.length < 2) {
            return;
        }
        return this.convertToZip(files, publicKey)
    }

    removeFiles(files: IFile[]): void {
        files.forEach((item) => {
            unlinkSync(item.path)
        })
        return;
    }

    convertToZip(files: Array<Express.Multer.File>, publicKey: string): string {
        const zip = new AdmZip();
        const path = `${this.folderPath}/${publicKey}.zip`;
        files.forEach(elem => {
            let location = `${this.folderPath}/${elem.filename}`
            zip.addLocalFile(location);
        });
        zip.writeZip(path)
        return path;
    }
}
