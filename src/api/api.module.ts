import { Module } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiController } from './api.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FileSchema } from './schemas/file.schema';
import { CleanUpService, FileService } from 'src/services';
import { LocalFileStorageService } from 'src/services/localFileStorage/localFileStorage.service';
import { GoogleFileStorageService } from 'src/services/googleFileStorage/googleFileStorage.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: "File", schema: FileSchema }
    ])
  ],
  controllers: [ApiController],
  providers: [ApiService, CleanUpService, FileService, LocalFileStorageService, GoogleFileStorageService]
})
export class ApiModule { }
