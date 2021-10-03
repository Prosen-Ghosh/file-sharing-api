import { Test, TestingModule } from '@nestjs/testing';
import { GoogleFileStorageService } from './googleFileStorage.service';

describe('GoogleFileStorage', () => {
  let service: GoogleFileStorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoogleFileStorageService],
    }).compile();

    service = module.get<GoogleFileStorageService>(GoogleFileStorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
