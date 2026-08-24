import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StrategiesService } from './strategies.service';

@Controller('strategies')
@UseGuards(AuthGuard('jwt'))
export class StrategiesController {
  constructor(private readonly svc: StrategiesService) {}

  @Get()
  findAll(@Request() req: any) {
    return this.svc.findAll(req.user.userId);
  }

  @Post()
  create(@Request() req: any, @Body() dto: { type: string; config: object }) {
    return this.svc.create(req.user.userId, dto);
  }

  @Patch(':id/start')
  start(@Param('id') id: string) {
    return this.svc.setStatus(id, 'active');
  }

  @Patch(':id/pause')
  pause(@Param('id') id: string) {
    return this.svc.setStatus(id, 'paused');
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.svc.remove(id);
  }
}
