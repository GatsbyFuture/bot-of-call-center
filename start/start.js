const { Composer } = require('telegraf');
const { start_fun } = require('../controller/function');
const { check_user_with_key, check_user_with_telegramid } = require('../model/crudData');
const { bot } = require('../core/run');
const composer = new Composer();

composer.start(async (ctx) => {
    // ctx.reply('Marhamat xush kelibsiz!');
    try {
        ctx.session.checkCustomer = undefined;
        ctx.session.checkDriver = undefined;
        ctx.session.checkSeller = undefined;

        // console.log(ctx.startPayload);
        ctx.session.chat_id = ctx.message.from.id;
        // chat id bo'yicha bazadan tekshirib ko'radi mavjudligini foydalanuvchini...
        let data = await check_user_with_telegramid(ctx.message.from.id);
        if (data["customer"] || data["driver"] || data["seller"]) {
            if (data["customer"])
                ctx.session.checkCustomer = true;
            else if (data["driver"])
                ctx.session.checkDriver = true;
            else if (data["seller"])
                ctx.session.checkSeller = true;
            // funksiyalarni ochish...
            await start_fun(ctx);
        } else if (ctx.startPayload) {
            let check = await check_user_with_key(ctx.message.from.id, ctx.startPayload);
            if (check["customer"])
                ctx.session.checkCustomer = true;
            else if (check["driver"])
                ctx.session.checkDriver = true;
            else if (check["seller"])
                ctx.session.checkSeller = true;
            // funksiyalarni ochish...
            await start_fun(ctx);
        } else {
            ctx.replyWithHTML("Bu botga faqat sms orqali kelgan silka yordamida kirishingiz mumkin!")
        }
    } catch (err) {
        console.log(err);
    }
});

bot.use(composer.middleware())