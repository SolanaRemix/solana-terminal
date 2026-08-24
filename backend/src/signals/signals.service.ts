import { Injectable } from '@nestjs/common';
import { Observable, interval, map } from 'rxjs';
import { MessageEvent } from '@nestjs/common';

type Signal = { id: string; type: string; market: string; payload: object; createdAt: string };

const MOCK: Signal[] = [
  { id: '1', type: 'pump',  market: 'BONK',     payload: { riskScore: 42 }, createdAt: new Date().toISOString() },
  { id: '2', type: 'perps', market: 'SOL-PERP',  payload: { fundingRate: 0.08 }, createdAt: new Date().toISOString() },
];

@Injectable()
export class SignalsService {
  findAll() { return MOCK; }

  stream(): Observable<MessageEvent> {
    return interval(5000).pipe(
      map(() => ({
        data: JSON.stringify({ type: 'heartbeat', ts: Date.now() }),
      } as MessageEvent)),
    );
  }
}
