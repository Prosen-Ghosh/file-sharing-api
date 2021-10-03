import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { GoogleFileStorageService } from '../googleFileStorage/googleFileStorage.service';
import { LocalFileStorageService } from '../localFileStorage/localFileStorage.service';
import { FileService } from './file.service';

describe('FileService', () => {
  let service: FileService;
  let configService: ConfigService;
  let localFileStorageService: LocalFileStorageService;
  let googleFileStorageService: GoogleFileStorageService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileService, ConfigService, LocalFileStorageService, GoogleFileStorageService],
    }).compile();

    service = module.get<FileService>(FileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
