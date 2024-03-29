const { Composer } = require('telegraf');
const { bot } = require('../core/run');
const composer = new Composer();
const {
    start_fun,
    Btns_for_driver,
    Draw_yandex_route,
    mainThree,
    main_buttons,
    show_ready_product,
    Btn_for_seller,
    get_delevery,
    send_post,
    send_message,
    isItNumber,
} = require('../controller/function.js');
const { add_location } = require('../model/crudData');
const config = require('config');
// my chat_id 1563800631 
composer.on('message', async (ctx) => {
    try {
        if (ctx.message.location) {
            ctx.reply("locatsiya tashlandi!");
            console.log(ctx.update.message.location);
            let result = await add_location(ctx.update.message.from.id, ctx.update.message.location);
            if (result)
                ctx.replyWithHTML("Lokatsiya muofiqiyatli yuborildi!");
            else
                ctx.replyWithHTML("Lokatsiyani yuborishda xatolik qayta urinib ko'ring!");
        }
        // asosiy menular bilan ishlash...
        switch (ctx.message.text) {
            // driver uchun asosiy btn larni ochib berish..
            case ctx.i18n.t('mainDriverbtn1'):
                await Btns_for_driver(ctx);
                break;
            // yandexga o'tish uchun kartani koordinatalarini berish uchun
            case ctx.i18n.t('mainDriverbtn2'):
                await Draw_yandex_route(ctx);
                break;
            // driver o'zini yetkazib berishi kerak bo'lgan tovarlarini ro'yxatini ko'rish...
            case ctx.i18n.t('mainDriverbtn3'):
                await show_ready_product(ctx);
                break;
            // seller uchun asosiy btn larni ochib berish...
            case ctx.i18n.t('mainSellerbtn1'):
                await get_delevery(ctx);
                break;
            // tilni tanlashga qaytarish...
            case ctx.i18n.t('changeLang'):
                await mainThree(ctx);
                break;


            // admin uchun kirish...
            // case config.get('password_admin'):
            //     await main_buttons(ctx);
            //     ctx.session.admin = true; break;
            // case "exit@0020912":
            //     ctx.session.admin = false;
            //     await allBaseBtn(ctx);
            //     break;
            // case ctx.i18n.t('send_file_btn'): await send_excel(ctx); break;
            // case ctx.i18n.t('read_file_btn'): await read_excel(ctx); break;
            // case ctx.i18n.t('send_message_btn'):
            //     ctx.reply(
            //         ctx.i18n.t('post_report'),
            //         {
            //             parse_mode: "markdown",
            //             reply_markup: { remove_keyboard: true },
            //         }
            //     );
            //     setTimeout(() => {
            //         ctx.session.send_m = true;
            //     }, 100);
            //     break;
            // case ctx.i18n.t('send_post'): await send_message(ctx); break;
            // case ctx.i18n.t('post_cancel'):
            //     ctx.replyWithHTML(ctx.i18n.t('message_cancel'));
            //     await main_buttons(ctx);
            //     ctx.session.message_text = undefined;
            //     await ctx.reply(
            //         ctx.i18n.t('load'),
            //         {
            //             parse_mode: "markdown",
            //             reply_markup: { remove_keyboard: true },
            //         }
            //     );

            //     break;
            // case "🔍 Qidirish": ctx.reply('13');
            default: break;
        }
        // fileni yuklab olish uchun...
        // if (ctx.session.rideFile) {
        //     // console.log(ctx.update.message.document);
        //     if (ctx.update.message.document) {
        //         ctx.session.file_name = await down_excel(ctx);
        //         await main_buttons(ctx);
        //         ctx.session.rideFile = false;
        //     } else {
        //         ctx.replyWithHTML(ctx.i18n.t('message_cancel'));
        //         await main_buttons(ctx);
        //         ctx.session.rideFile = false;
        //     }
        // }
        // if (ctx.session.send_m) {
        //     ctx.session.message_text = ctx.message.text;
        //     console.log(ctx.message.text);
        //     await send_post(ctx);
        // }
    } catch (err) {
        console.log(err);
    }
});

// Admin panel uchun parolni ilib olish...
bot.use(composer.middleware())