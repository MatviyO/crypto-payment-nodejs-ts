import { Telegraf } from 'telegraf';
import { Command } from './command.class';
import { IBotContext } from '../context/context.interface';
import { ICryptomusService } from '../cryptomus/cryptomus.interface';
import { IDatabaseService } from '../database/database.interface';

export class StartCommand extends Command {
  constructor(
    bot: Telegraf<IBotContext>,
    private readonly cryptomusService: ICryptomusService,
    private readonly databaseService: IDatabaseService,
  ) {
    super(bot);
  }

  handle(): void {
    this.bot.start(async (ctx) => {
      const res = await this.cryptomusService.createPayment(1, '10');
      if (!res) {
        ctx.reply('Failed payment');
        return;
      }
      await this.databaseService.payment.create({
        data: {
          uuid: res.result.uuid,
          orderId: res.result.order_id,
          status: res.result.status,
          amount: res.result.amount,
          paymentAmount: res.result.payer_amount,
          isFinal: res.result.is_final,
          url: res.result.url,
          chatId: ctx.from.id,
        },
      });

      ctx.reply(res.result.url);
    });

    this.bot.action('continue_yes', (ctx) => {
      ctx.session.like = true;
      ctx.editMessageText('Cool, go to continue');
    });
    this.bot.action('continue_no', (ctx) => {
      ctx.session.like = false;
      ctx.editMessageText('Ok, in next way');
    });
  }
}
