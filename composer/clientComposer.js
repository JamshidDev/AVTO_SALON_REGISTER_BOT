import { Composer } from "grammy"
import {hears}  from "@grammyjs/i18n"


const bot = new Composer()

bot.command('start', async(ctx) => {
    await ctx.conversation.enter('mainMenyuConversation')
})







bot.filter(hears("registerClient"), async (ctx) => {
    await ctx.conversation.enter("registerReportConversation")
})

bot.filter(hears("downloadReport"), async (ctx) => {
    await ctx.conversation.enter("reportsConversation")
})

bot.filter(hears("cancelOperation"), async (ctx) => {
    await ctx.conversation.enter("mainMenyuConversation")
})

bot.filter(hears("backToMainMenu"), async (ctx) => {
    await ctx.conversation.enter("mainMenyuConversation")
})

export default bot
