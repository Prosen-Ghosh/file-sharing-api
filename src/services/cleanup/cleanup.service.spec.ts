import { Test, TestingModule } from '@nestjs/testing';
import { CleanUpService } from './cleanup.service';

describe('CleanUpService', () => {
  let service: CleanUpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CleanUpService],
    }).compile();

    service = module.get<CleanUpService>(CleanUpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
