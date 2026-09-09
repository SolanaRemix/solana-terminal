import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WalletService } from './wallet.service';

@Controller('wallets')
@UseGuards(AuthGuard('jwt'))
export class WalletController {
  constructor(private readonly svc: WalletService) {}

  @Get()
  findAll(@Request() req: any) { return this.svc.findAll(req.user.userId); }

  @Post()
  generate(@Request() req: any) { return this.svc.generate(req.user.userId); }
}
