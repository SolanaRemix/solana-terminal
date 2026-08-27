import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';

type Strategy = { id: string; userId: string; type: string; config: object; status: string };
const STORE = new Map<string, Strategy>();

@Injectable()
export class StrategiesService {
  findAll(userId: string): Strategy[] {
    return [...STORE.values()].filter(s => s.userId === userId);
  }

  create(userId: string, dto: { type: string; config: object }): Strategy {
    const strategy: Strategy = { id: randomUUID(), userId, ...dto, status: 'paused' };
    STORE.set(strategy.id, strategy);
    return strategy;
  }

  setStatus(id: string, status: string): Strategy {
    const s = STORE.get(id);
    if (!s) throw new NotFoundException();
    s.status = status;
    return s;
  }

  remove(id: string): { deleted: boolean } {
    STORE.delete(id);
    return { deleted: true };
  }
}
