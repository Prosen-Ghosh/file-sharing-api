import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApiModule } from './api/api.module';
import configuration from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { MulterModule } from '@nestjs/platform-express';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
// import { diskStorage } from 'multer';
// import { extname } from 'path/posix';
// import { CleanUpService } from './services';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: config.get<number>('THROTTLE_TTL'),
        limit: config.get<number>('UPLOAD_LIMIT'),
      }),
    }),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        dest: configService.get<string>('folderPath'),
        // storage: diskStorage({ //setting up file saving configuration
        //   filename: (req, file, cb) => {
        //     const name = file.originalname.split('.')[0];
        //     const fileExtName = extname(file.originalname);
        //     cb(null, `${name}_${Math.random()}${fileExtName}`);
        //   },
        //   destination: process.env.FOLDER || 'uploads'
        // })
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      expandVariables: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('databaseURI'),
        useNewUrlParser: true, // parse connection string using new method
      }),
      inject: [ConfigService],
    }),
    ApiModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule { }
