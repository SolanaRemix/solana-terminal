import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { StrategiesModule } from './strategies/strategies.module';
import { WalletModule } from './wallet/wallet.module';
import { SignalsModule } from './signals/signals.module';
import { PositionsModule } from './positions/positions.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // Global rate-limiting: 100 requests per 60 s per IP
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
    AuthModule,
    StrategiesModule,
    WalletModule,
    SignalsModule,
    PositionsModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
