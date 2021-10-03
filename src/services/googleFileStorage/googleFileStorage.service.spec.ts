import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { GoogleFileStorageService } from './googleFileStorage.service';

describe('GoogleFileStorage', () => {
  let service: GoogleFileStorageService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoogleFileStorageService, ConfigService],
    }).compile();

    service = module.get<GoogleFileStorageService>(GoogleFileStorageService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
