import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { FileService } from './../file/file.service';

@Injectable()
export class CleanUpService {
    constructor(
        private fileService: FileService,
    ) { }

    @Cron('1 * * * * *')
    cleanupFiles() {
        this.fileService.cleanup();
        return {}
    }
}
