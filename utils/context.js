import pkg from '@grammyjs/conversations';
const { ConversationFlavor } = pkg;
import { Context } from 'grammy';

// Extend Context with conversation flavor
function MyContext(update, api, me) {
  Context.call(this, update, api, me);
}

MyContext.prototype = Object.create(Context.prototype);
MyContext.prototype.constructor = MyContext;

// Add conversation flavor to context
const BotContext = MyContext;

export { BotContext };
