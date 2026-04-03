import { Module } from '@nestjs/common';
import { ProviderService } from './provider.service';
import { ProviderController } from './provider.controller';
import { ResendService } from './resend/resend.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [ProviderController],
  providers: [ProviderService, ResendService],
  exports: [ProviderService],
})
export class ProviderModule {}
