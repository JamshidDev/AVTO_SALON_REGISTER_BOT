import {createConversation} from '@grammyjs/conversations'
import {registerReportConversation, mainMenyuConversation} from './conversations.js'


export function registerConversations(composer){
    composer.use(createConversation(registerReportConversation))
    composer.use(createConversation(mainMenyuConversation))
}