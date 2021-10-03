import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { unlinkSync } from 'fs';
import { Model } from 'mongoose';
import { getHash } from 'src/common/utils';
import { FileService } from 'src/services';
import { IFile } from './interfaces/file.interfaces';

@Injectable()
export class ApiService {
    constructor(
        @InjectModel('File') private readonly fileModel: Model<IFile>,
        private readonly configService: ConfigService,
        private readonly fileService: FileService
    ) { }

    async saveFile(files: Array<Express.Multer.File>): Promise<IFile> {
        const data = await this.fileService.save(files);
        const inserted = await this.fileModel.insertMany(data);
        return inserted[0];
    }

    async findByPublicKey(publicKey: string): Promise<IFile> {
        const privateKey = getHash(`PRIVATE_SECRET_${publicKey}`, 'sha512')
        return await this.fileModel.findOneAndUpdate({
            privateKey
        }, {
            lastVisited: new Date()
        }, {
            returnNewDocument: true
        });
    }

    async removeByPublicKey(publicKey: string): Promise<IFile> {
        const privateKey = getHash(`PRIVATE_SECRET_${publicKey}`, 'sha512')
        const file: IFile = await this.fileModel.findOne({
            privateKey
        });

        if (file) {
            unlinkSync(file.path);

            return await this.fileModel.remove({
                privateKey
            });
        }
    }
}
