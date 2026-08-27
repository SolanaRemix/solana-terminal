import type { Strategy, WalletAccount, Signal, Position } from './types';

/**
 * Thin API client for the Solana Elite Terminal backend.
 */
export class TerminalApiClient {
  private baseUrl: string;
  private token?: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  setToken(token: string) {
    this.token = token;
  }

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(this.token ? { Authorization: 'Bearer ' + this.token } : {}),
    };
    const res = await fetch(`${this.baseUrl}${path}`, { ...init, headers });
    if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
    return res.json() as Promise<T>;
  }

  // ── Auth ────────────────────────────────────────────────────────────────────

  login(email: string, password: string) {
    return this.request<{ access_token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  register(email: string, password: string) {
    return this.request<{ message: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // ── Positions ───────────────────────────────────────────────────────────────

  getPositions() {
    return this.request<Position[]>('/positions');
  }

  getOpenPositions() {
    return this.request<Position[]>('/positions/open');
  }

  openPosition(dto: {
    market: string;
    side: 'long' | 'short';
    leverage: number;
    size: number;
    entryPrice: number;
    takeProfit?: number;
    stopLoss?: number;
  }) {
    return this.request<Position>('/positions', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  }

  updatePosition(id: string, dto: { takeProfit?: number; stopLoss?: number }) {
    return this.request<Position>(`/positions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
    });
  }

  closePosition(id: string, exitPrice: number) {
    return this.request<Position>(`/positions/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({ exitPrice }),
    });
  }

  // ── Strategies ──────────────────────────────────────────────────────────────

  getStrategies() {
    return this.request<Strategy[]>('/strategies');
  }

  createStrategy(type: string, config: Record<string, unknown>) {
    return this.request<Strategy>('/strategies', {
      method: 'POST',
      body: JSON.stringify({ type, config }),
    });
  }

  startStrategy(id: string) {
    return this.request<Strategy>(`/strategies/${id}/start`, { method: 'PATCH' });
  }

  pauseStrategy(id: string) {
    return this.request<Strategy>(`/strategies/${id}/pause`, { method: 'PATCH' });
  }

  // ── Wallets ─────────────────────────────────────────────────────────────────

  getWallets() {
    return this.request<WalletAccount[]>('/wallets');
  }

  generateWallet() {
    return this.request<WalletAccount>('/wallets', { method: 'POST' });
  }

  // ── Signals ──────────────────────────────────────────────────────────────────

  getSignals() {
    return this.request<Signal[]>('/signals');
  }

  /** Open an SSE connection for live signals. */
  streamSignals(onMessage: (data: unknown) => void): EventSource {
    const es = new EventSource(`${this.baseUrl}/signals/stream`);
    es.onmessage = e => onMessage(JSON.parse(e.data as string));
    return es;
  }
}
