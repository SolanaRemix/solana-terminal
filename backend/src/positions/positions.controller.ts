import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PositionsService } from './positions.service';

@Controller('positions')
@UseGuards(AuthGuard('jwt'))
export class PositionsController {
  constructor(private readonly svc: PositionsService) {}

  @Get()
  findAll(@Request() req: any) {
    return this.svc.findAll(req.user.userId);
  }

  @Get('open')
  findOpen(@Request() req: any) {
    return this.svc.findOpen(req.user.userId);
  }

  @Post()
  open(
    @Request() req: any,
    @Body()
    dto: {
      market: string;
      side: 'long' | 'short';
      leverage: number;
      size: number;
      entryPrice: number;
      takeProfit?: number;
      stopLoss?: number;
    },
  ) {
    return this.svc.open(req.user.userId, dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Request() req: any,
    @Body() dto: { takeProfit?: number; stopLoss?: number },
  ) {
    return this.svc.update(id, req.user.userId, dto);
  }

  @Delete(':id')
  close(
    @Param('id') id: string,
    @Request() req: any,
    @Body() body: { exitPrice: number },
  ) {
    return this.svc.close(id, req.user.userId, body.exitPrice);
  }
}
