import { DotenvParseOutput, config } from 'dotenv';
import { IConfigService } from './config.interface';

export class ConfigService implements IConfigService {
  private readonly config: DotenvParseOutput;

  constructor() {
    const { error, parsed } = config();
    if (error || !parsed) throw new Error('Config doest found');
    this.config = parsed;
  }

  get(key: string): string {
    const res = this.config[key];
    if (!res) throw new Error('Config doest found');
    return res;
  }
}
