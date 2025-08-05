import type { PokemonDetails } from '@api/pokeapi';
import { fetchPokemonList, fetchPokemonByName } from '@api/pokeapi';

export interface PokemonServiceConfig {
  pageSize: number;
  totalPokemons: number;
}

class RateLimiter {
  private queue: Array<() => Promise<unknown>> = [];
  private processing = false;
  private delay = 100;
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          await new Promise((resolve) => setTimeout(resolve, this.delay));
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      if (!this.processing) {
        this.processQueue();
      }
    });
  }

  private async processQueue() {
    this.processing = true;
    while (this.queue.length > 0) {
      const task = this.queue.shift();
      if (task) {
        await task();
      }
    }
    this.processing = false;
  }
}

const rateLimiter = new RateLimiter();

export class PokemonService {
  private config: PokemonServiceConfig;

  constructor(config: PokemonServiceConfig) {
    this.config = config;
  }

  async loadDefaultList(page: number): Promise<PokemonDetails[]> {
    const offset = (page - 1) * this.config.pageSize;
    const list = await rateLimiter.execute(() =>
      fetchPokemonList(offset, this.config.pageSize)
    );
    const detailed = await Promise.all(
      list.map((p) => rateLimiter.execute(() => fetchPokemonByName(p.name)))
    );
    return detailed;
  }

  async searchByName(name: string): Promise<PokemonDetails[]> {
    if (!name.trim()) {
      return [];
    }
    const pokemon = await rateLimiter.execute(() =>
      fetchPokemonByName(name.toLowerCase())
    );
    return [pokemon];
  }

  getTotalPages(): number {
    return Math.ceil(this.config.totalPokemons / this.config.pageSize);
  }
}
