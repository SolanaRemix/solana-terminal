import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

type Wallet = { id: string; userId: string; publicKey: string; mode: string };
const STORE = new Map<string, Wallet>();

@Injectable()
export class WalletService {
  findAll(userId: string) { return [...STORE.values()].filter(w => w.userId === userId); }

  generate(userId: string): Wallet {
    // NOTE: In production, generate a real Solana keypair (client-side in non-custodial mode).
    const wallet: Wallet = {
      id: randomUUID(),
      userId,
      publicKey: 'MOCK_' + randomUUID().replace(/-/g, '').slice(0, 32),
      mode: 'non-custodial',
    };
    STORE.set(wallet.id, wallet);
    return wallet;
  }
}
