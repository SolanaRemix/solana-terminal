import { Controller, Get, Sse, MessageEvent, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SignalsService } from './signals.service';
import { Observable } from 'rxjs';

@Controller('signals')
export class SignalsController {
  constructor(private readonly svc: SignalsService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll() { return this.svc.findAll(); }

  /** Server-sent events stream for live signals */
  @Sse('stream')
  stream(): Observable<MessageEvent> { return this.svc.stream(); }
}
