import { Test, TestingModule } from '@nestjs/testing';
import { FileService } from '../services';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let fileService: FileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiService, FileService],
    }).compile();

    service = module.get<ApiService>(ApiService);
    fileService = module.get<FileService>(FileService)
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
