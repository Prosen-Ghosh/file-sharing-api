import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { LocalFileStorageService } from './localFileStorage.service';

describe('LocalFileStorageService', () => {
  let service: LocalFileStorageService;
  let configService: ConfigService;
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocalFileStorageService, ConfigService],
    }).compile();

    service = module.get<LocalFileStorageService>(LocalFileStorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
