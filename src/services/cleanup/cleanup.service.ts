import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { IFile } from 'src/api/interfaces/file.interfaces';
import { FileService } from './../file/file.service';

@Injectable()
export class CleanUpService {
    private logger = new Logger(CleanUpService.name);
    constructor(
        @InjectModel('File') private readonly fileModel: Model<IFile>,
        private schedulerRegistry: SchedulerRegistry,
        private confgService: ConfigService,
        private fileService: FileService
    ) { }
    addInterval(name: string, milliseconds: number = this.confgService.get<number>('inactivity')) {
        const callback = async () => {
            this.logger.debug(`Interval ${name} executing at time (${milliseconds})!`);
            const data: IFile[] = await this.fileModel.find({});
            const privateKeys = data.map(d => d.privateKey);
            if (data) {
                await this.fileService.cleanup(data);
                await this.fileModel.deleteMany({
                    privateKey: {
                        $in: privateKeys
                    }
                });
            }

        };

        const interval = setInterval(callback, milliseconds);
        this.schedulerRegistry.addInterval(name, interval);
    }
}
