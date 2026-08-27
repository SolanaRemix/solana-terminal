import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';

const MAX_LEVERAGE = 250;

export type Position = {
  id: string;
  userId: string;
  market: string;
  side: 'long' | 'short';
  leverage: number;
  size: number;
  entryPrice: number;
  takeProfit?: number;
  stopLoss?: number;
  status: 'open' | 'closed';
  createdAt: string;
  closedAt?: string;
  pnl?: number;
};

const STORE = new Map<string, Position>();

@Injectable()
export class PositionsService {
  findAll(userId: string): Position[] {
    return [...STORE.values()].filter(p => p.userId === userId);
  }

  findOpen(userId: string): Position[] {
    return this.findAll(userId).filter(p => p.status === 'open');
  }

  open(
    userId: string,
    dto: {
      market: string;
      side: 'long' | 'short';
      leverage: number;
      size: number;
      entryPrice: number;
      takeProfit?: number;
      stopLoss?: number;
    },
  ): Position {
    if (dto.leverage < 1 || dto.leverage > MAX_LEVERAGE) {
      throw new BadRequestException(
        `Leverage must be between 1 and ${MAX_LEVERAGE}`,
      );
    }
    if (dto.size <= 0) {
      throw new BadRequestException('Position size must be positive');
    }

    const position: Position = {
      id: randomUUID(),
      userId,
      ...dto,
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    STORE.set(position.id, position);
    return position;
  }

  update(
    id: string,
    userId: string,
    dto: { takeProfit?: number; stopLoss?: number },
  ): Position {
    const position = STORE.get(id);
    if (!position || position.userId !== userId) throw new NotFoundException();
    if (position.status !== 'open') {
      throw new BadRequestException('Cannot update a closed position');
    }
    if (dto.takeProfit !== undefined) position.takeProfit = dto.takeProfit;
    if (dto.stopLoss !== undefined) position.stopLoss = dto.stopLoss;
    return position;
  }

  close(id: string, userId: string, exitPrice: number): Position {
    const position = STORE.get(id);
    if (!position || position.userId !== userId) throw new NotFoundException();
    if (position.status !== 'open') {
      throw new BadRequestException('Position is already closed');
    }

    // size is in base-asset units (e.g. SOL); effective notional = size * leverage.
    // PnL in quote currency = priceDiff * size * leverage (long: positive when price rises).
    const priceDiff = exitPrice - position.entryPrice;
    const directionMultiplier = position.side === 'long' ? 1 : -1;
    position.pnl = priceDiff * directionMultiplier * position.size * position.leverage;
    position.status = 'closed';
    position.closedAt = new Date().toISOString();
    return position;
  }
}
