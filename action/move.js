const { Composer } = require('telegraf');
const { youWantConnect, pushContanct, functions_for_driver, allBaseBtn, show_data_board } = require('../controller/function');
const Extra = require('telegraf/extra');
const Markup = require("telegraf/markup");
const { bot } = require("../core/run");
const { get_product_data,
} = require('../model/crudData');
const composer = new Composer();
// choise language actions...
composer.action('rus', async (ctx) => {
    try {
        if (ctx.session.checkUser) {
            ctx.i18n.locale('ru');
            await allBaseBtn(ctx);
        } else if (ctx.session.checkDriver) {
            ctx.i18n.locale('ru');
            await functions_for_driver(ctx)
        } else {
            ctx.i18n.locale('ru');
            await youWantConnect(ctx);
        }
        ctx.deleteMessage().then();;
    } catch (err) {
        console.log(err);
    }
});
composer.action('uz', async (ctx) => {
    try {
        if (ctx.session.checkUser) {
            ctx.i18n.locale('oz');
            await allBaseBtn(ctx);
        } else if (ctx.session.checkDriver) {
            ctx.i18n.locale('oz');
            await functions_for_driver(ctx)
        } else {
            ctx.i18n.locale('oz');
            await youWantConnect(ctx);
        }
        ctx.deleteMessage().then();;
    } catch (err) {
        console.log(err);
    }
});
composer.action('уз', async (ctx) => {
    try {
        if (ctx.session.checkUser) {
            ctx.i18n.locale('uz');
            await allBaseBtn(ctx);
        } else if (ctx.session.checkDriver) {
            ctx.i18n.locale('uz');
            await functions_for_driver(ctx)
        } else {
            ctx.i18n.locale('uz');
            await youWantConnect(ctx);
        }
        ctx.deleteMessage().then();;
    } catch (err) {
        console.log(err);
    }
});
// ask tel number of users...
composer.action('goru', async (ctx) => {
    try {
        await pushContanct(ctx);
        ctx.deleteMessage().then();;
    } catch (err) {
        console.log(err);
    }
});
composer.action('gouz', async (ctx) => {
    try {
        await pushContanct(ctx);
        ctx.deleteMessage().then();;
    } catch (err) {
        console.log(err);
    }
});
composer.action('goуз', async (ctx) => {
    try {
        await pushContanct(ctx);
        ctx.deleteMessage().then();;
    } catch (err) {
        console.log(err);
    }
});
// Arxiv ro'yxatidan ortga qaytish...
composer.action("exitBoard", async (ctx) => {
    try {
        ctx.deleteMessage().then();
        await functions_for_driver(ctx);
        ctx.session.show_board = undefined;
    } catch (err) {
        console.log("Tovar ro'yxatidan ortga chiqarishda xatolik: " + err);
    }
});
// Arxivni keyingi oyga o'tkazish ...
composer.action("nextBoard", async (ctx) => {
    try {
        if (ctx.session.count < ctx.session.get_optimal_id.length - 1) {
            ++ctx.session.count;
            // productni olib olish..
            let product = await get_product_data(ctx.session.get_optimal_id[ctx.session.count]);

            let btn_type = [];
            if (0 < ctx.session.id_balans && product["status_of_deliver"] != 2 && product["status_of_deliver"] != 3) {
                btn_type.push(Markup.callbackButton(ctx.i18n.t('delivered'), 'deliver_done'));
                btn_type.push(Markup.callbackButton(ctx.i18n.t('no_deliver'), 'deliver_error'));
            } else if (ctx.session.id_balans == 0) {
                btn_type.push(Markup.callbackButton(ctx.i18n.t('done_all_products'), 'done_all_products'));
            }
            let status_text = "";
            if (product["status_of_deliver"] == 2) {
                status_text.concat((ctx.i18n.t('status_deleved1')))
            } else if (product["status_of_deliver"] == 3) {
                status_text.concat((ctx.i18n.t('status_deleved2')))
            }
            // olib kelingan productni textini yasab olish...
            const show_board0 = await show_data_board(ctx, product);

            await ctx.telegram
                .sendMessage(ctx.session.chat_id,
                    show_board0 + `\n\🧮 Product statusi : ${status_text}`, {
                    reply_markup: Markup.inlineKeyboard([
                        [{
                            text: ctx.i18n.t('linkLocation'),
                            url: ctx.session.optimal_url
                        }],
                        btn_type,
                        [
                            Markup.callbackButton('⬅️', 'backBoard'),
                            Markup.callbackButton('❌', 'exitBoard'),
                            Markup.callbackButton('➡️', 'nextBoard'),
                        ],
                    ]),
                    parse_mode: 'html'
                })
                .then();
        } else {
            await ctx.answerCbQuery('Tovardagi oxirgisi!');
        }
    } catch (err) {
        console.log(err);
        console.log("Arxiv ro'yxatini oldinga harakatida xatolik: " + err);
    }
});
// Arxivni oldingi oyga o'tkazish...
composer.action("backBoard", async (ctx) => {
    try {
        // console.log(ctx.session.count);
        if (0 < ctx.session.count) {
            --ctx.session.count;
            let product = await get_product_data(ctx.session.get_optimal_id[ctx.session.count]);

            let btn_type = [];
            if (0 < ctx.session.id_balans && product["status_of_deliver"] != 2 && product["status_of_deliver"] != 3) {
                btn_type.push(Markup.callbackButton(ctx.i18n.t('delivered'), 'deliver_done'));
                btn_type.push(Markup.callbackButton(ctx.i18n.t('no_deliver'), 'deliver_error'));
            } else if (ctx.session.id_balans == 0) {
                btn_type.push(Markup.callbackButton(ctx.i18n.t('done_all_products'), 'done_all_products'));
            }
            let status_text = "";
            if (product["status_of_deliver"] == 2) {
                status_text.concat((ctx.i18n.t('status_deleved1')))
            } else if (product["status_of_deliver"] == 3) {
                status_text.concat((ctx.i18n.t('status_deleved2')))
            }
            // olib kelingan productni textini yasab olish...
            const show_board0 = await show_data_board(ctx, product);

            await ctx.telegram
                .sendMessage(ctx.session.chat_id,
                    show_board0 + `\n\🧮 Product statusi : ${status_text}`, {
                    reply_markup: Markup.inlineKeyboard([
                        [{
                            text: ctx.i18n.t('linkLocation'),
                            url: ctx.session.optimal_url
                        }],
                        btn_type,
                        [
                            Markup.callbackButton('⬅️', 'backBoard'),
                            Markup.callbackButton('❌', 'exitBoard'),
                            Markup.callbackButton('➡️', 'nextBoard'),
                        ],
                    ]),
                    parse_mode: 'html'
                })
                .then();

        } else {
            await ctx.answerCbQuery('Birinchi Tovar !');
        }
    } catch (err) {
        console.log("Arxiv ro'yxatini ortga harakatida xatolik: " + err);
    }
});
bot.use(composer.middleware());