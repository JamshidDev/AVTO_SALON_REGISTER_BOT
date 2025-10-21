
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

registerConversations(bot)


export default bot
