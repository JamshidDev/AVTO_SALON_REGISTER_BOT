
import { I18n } from '@grammyjs/i18n';
import { Composer, session, MemorySessionStorage } from "grammy";
import { hydrate } from "@grammyjs/hydrate";
import { conversations } from "@grammyjs/conversations";
import { registerConversations } from "../conversations/index.js";


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

// Auth va conversation management middleware
bot.use(async (ctx, next) => {
    const ADMIN_IDS = [1038293334, 5011373330]
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
