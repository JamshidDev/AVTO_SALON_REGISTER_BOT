
import { I18n } from '@grammyjs/i18n';
import { Composer, session, MemorySessionStorage } from "grammy";
import { hydrate } from "@grammyjs/hydrate";
import { conversations } from "@grammyjs/conversations";
import { registerConversations } from "../conversations/index.js";
import config from '../config/config.js';



const bot = new Composer()

const i18n = new I18n({
    defaultLocale: "uz",
    useSession: true,
    directory:'locale',
})

bot.use(session({
    type: "multi",
    session_db: {
        initial: () => {
            return {
                isLogOut:false,
                isAuth:false,
            }
        },
        storage: new MemorySessionStorage(),
        getSessionKey: (ctx) => ctx.from?.id.toString(),
    },
    conversation: {},
    __language_code: {},
}));

bot.use(conversations())

bot.use(i18n);
bot.use(hydrate())

bot.command('my_chat_id', async(ctx) => {
    await ctx.reply(`
<b>Your chat ID:</b> ${ctx.from.id}        
<b>Your username:</b> ${ctx.from.username}
<b>Your first name:</b> ${ctx.from?.first_name || 'Noma\'lum'}
        `, { parse_mode: 'HTML' })
})

// Auth va conversation management middleware
bot.use(async (ctx, next) => {
    // Get admin IDs from environment variables
    const ADMIN_IDS = config.adminIds;
    if (!ADMIN_IDS.includes(ctx.from.id)) {
        await ctx.reply(`
<b>⚠️ Sizga ruxsat etilmadi</b>    
<i>Bot faqat Navoiy ATX operatorlari uchun.</i>       
            `, { parse_mode: 'HTML' })
        return
    }


    let permissions = [ctx.t('backToMainMenu'), ctx.t('backToServiceMenu'), ctx.t('backToYearMenu'), '/start', ctx.t('cancelOperation')]
    
    if (permissions.includes(ctx.message?.text)) {
        const stats = await ctx.conversation.active();
        for (let key of Object.keys(stats)) {
            await ctx.conversation.exit(key);
        }
    }
    ctx.config = {
        isAdmin: ADMIN_IDS.includes(ctx.from.id),
        isAuth: false,
        notificationId: null, // notificationId ni keyinroq qo'shamiz
    }


    await next()
})

registerConversations(bot)


export default bot
