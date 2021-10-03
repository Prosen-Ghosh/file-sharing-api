import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Test, TestingModule } from '@nestjs/testing';
import { FileService } from '..';
import { CleanUpService } from './cleanup.service';

describe('CleanUpService', () => {
  let service: CleanUpService;
  let schedulerRegistry: SchedulerRegistry;
  let confgService: ConfigService;
  let fileService: FileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CleanUpService],
    }).compile();

    service = module.get<CleanUpService>(CleanUpService);
    schedulerRegistry = module.get<SchedulerRegistry>(SchedulerRegistry);
    confgService = module.get<ConfigService>(ConfigService);
    fileService = module.get<FileService>(FileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
