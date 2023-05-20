import { Markup, Telegraf } from 'telegraf';
import { Command } from './command.class';
import { IBotContext } from '../context/context.interface';

export class StartCommand extends Command {
  constructor(bot: Telegraf<IBotContext>) {
    super(bot);
  }

  handle(): void {
    this.bot.start((ctx) => {
      ctx.reply('DO you want ask questions?', Markup.inlineKeyboard([
        Markup.button.callback('like', 'continue_yes'),
        Markup.button.callback('dislike', 'continue_no'),
      ]));
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
