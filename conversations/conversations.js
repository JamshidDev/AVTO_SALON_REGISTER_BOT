import { Keyboard, InputFile } from "grammy"
import { carModels, paymentMethods, shortAdress, workplaceType, exportReportsToExcel, deleteTempFile } from "../utils/index.js"
import { createReport, getReportsByPeriod } from "../controllers/reportController.js"

// Umumiy validatsiya funksiyasi
async function getValidatedInput(conversation, ctx, validChoices, keyboard, errorMessage) {
    const validateAnswer = (message) => validChoices.includes(message);
    
    ctx = await conversation.wait();
    
    if (!validateAnswer(ctx.message?.text)) {
        do {
            await ctx.reply(errorMessage, {
                parse_mode: "HTML",
                reply_markup: keyboard
            });
            ctx = await conversation.wait();
        } while (!validateAnswer(ctx.message?.text));
    }
    
    return ctx;
}

// Text input validatsiyasi
async function getTextInput(conversation, ctx, errorMessage) {
    const validateTextMessage = (message) => message && message.trim().length > 0;
    
    ctx = await conversation.wait();
    
    if (!validateTextMessage(ctx.message?.text)) {
        do {
            await ctx.reply(errorMessage, {
                parse_mode: "HTML",
                reply_markup: new Keyboard()
                    .text(ctx.t('cancelOperation'))
                    .resized()
            });
            ctx = await conversation.wait();
        } while (!validateTextMessage(ctx.message?.text));
    }
    
    return ctx;
}

// Keyboard yaratish funksiyasi
function createEnumKeyboard(items, ctx) {
    const keyboard = new Keyboard();
    items.forEach((item, index) => {
        if (index % 2 === 0) {
            keyboard.row();
        }
        keyboard.text(item.name);
    });
    return keyboard.resized();
}


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

    // Validatsiya va input olish
    ctx = await getValidatedInput(conversation, ctx, [ctx.t('onOffice'), ctx.t('onCallCenter')], keyboard1, ctx.t('invalidChoice'));
    registrationSheet.whereFromClient = ctx.message?.text

    await ctx.reply(ctx.t('whatisFullNameOfClient'),{
        parse_mode: 'HTML',
        reply_markup: new Keyboard()
        .text(ctx.t('cancelOperation'))
        .resized(),
    })

    // Text message validatsiyasi
    ctx = await getTextInput(conversation, ctx, ctx.t('invalidTextMessage'));
    registrationSheet.fullName = ctx.message?.text


    const carModelKeyboards = createEnumKeyboard(carModels, ctx);

    await ctx.reply(ctx.t('whatIsCarModel'),{
        parse_mode: 'HTML',
        reply_markup: carModelKeyboards,
    })

    // Car model validatsiyasi
    const validModels = carModels.map(model => model.name);
    ctx = await getValidatedInput(conversation, ctx, validModels, carModelKeyboards, ctx.t('invalidChoice'));
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
    const statusKeyboard = new Keyboard()
        .text(ctx.t('skipStatus'))
        .text(ctx.t('cancelOperation'))
        .resized()

    await ctx.reply(ctx.t('whatIsStatus'),{
        parse_mode: 'HTML',
        reply_markup: statusKeyboard,
    })

    // Status validatsiyasi
    const validateStatus = (message) => {
        const validChoices = [ctx.t('skipStatus'), ctx.t('cancelOperation')];
        return validChoices.includes(message) || (message && message.trim().length > 0);
    }

    ctx = await conversation.wait()
    
    if (!validateStatus(ctx.message?.text)) {
        do {
            await ctx.reply(ctx.t('invalidTextMessage'), {
                parse_mode: "HTML",
                reply_markup: statusKeyboard
            })
            ctx = await conversation.wait()
        } while (!validateStatus(ctx.message?.text))
    }

    // Status qiymatini belgilash
    if (ctx.message?.text === ctx.t('skipStatus')) {
        registrationSheet.status = '';
    } else {
        registrationSheet.status = ctx.message?.text;
    }
    
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
        // Loading message yuborish
        const loadingMsg = await ctx.reply(ctx.t('loadingMessage'), {
            parse_mode: 'HTML'
        });

        try {
            // Telegram user ma'lumotlarini qo'shish
            const reportData = {
                ...registrationSheet,
                address: registrationSheet.adress, // adress -> address ga o'zgartirish
                telegramUser: {
                    userId: ctx.from?.id,
                    username: ctx.from?.username,
                    firstName: ctx.from?.first_name,
                    lastName: ctx.from?.last_name
                }
            }
            
            // Controller orqali bazaga saqlash
            const result = await createReport(reportData);
            
            // Loading messageni o'chirish
            await ctx.api.deleteMessage(ctx.chat.id, loadingMsg.message_id);
            
            if (result.success) {
                await ctx.reply(ctx.t('registrationCompleted'), {
                    parse_mode: 'HTML'
                })
                
                // Asosiy menuga qaytish
                await mainMenyuConversation(conversation, ctx);
            } else {
                await ctx.reply(`❌ Xatolik: ${result.message}`, {
                    parse_mode: 'HTML'
                })
                
                // Xatolik bo'lsa ham asosiy menuga qaytish
                await mainMenyuConversation(conversation, ctx);
            }
        } catch (error) {
            console.error('Registration save error:', error);
            
            // Loading messageni o'chirish
            try {
                await ctx.api.deleteMessage(ctx.chat.id, loadingMsg.message_id);
            } catch (deleteError) {
                console.error('Delete loading message error:', deleteError);
            }
            
            await ctx.reply(ctx.t('saveError'), {
                parse_mode: 'HTML'
            })
            
            // Xatolik bo'lsa ham asosiy menuga qaytish
            await mainMenyuConversation(conversation, ctx);
        }
    } else {
        await ctx.reply(ctx.t('registrationCancelled'), {
            parse_mode: 'HTML'
        })
        
        // Bekor qilinganida ham asosiy menuga qaytish
        await mainMenyuConversation(conversation, ctx);
    }
}

export async function reportsConversation(conversation, ctx) {
    const reportsKeyboard = new Keyboard()
        .text(ctx.t('dailyReport'))
        .text(ctx.t('weeklyReport'))
        .row()
        .text(ctx.t('monthlyReport'))
        .text(ctx.t('allReports'))
        .row()
        .text(ctx.t('backToMainMenu'))
        .resized()

    await ctx.reply(ctx.t('reportsMenu'), {
        parse_mode: 'HTML',
        reply_markup: reportsKeyboard
    })

    // Validatsiya funksiyasi
    const validateReportChoice = (message) => {
        const validChoices = [ctx.t('dailyReport'), ctx.t('weeklyReport'), ctx.t('monthlyReport'), ctx.t('allReports'), ctx.t('backToMainMenu')];
        return validChoices.includes(message);
    }

    ctx = await conversation.wait()
    
    if (!validateReportChoice(ctx.message?.text)) {
        do {
            await ctx.reply(ctx.t('wrongChoice'), {
                parse_mode: "HTML",
                reply_markup: reportsKeyboard
            })
            ctx = await conversation.wait()
        } while (!validateReportChoice(ctx.message?.text))
    }

    const choice = ctx.message?.text

    if (choice === ctx.t('backToMainMenu')) {
        await mainMenyuConversation(conversation, ctx);
        return;
    }

    // Hisobot turini aniqlash
    let period = 'all';
    let periodName = ctx.t('allReports');

    switch (choice) {
        case ctx.t('dailyReport'):
            period = 'daily';
            periodName = ctx.t('dailyReport');
            break;
        case ctx.t('weeklyReport'):
            period = 'weekly';
            periodName = ctx.t('weeklyReport');
            break;
        case ctx.t('monthlyReport'):
            period = 'monthly';
            periodName = ctx.t('monthlyReport');
            break;
        case ctx.t('allReports'):
            period = 'all';
            periodName = ctx.t('allReports');
            break;
    }

    try {
        // Loading message yuborish
        const loadingMsg = await ctx.reply(ctx.t('loadingMessage'), {
            parse_mode: 'HTML'
        });

        // Controller orqali hisobotlarni olish
        const result = await getReportsByPeriod(period);
        
        if (result.success) {
            const reports = result.data;
            const count = result.count;

            if (count === 0) {
                // Loading messageni o'chirish
                await ctx.api.deleteMessage(ctx.chat.id, loadingMsg.message_id);
                
                await ctx.reply(`📊 ${periodName}\n\n${ctx.t('noDataFound')}`, {
                    parse_mode: 'HTML'
                });
            } else {
                // Excel faylini yaratish
                const excelResult = exportReportsToExcel(reports, periodName);
                
                if (excelResult.success) {
                    try {
                        // Excel faylini yuborish
                        const file = new InputFile(excelResult.filePath, excelResult.fileName);
                        await ctx.replyWithDocument(file, {
                            caption: `Hisobot turi: ${periodName}\nSoni: ${count} ta`,
                            parse_mode: 'HTML'
                        });

                        // Loading messageni o'chirish
                        await ctx.api.deleteMessage(ctx.chat.id, loadingMsg.message_id);
                        
                        // Temp faylni o'chirish
                        deleteTempFile(excelResult.filePath);
                        
                    } catch (error) {
                        console.error('Document send error:', error);
                        
                        // Loading messageni o'chirish
                        try {
                            await ctx.api.deleteMessage(ctx.chat.id, loadingMsg.message_id);
                        } catch (deleteError) {
                            console.error('Delete loading message error:', deleteError);
                        }
                        
                        await ctx.reply(`${ctx.t('excelSendError')}\n\n📊 ${periodName}\n\n${ctx.t('totalReports', { count })}`, {
                            parse_mode: 'HTML'
                        });
                        
                        // Temp faylni o'chirish
                        deleteTempFile(excelResult.filePath);
                    }
                } else {
                    // Loading messageni o'chirish
                    try {
                        await ctx.api.deleteMessage(ctx.chat.id, loadingMsg.message_id);
                    } catch (deleteError) {
                        console.error('Delete loading message error:', deleteError);
                    }
                    
                    // Excel yaratishda xatolik
                    await ctx.reply(`❌ ${excelResult.message}\n\n📊 ${periodName}\n\n${ctx.t('totalReports', { count })}`, {
                        parse_mode: 'HTML'
                    });
                }
            }
        } else {
            // Loading messageni o'chirish
            try {
                await ctx.api.deleteMessage(ctx.chat.id, loadingMsg.message_id);
            } catch (deleteError) {
                console.error('Delete loading message error:', deleteError);
            }
            
            await ctx.reply(ctx.t('reportError', { message: result.message }), {
                parse_mode: 'HTML'
            });
        }
    } catch (error) {
        console.error('Reports fetch error:', error);
        
        // Loading messageni o'chirish
        try {
            await ctx.api.deleteMessage(ctx.chat.id, loadingMsg.message_id);
        } catch (deleteError) {
            console.error('Delete loading message error:', deleteError);
        }
        
        await ctx.reply(ctx.t('fetchError'), {
            parse_mode: 'HTML'
        });
    }

    // Hisobot ko'rsatilgandan keyin asosiy menuga qaytish
    await mainMenyuConversation(conversation, ctx);
}