import { Telegraf } from 'telegraf';
import LocalSession from 'telegraf-session-local';
import { ConfigService } from './config/config.service';
import { IConfigService } from './config/config.interface';
import { IBotContext } from './context/context.interface';
import { Command } from './commands/command.class';
import { StartCommand } from './commands/start.command';
import DatabaseService from './database/database.service';
import CryptomusService from './cryptomus/cryptomus.service';
import { ICryptomusService } from './cryptomus/cryptomus.interface';
import { IDatabaseService } from './database/database.interface';
import { CronService } from './cron/cron.service';

class Bot {
  bot: Telegraf<IBotContext>;

  commands: Command[] = [];

  constructor(
    private readonly config: IConfigService,
    private readonly databaseService: IDatabaseService,
    private cryptomusService: ICryptomusService,
  ) {
    this.bot = new Telegraf<IBotContext>(this.config.get('TOKEN'));
    this.bot.use(new LocalSession({ database: 'sessions.json' }).middleware());
  }

  async init() {
    await new CronService(this.databaseService, this.cryptomusService, this.bot).init();
    await this.databaseService.init();
    this.commands = [new StartCommand(this.bot, this.cryptomusService, this.databaseService)];
    for (const command of this.commands) {
      command.handle();
    }
    this.bot.launch().then(() => console.log('Bot has been started'));
  }
}

const config = new ConfigService();
const cryptomusService = new CryptomusService(config);
const database = new DatabaseService();
const bot = new Bot(config, database, cryptomusService);

bot.init();
