import { Telegraf } from 'telegraf';
import cron from 'node-cron';
import { ICronService } from './cron.interface';
import { IDatabaseService } from '../database/database.interface';
import CryptomusService from '../cryptomus/cryptomus.service';
import { IBotContext } from '../context/context.interface';
import databaseService from '../database/database.service';
import { ICryptomusService } from '../cryptomus/cryptomus.interface';

export class CronService implements ICronService {
  constructor(
private readonly databaseService: IDatabaseService,
    private readonly cryptomusService: ICryptomusService,
    private readonly bot: Telegraf<IBotContext>,
  ) {
  }

  init(): void {
    cron.schedule('*/5 * * * * *', async () => {
      const payments = await databaseService.payment.findMany({
        where: {
          isFinal: false,
        },
      });
      for (const payment of payments) {
        const res = await this.cryptomusService.checkPayment(payment.uuid);
        if (!res) {
          continue;
        }
        if (res.result.is_final) {
          this.bot.telegram.sendMessage(payment.chatId, res.result.status);
          await this.databaseService.payment.update({
            where: {
              uuid: payment.uuid,
            },
            data: {
              uuid: res.result.uuid,
              orderId: res.result.order_id,
              status: res.result.status,
              amount: res.result.amount,
              paymentAmount: res.result.payer_amount,
              isFinal: res.result.is_final,
              url: res.result.url,
              chatId: payment.id,
            },
          });
        }
      }
    });
  }
}
