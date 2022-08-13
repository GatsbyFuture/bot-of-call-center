const { Composer } = require('telegraf');
const {
    Btns_for_driver, Btn_for_customer,
    show_data_board, check_session } = require('../controller/function');
const Extra = require('telegraf/extra');
const Markup = require("telegraf/markup");
const { bot } = require("../core/run");
const { get_product_data, update_delever_status,
    update_driver_busy
} = require('../model/crudData');
const composer = new Composer();
// choise language actions...
composer.action('ru', async (ctx) => {
    try {
        // console.log(ctx);
        if (ctx.session.checkCustomer) {
            ctx.i18n.locale('ru');
            // await Btn_for_customer(ctx);
        } else if (ctx.session.checkDriver) {
            ctx.i18n.locale('ru');
            await Btns_for_driver(ctx)
        } else if (ctx.session.checkSeller) {
            ctx.i18n.locale('ru');
            // await Btn_for_customer(ctx);
        } else {
            await check_session(ctx);
        }
        ctx.deleteMessage().then();
    } catch (err) {
        console.log(err);
    }
});
composer.action('oz', async (ctx) => {
    try {
        if (ctx.session.checkCustomer) {
            ctx.i18n.locale('oz');
            // await Btn_for_customer(ctx);
        } else if (ctx.session.checkDriver) {
            ctx.i18n.locale('oz');
            await Btns_for_driver(ctx)
        } else if (ctx.session.checkSeller) {
            ctx.i18n.locale('oz');
            // await Btn_for_seller(ctx);
        } else {
            await check_session(ctx);
        }
        ctx.deleteMessage().then();;
    } catch (err) {
        console.log(err);
    }
});
composer.action('uz', async (ctx) => {
    try {
        if (ctx.session.checkCustomer) {
            ctx.i18n.locale('uz');
            // await Btn_for_customer(ctx);
        } else if (ctx.session.checkDriver) {
            ctx.i18n.locale('uz');
            await Btns_for_driver(ctx)
        } else if (ctx.session.checkSeller) {
            ctx.i18n.locale('uz');
            // await Btn_for_customer(ctx);
        } else {
            await check_session(ctx);
        }
        ctx.deleteMessage().then();;
    } catch (err) {
        console.log(err);
    }
});
// product doskadan ortga qaytish...
composer.action("exit_board", async (ctx) => {
    try {
        ctx.deleteMessage().then();
        await Btns_for_driver(ctx);
        ctx.session.show_board = undefined;
    } catch (err) {
        console.log("Tovar ro'yxatidan ortga chiqarishda xatolik: " + err);
    }
});
// productni keyingisiga o'tkazish...
composer.action("nextBoard", async (ctx) => {
    try {

        if (ctx.session.count < ctx.session.get_optimal_id.length - 1) {
            ++ctx.session.count;
            // productni olib olish..
            let product = await get_product_data(ctx.session.get_optimal_id[ctx.session.count]);

            let btn_type = [];
            if (0 < ctx.session.id_balans && product["status_of_deliver"] != 2 && product["status_of_deliver"] != 3 && product["status_of_deliver"] != 4 && product["status_of_deliver"] != 5) {
                btn_type.push([
                    Markup.callbackButton(ctx.i18n.t('delivered1'), 'deliver1'),
                    Markup.callbackButton(ctx.i18n.t('delivered2'), 'deliver2')
                ]);
                btn_type.push([
                    Markup.callbackButton(ctx.i18n.t('delivered3'), 'deliver3'),
                    Markup.callbackButton(ctx.i18n.t('delivered4'), 'deliver4')
                ]);
            } else if (ctx.session.id_balans == 0) {
                btn_type.push(Markup.callbackButton(ctx.i18n.t('done_all_products'), 'done_all_products'));
            }
            let status_text = ctx.i18n.t('procces_of_deliver');
            if (product["status_of_deliver"] == 2) {
                status_text = ctx.i18n.t('status_deleved1');
            } else if (product["status_of_deliver"] == 3) {
                status_text = ctx.i18n.t('status_deleved2');
            }
            // olib kelingan productni textini yasab olish...
            const show_board0 = await show_data_board(ctx, product);

            await ctx.editMessageText(show_board0 + `\n\n🧮 Product statusi : ${status_text}`, {
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
            await ctx.answerCbQuery('Oxirgi tavar!');
        }
    } catch (err) {
        console.log(err);
        console.log("Arxiv ro'yxatini oldinga harakatida xatolik: " + err);
    }
});
// productni orqaga o'tkazish...
composer.action("backBoard", async (ctx) => {
    try {
        // console.log(ctx.session.count);
        if (0 < ctx.session.count) {
            --ctx.session.count;
            let product = await get_product_data(ctx.session.get_optimal_id[ctx.session.count]);

            let btn_type = [];
            if (0 < ctx.session.id_balans && product["status_of_deliver"] != 2 && product["status_of_deliver"] != 3 && product["status_of_deliver"] != 4 && product["status_of_deliver"] != 5) {
                btn_type.push([
                    Markup.callbackButton(ctx.i18n.t('delivered1'), 'deliver1'),
                    Markup.callbackButton(ctx.i18n.t('delivered2'), 'deliver2')
                ]);
                btn_type.push([
                    Markup.callbackButton(ctx.i18n.t('delivered3'), 'deliver3'),
                    Markup.callbackButton(ctx.i18n.t('delivered4'), 'deliver4')
                ]);
            } else if (ctx.session.id_balans == 0) {
                btn_type.push(Markup.callbackButton(ctx.i18n.t('done_all_products'), 'done_all_products'));
            }
            let status_text = ctx.i18n.t('procces_of_deliver');
            if (product["status_of_deliver"] == 2) {
                status_text = ctx.i18n.t('status_deleved1');
            } else if (product["status_of_deliver"] == 3) {
                status_text = ctx.i18n.t('status_deleved2');
            }
            // olib kelingan productni textini yasab olish...
            const show_board0 = await show_data_board(ctx, product);

            await ctx.editMessageText(show_board0 + `\n\n🧮 Product statusi : ${status_text}`, {
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
            await ctx.answerCbQuery('Birinchi tovar!');
        }
    } catch (err) {
        console.log("Arxiv ro'yxatini ortga harakatida xatolik: " + err);
    }
});
// tovarni yetkazib berilganligi haqida bildirilganda delever statusni 2 ga ko'tarib qo'yish...
composer.action("deliver1", async (ctx) => {
    try {
        --ctx.session.id_balans;
        // productni deliver statusini 2 ga ko'tarib qo'yish...
        await update_delever_status(ctx.session.get_optimal_id[ctx.session.count], 2);

        // optimal id bo'yicha productni bazadan olib kelish...
        let product = await get_product_data(ctx.session.get_optimal_id[ctx.session.count]);
        // statuslarni belgilab olish...
        let btn_type = [];
        if (0 < ctx.session.id_balans && product["status_of_deliver"] != 2 && product["status_of_deliver"] != 3 && product["status_of_deliver"] != 4 && product["status_of_deliver"] != 5) {
            btn_type.push([
                Markup.callbackButton(ctx.i18n.t('delivered1'), 'deliver1'),
                Markup.callbackButton(ctx.i18n.t('delivered2'), 'deliver2')
            ]);
            btn_type.push([
                Markup.callbackButton(ctx.i18n.t('delivered3'), 'deliver3'),
                Markup.callbackButton(ctx.i18n.t('delivered4'), 'deliver4')
            ]);
        } else if (ctx.session.id_balans == 0) {
            btn_type.push(Markup.callbackButton(ctx.i18n.t('done_all_products'), 'done_all_products'));
        }
        let status_text = ctx.i18n.t('procces_of_deliver');
        if (product["status_of_deliver"] == 2) {
            status_text = ctx.i18n.t('status_deleved1');
        } else if (product["status_of_deliver"] == 3) {
            status_text = ctx.i18n.t('status_deleved2');
        }
        // olib kelingan productni textini yasab olish...
        const show_board0 = await show_data_board(ctx, product);

        await ctx.editMessageText(show_board0 + `\n\n🧮 Product statusi : ${status_text}`, {
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

    } catch (err) {
        console.log("Update delever data to 2: " + err);
    }
});
// tovarni yetkazib beraolmaganli haqida bildirilganda delever statusni 3 ga ko'tarib qo'yish...
composer.action("deliver2", async (ctx) => {
    try {
        --ctx.session.id_balans;
        // productni deliver statusini 3 ga ko'tarib qo'yish...
        await update_delever_status(ctx.session.get_optimal_id[ctx.session.count], 3);

        // optimal id bo'yicha productni bazadan olib kelish...
        let product = await get_product_data(ctx.session.get_optimal_id[ctx.session.count]);
        // statuslarni belgilab olish...
        let btn_type = [];
        if (0 < ctx.session.id_balans && product["status_of_deliver"] != 2 && product["status_of_deliver"] != 3 && product["status_of_deliver"] != 4 && product["status_of_deliver"] != 5) {
            btn_type.push([
                Markup.callbackButton(ctx.i18n.t('delivered1'), 'deliver1'),
                Markup.callbackButton(ctx.i18n.t('delivered2'), 'deliver2')
            ]);
            btn_type.push([
                Markup.callbackButton(ctx.i18n.t('delivered3'), 'deliver3'),
                Markup.callbackButton(ctx.i18n.t('delivered4'), 'deliver4')
            ]);
        } else if (ctx.session.id_balans == 0) {
            btn_type.push(Markup.callbackButton(ctx.i18n.t('done_all_products'), 'done_all_products'));
        }
        let status_text = ctx.i18n.t('procces_of_deliver');
        if (product["status_of_deliver"] == 2) {
            status_text = ctx.i18n.t('status_deleved1');
        } else if (product["status_of_deliver"] == 3) {
            status_text = ctx.i18n.t('status_deleved2');
        }
        // olib kelingan productni textini yasab olish...
        const show_board0 = await show_data_board(ctx, product);

        await ctx.editMessageText(show_board0 + `\n\n🧮 Product statusi : ${status_text}`, {
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

    } catch (err) {
        console.log("Update delever data to 3: " + err);
    }
});
// tovarni yetkazib beraolmaganli haqida bildirilganda delever statusni 4 ga ko'tarib qo'yish...
composer.action("deliver3", async (ctx) => {
    try {
        --ctx.session.id_balans;
        // productni deliver statusini 3 ga ko'tarib qo'yish...
        await update_delever_status(ctx.session.get_optimal_id[ctx.session.count], 4);

        // optimal id bo'yicha productni bazadan olib kelish...
        let product = await get_product_data(ctx.session.get_optimal_id[ctx.session.count]);
        // statuslarni belgilab olish...
        let btn_type = [];
        if (0 < ctx.session.id_balans && product["status_of_deliver"] != 2 && product["status_of_deliver"] != 3 && product["status_of_deliver"] != 4 && product["status_of_deliver"] != 5) {
            btn_type.push([
                Markup.callbackButton(ctx.i18n.t('delivered1'), 'deliver1'),
                Markup.callbackButton(ctx.i18n.t('delivered2'), 'deliver2')
            ]);
            btn_type.push([
                Markup.callbackButton(ctx.i18n.t('delivered3'), 'deliver3'),
                Markup.callbackButton(ctx.i18n.t('delivered4'), 'deliver4')
            ]);
        } else if (ctx.session.id_balans == 0) {
            btn_type.push(Markup.callbackButton(ctx.i18n.t('done_all_products'), 'done_all_products'));
        }
        let status_text = ctx.i18n.t('procces_of_deliver');
        if (product["status_of_deliver"] == 2) {
            status_text = ctx.i18n.t('status_deleved1');
        } else if (product["status_of_deliver"] == 3) {
            status_text = ctx.i18n.t('status_deleved2');
        }
        // olib kelingan productni textini yasab olish...
        const show_board0 = await show_data_board(ctx, product);

        await ctx.editMessageText(show_board0 + `\n\n🧮 Product statusi : ${status_text}`, {
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

    } catch (err) {
        console.log("Update delever data to 3: " + err);
    }
});
// tovarni yetkazib beraolmaganli haqida bildirilganda delever statusni 5 ga ko'tarib qo'yish...
composer.action("deliver4", async (ctx) => {
    try {
        --ctx.session.id_balans;
        // productni deliver statusini 3 ga ko'tarib qo'yish...
        await update_delever_status(ctx.session.get_optimal_id[ctx.session.count], 5);

        // optimal id bo'yicha productni bazadan olib kelish...
        let product = await get_product_data(ctx.session.get_optimal_id[ctx.session.count]);
        // statuslarni belgilab olish...
        let btn_type = [];
        if (0 < ctx.session.id_balans && product["status_of_deliver"] != 2 && product["status_of_deliver"] != 3 && product["status_of_deliver"] != 4 && product["status_of_deliver"] != 5) {
            btn_type.push([
                Markup.callbackButton(ctx.i18n.t('delivered1'), 'deliver1'),
                Markup.callbackButton(ctx.i18n.t('delivered2'), 'deliver2')
            ]);
            btn_type.push([
                Markup.callbackButton(ctx.i18n.t('delivered3'), 'deliver3'),
                Markup.callbackButton(ctx.i18n.t('delivered4'), 'deliver4')
            ]);
        } else if (ctx.session.id_balans == 0) {
            btn_type.push(Markup.callbackButton(ctx.i18n.t('done_all_products'), 'done_all_products'));
        }
        let status_text = ctx.i18n.t('procces_of_deliver');
        if (product["status_of_deliver"] == 2) {
            status_text = ctx.i18n.t('status_deleved1');
        } else if (product["status_of_deliver"] == 3) {
            status_text = ctx.i18n.t('status_deleved2');
        }
        // olib kelingan productni textini yasab olish...
        const show_board0 = await show_data_board(ctx, product);

        await ctx.editMessageText(show_board0 + `\n\n🧮 Product statusi : ${status_text}`, {
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

    } catch (err) {
        console.log("Update delever data to 3: " + err);
    }
});

// barcha productni egasiga yetkazib berilgandan keyin...
composer.action("done_all_products", async (ctx) => {
    try {
        await update_driver_busy(ctx.session.chat_id);
        await ctx.editMessageText(ctx.i18n.t('finished_deliver'), {
            parse_mode: 'html'
        })
            .then();
        await functions_for_driver(ctx)
        ctx.session.id_balans = undefined;
        ctx.session.optimal_url = undefined;
        ctx.session.get_optimal_id = undefined;
        ctx.session.count = undefined;
    } catch (err) {
        console.log("Update delever data to 3: " + err);
    }
});


bot.use(composer.middleware());