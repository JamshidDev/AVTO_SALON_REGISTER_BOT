import { Keyboard } from "grammy"
import { carModels, paymentMethods, shortAdress, workplaceType } from "../utils/index.js"


export async function mainMenyuConversation(conversation, ctx){
    const keyboard = new Keyboard()
    .text(ctx.t('registerClient'))
    .row()
    .text(ctx.t('downloadReport'))
    .resized()

    await ctx.reply(ctx.t('mainMenu'), {
        parse_mode: 'HTML',
        reply_markup: keyboard,
    })
}


export async function registerReportConversation(conversation, ctx){
    let registrationSheet = {
        whereFromClient: null,
        fullName:null,
        model:null,
        paymentMethod:null,
        workplace:null,
        adress:null,
        phoneNumber:null,
        status:null,
    }

    const keyboard1 = new Keyboard()
    .text(ctx.t('onOffice'))
    .text(ctx.t('onCallCenter'))
    .row()
    .text(ctx.t('cancelOperation'))
    .resized()
    
    await ctx.reply(ctx.t('whereFromClient'),{
        parse_mode: 'HTML',
        reply_markup: keyboard1,
    })

    // Validatsiya funksiyasi
    const validateAnswer = (message) => {
        const validChoices = [ctx.t('onOffice'), ctx.t('onCallCenter')];
        return validChoices.includes(message);
    }

    ctx = await conversation.wait()
    
    if (!validateAnswer(ctx.message?.text)) {
        do {
            await ctx.reply(ctx.t('invalidChoice'), {
                parse_mode: "HTML",
                reply_markup: keyboard1
            })
            ctx = await conversation.wait()
        } while (!validateAnswer(ctx.message?.text))
    }
    registrationSheet.whereFromClient = ctx.message?.text

    await ctx.reply(ctx.t('whatisFullNameOfClient'),{
        parse_mode: 'HTML',
        reply_markup: new Keyboard()
        .text(ctx.t('cancelOperation'))
        .resized(),
    })

    // Text message validatsiyasi
    const validateTextMessage = (message) => {
        return message && message.trim().length > 0;
    }

    ctx = await conversation.wait()
    
    if (!validateTextMessage(ctx.message?.text)) {
        do {
            await ctx.reply(ctx.t('invalidTextMessage'), {
                parse_mode: "HTML",
                reply_markup: new Keyboard()
                .text(ctx.t('cancelOperation'))
                .resized()
            })
            ctx = await conversation.wait()
        } while (!validateTextMessage(ctx.message?.text))
    }
    registrationSheet.fullName = ctx.message?.text


    const carModelKeyboards = new Keyboard()
    carModels.forEach((model, index) => {
        if (index % 2 === 0) {
            carModelKeyboards.row()
        }
        carModelKeyboards.text(model.name)
    })
    carModelKeyboards.resized()

    await ctx.reply(ctx.t('whatIsCarModel'),{
        parse_mode: 'HTML',
        reply_markup:carModelKeyboards,
    })

    // Car model validatsiyasi
    const validateCarModel = (message) => {
        const validModels = carModels.map(model => model.name);
        return validModels.includes(message);
    }

    ctx = await conversation.wait()
    
    if (!validateCarModel(ctx.message?.text)) {
        do {
            await ctx.reply(ctx.t('invalidChoice'), {
                parse_mode: "HTML",
                reply_markup: carModelKeyboards
            })
            ctx = await conversation.wait()
        } while (!validateCarModel(ctx.message?.text))
    }
    
    registrationSheet.model = ctx.message?.text
    
    // To'lov turi tanlash
    const paymentMethodKeyboards = new Keyboard()
    paymentMethods.forEach((method, index) => {
        if (index % 2 === 0) {
            paymentMethodKeyboards.row()
        }
        paymentMethodKeyboards.text(method.name)
    })
    paymentMethodKeyboards.resized()

    await ctx.reply(ctx.t('whatIsPaymentMethod'),{
        parse_mode: 'HTML',
        reply_markup: paymentMethodKeyboards,
    })

    // To'lov turi validatsiyasi
    const validatePaymentMethod = (message) => {
        const validMethods = paymentMethods.map(method => method.name);
        return validMethods.includes(message);
    }

    ctx = await conversation.wait()
    
    if (!validatePaymentMethod(ctx.message?.text)) {
        do {
            await ctx.reply(ctx.t('invalidChoice'), {
                parse_mode: "HTML",
                reply_markup: paymentMethodKeyboards
            })
            ctx = await conversation.wait()
        } while (!validatePaymentMethod(ctx.message?.text))
    }
    
    registrationSheet.paymentMethod = ctx.message?.text
    
    // Ish joyi tanlash
    const workplaceKeyboards = new Keyboard()
    workplaceType.forEach((workplace, index) => {
        if (index % 2 === 0) {
            workplaceKeyboards.row()
        }
        workplaceKeyboards.text(workplace.name)
    })
    workplaceKeyboards.resized()

    await ctx.reply(ctx.t('whatIsWorkplace'),{
        parse_mode: 'HTML',
        reply_markup: workplaceKeyboards,
    })

    // Ish joyi validatsiyasi
    const validateWorkplace = (message) => {
        const validWorkplaces = workplaceType.map(workplace => workplace.name);
        return validWorkplaces.includes(message);
    }

    ctx = await conversation.wait()
    
    if (!validateWorkplace(ctx.message?.text)) {
        do {
            await ctx.reply(ctx.t('invalidChoice'), {
                parse_mode: "HTML",
                reply_markup: workplaceKeyboards
            })
            ctx = await conversation.wait()
        } while (!validateWorkplace(ctx.message?.text))
    }
    
    registrationSheet.workplace = ctx.message?.text
    
    // Adress tanlash
    const addressKeyboards = new Keyboard()
    shortAdress.forEach((address, index) => {
        if (index % 2 === 0) {
            addressKeyboards.row()
        }
        addressKeyboards.text(address.name)
    })
    addressKeyboards.resized()

    await ctx.reply(ctx.t('whatIsAddress'),{
        parse_mode: 'HTML',
        reply_markup: addressKeyboards,
    })

    // Adress validatsiyasi
    const validateAddress = (message) => {
        const validAddresses = shortAdress.map(address => address.name);
        return validAddresses.includes(message);
    }

    ctx = await conversation.wait()
    
    if (!validateAddress(ctx.message?.text)) {
        do {
            await ctx.reply(ctx.t('invalidChoice'), {
                parse_mode: "HTML",
                reply_markup: addressKeyboards
            })
            ctx = await conversation.wait()
        } while (!validateAddress(ctx.message?.text))
    }
    
    registrationSheet.adress = ctx.message?.text
    
    // Telefon raqam so'rish
    await ctx.reply(ctx.t('whatIsPhoneNumber'),{
        parse_mode: 'HTML',
        reply_markup: new Keyboard()
        .text(ctx.t('cancelOperation'))
        .resized(),
    })

    // Telefon raqam validatsiyasi
    const validatePhoneNumber = (message) => {
        return message && message.trim().length > 0;
    }

    ctx = await conversation.wait()
    
    if (!validatePhoneNumber(ctx.message?.text)) {
        do {
            await ctx.reply(ctx.t('invalidTextMessage'), {
                parse_mode: "HTML",
                reply_markup: new Keyboard()
                .text(ctx.t('cancelOperation'))
                .resized()
            })
            ctx = await conversation.wait()
        } while (!validatePhoneNumber(ctx.message?.text))
    }
    
    registrationSheet.phoneNumber = ctx.message?.text
    
    // Status so'rish
    await ctx.reply(ctx.t('whatIsStatus'),{
        parse_mode: 'HTML',
        reply_markup: new Keyboard()
        .text(ctx.t('cancelOperation'))
        .resized(),
    })

    ctx = await conversation.wait()
    registrationSheet.status = ctx.message?.text
    
    // Preview message
    const previewMessage = `
<b>📋 Mijoz ma'lumotlari:</b>

<b>📋 Qayerdan:</b> ${registrationSheet.whereFromClient}
<b>👤 Ism:</b> ${registrationSheet.fullName}
<b>🚗 Avtomobil:</b> ${registrationSheet.model}
<b>💳 To'lov:</b> ${registrationSheet.paymentMethod}
<b>💼 Ish joyi:</b> ${registrationSheet.workplace}
<b>📍 Manzil:</b> ${registrationSheet.adress}
<b>📞 Telefon:</b> ${registrationSheet.phoneNumber}
<b>📊 Status:</b> ${registrationSheet.status}
    `.trim()

    const confirmKeyboard = new Keyboard()
    .text(ctx.t('confirm'))
    .text(ctx.t('cancelOperation'))
    .resized()

    await ctx.reply(previewMessage, {
        parse_mode: 'HTML',
        reply_markup: confirmKeyboard
    })

    // Tasdiqlash validatsiyasi
    const validateConfirm = (message) => {
        const validChoices = [ctx.t('confirm'), ctx.t('cancelOperation')];
        return validChoices.includes(message);
    }

    ctx = await conversation.wait()
    
    if (!validateConfirm(ctx.message?.text)) {
        do {
            await ctx.reply(ctx.t('invalidChoice'), {
                parse_mode: "HTML",
                reply_markup: confirmKeyboard
            })
            ctx = await conversation.wait()
        } while (!validateConfirm(ctx.message?.text))
    }

    if (ctx.message?.text === ctx.t('confirm')) {
        await ctx.reply(ctx.t('registrationCompleted'), {
            parse_mode: 'HTML'
        })
        // Bu yerda ma'lumotlarni bazaga saqlash mumkin
    } else {
        await ctx.reply(ctx.t('registrationCancelled'), {
            parse_mode: 'HTML'
        })
    }
    
    console.log(registrationSheet);
}