// there are all function in this page...
const { bot } = require("../core/run");
const axios = require('axios').default;
const Extra = require('telegraf/extra');
const Markup = require("telegraf/markup");
const https = require('https');
const XLSX = require('xlsx');
const fs = require('fs');
const {
    data_dateW,
    data_userW,
} = require('../model/packData');
const {
    check_user_with_telegramid,
    check_number,
    all_users_id,
    driver_is_busy,
    get_optimal_url,
    get_optimal_id,
    get_product_data,
    amout_of_deliver
} = require('../model/crudData');
String.prototype.insert = function (index, string) {
    var ind = index < 0 ? this.length + index : index;
    return this.substring(0, ind) + string + this.substring(ind);
};
// session topilmay qolganda bazadan tekshirib olish bor yo'qligini userni
const check_session = async (ctx) => {
    // console.log(ctx);
    let data = await check_user_with_telegramid(ctx.update.callback_query.from.id);
    if (data["customer"] || data["driver"] || data["seller"]) {
        ctx.i18n.locale(ctx.update.callback_query.data);
        if (data["customer"]) {
            ctx.session.checkCustomer = true;
            await Btn_for_customer(ctx);
        }
        else if (data["driver"]) {
            ctx.session.checkDriver = true;
            await functions_for_driver(ctx)
        }
        else if (data["seller"]) {
            ctx.session.checkSeller = true;
            await Btn_for_customer(ctx);
        }
    } else {
        ctx.replyWithHTML("Iltimos qayta /start buyrug'ini bosing!")
    }
}

// start bosganda ishga tushadigan function...
const start_fun = async (ctx) => {
    await ctx.replyWithHTML("<b>Tilni tanlang | Тилни танланг \n Выберите язык ⬇️</b>",
        Extra.markup(
            Markup.inlineKeyboard([
                [Markup.callbackButton(`🇷🇺  Rus`, `ru`)],
                [Markup.callbackButton(`🇺🇿  Uzb`, `oz`)],
                [Markup.callbackButton(`🇺🇿  Узб`, `uz`)]
            ])
        )
    ).then();
}
const Btns_for_driver = async (ctx) => {
    try {
        // tekshirib ko'ramiz agar bad bo'lsa unga tavar btn qo'shib beramiz...
        let isTrue = await driver_is_busy(ctx.update.callback_query.from.id);
        let btn = [];
        if (isTrue) {
            btn = [
                [ctx.i18n.t('mainDriverbtn2'), ctx.i18n.t('mainDriverbtn3')],
                [ctx.i18n.t('changeLang')]
            ];
        } else {
            btn = [
                [ctx.i18n.t('mainDriverbtn1')],
                [ctx.i18n.t('changeLang')]
            ];
        }
        await ctx.replyWithHTML(btn[0].length == 1 ? ctx.i18n.t('driver_btn1') : ctx.i18n.t('driver_btn2'),
            Markup.keyboard(btn)
                .oneTime()
                .resize()
                .extra()
        ).then();
    } catch (err) {
        console.log(err);
    }
}
// yandex xaritaga o'ish uchun
const Draw_yandex_route = async (ctx) => {
    try {
        let optimal_url = await get_optimal_url(ctx.message.from.id);
        await ctx.telegram.sendPhoto({
            chat_id: ctx.message.from.id,
            photo: "../imgs/mapIcon.jpg",
            caption: ctx.i18n.t('description_for_map'),
            parse_mode: "markdown",
            reply_markup: Markup.inlineKeyboard([
                [{
                    text: ctx.i18n.t('linkLocation'),
                    url: optimal_url
                }],
                [
                    Markup.callbackButton('❌', 'exit_board'),
                ],
            ]),

        }
        );
    } catch (error) {
        console.log(error);
    }
}

// customer uchun asosiy btn larni chiqarish...
const Btn_for_customer = async (ctx) => {
    await ctx.replyWithHTML(ctx.i18n.t('mainFuntion3'),
        Markup.keyboard([
            [{
                text: ctx.i18n.t('mainFuntion0'),
                request_location: true
            }],
            [ctx.i18n.t('mainFuntion1')],
            [ctx.i18n.t('mainFuntion2')]
        ])
            .oneTime()
            .resize()
            .extra()
    )
        .then();
}
// customer uchun asosiy btn larni chiqarish...
const Btn_for_seller = async (ctx) => {
    await ctx.replyWithHTML(ctx.i18n.t('mainFuntion3'),
        Markup.keyboard([
            [{
                text: ctx.i18n.t('mainFuntion0'),
                request_location: true
            }],
            [ctx.i18n.t('mainFuntion1')],
            [ctx.i18n.t('mainFuntion2')]
        ])
            .oneTime()
            .resize()
            .extra()
    )
        .then();
}

// arxiv datani bittalab olib kelish bazadan...
const show_ready_product = async (ctx) => {
    try {
        await ctx.reply(
            ctx.i18n.t('load'),
            {
                parse_mode: "markdown",
                reply_markup: { remove_keyboard: true },
            }
        );
        // productlarni urlni olib kelish...
        ctx.session.optimal_url = await get_optimal_url(ctx.message.from.id);
        // tablitsa qilib driverga ko'rsatish (optimal ketma - ketlikni nomerini olib olish)..
        ctx.session.get_optimal_id = await get_optimal_id(ctx.message.from.id);
        // tekshiramiz agar malumotlar yetkazilsa yoki yo'q shunga qarb kamayib borishini balans qilamiz..
        // ctx.session.id_balans = ctx.session.get_optimal_id.length;
        ctx.session.id_balans = await amout_of_deliver(ctx.session.get_optimal_id);
        // console.log(ctx.session.get_optimal_id.length);
        ctx.session.count = 0;
        // productni olib kelish..
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
        await ctx.telegram
            .sendMessage(ctx.message.from.id,
                show_board0 + `\n\n🧮 Product statusi : ${status_text}`, {
                reply_markup: Markup.inlineKeyboard([
                    [{
                        text: ctx.i18n.t('linkLocation'),
                        url: ctx.session.optimal_url
                    }],
                    btn_type,
                    [
                        Markup.callbackButton('⬅️', 'backBoard'),
                        Markup.callbackButton('❌', 'exit_board'),
                        Markup.callbackButton('➡️', 'nextBoard'),
                    ],
                ]),
                parse_mode: 'html'
            })
            .then();

    } catch (err) {
        console.log("barcha product boardini chiqarishda xatolik: " + err);
    }
}
// haydovchini 1 oyik xisoboti uchun...





// arxivdan malumotlarni tortib kelish va taqdim etish...
// const show_ready_product = async (ctx) => {
//     try {
//         await ctx.reply(
//             ctx.i18n.t('load'),
//             {
//                 parse_mode: "markdown",
//                 reply_markup: { remove_keyboard: true },
//             }
//         );
//         // productlarni urlni olib kelish...
//         ctx.session.optimal_url = await get_optimal_url(ctx.session.chat_id);
//         // tablitsa qilib driverga ko'rsatish (optimal ketma - ketlikda)..
//         ctx.session.show_board = await need_data(ctx.message.from.id);
//         // console.log(ctx.session.show_board);
//         if (0 < ctx.session.show_board.length) {
//             ctx.session.count = 0;
//             const show_board0 = await show_data_board(ctx, ctx.session.show_board[ctx.session.count]);
//             await ctx.telegram
//                 .sendMessage(ctx.message.from.id,
//                     show_board0, {
//                     reply_markup: Markup.inlineKeyboard([
//                         [{
//                             text: ctx.i18n.t('linkLocation'),
//                             url: ctx.session.optimal_url
//                         }],
//                         [
//                             Markup.callbackButton(ctx.i18n.t('delivered'), 'deliver_done')
//                         ],
//                         [
//                             Markup.callbackButton('⬅️', 'backBoard'),
//                             Markup.callbackButton('❌', 'exitBoard'),
//                             Markup.callbackButton('➡️', 'nextBoard'),
//                         ],
//                     ]),
//                     parse_mode: 'html'
//                 })
//                 .then();
//         } else {
//             ctx.replyWithHTML("Tizimda xatolik yuz berdi").then();
//         }
//     } catch (err) {
//         console.log("barcha product boardini chiqarishda xatolik: " + err);
//     }
// }
// get my location...
// const show_addr = async (ctx) => {
//     try {
//         await axios.post(`https://api.routexl.com/tour`, {
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded',
//             },
//             auth: {
//                 username: 'Eldorbek',
//                 password: 'Gatsby_13!'
//               },
//             params: {
//                 'locations': JSON.stringify([
//                     { 'name': '1', 'lat': 52.054290, 'lng': 4.248618 },
//                     { 'name': '2', 'lat': 52.076892, 'lng': 4.269750 },
//                     { 'name': '3', 'lat': 51.669946, 'lng': 5.618520 },
//                     { 'name': '4', 'lat': 51.589548, 'lng': 5.432482 },
//                     { 'name': '5', 'lat': 52.370200, 'lng': 4.895100, 'restrictions': { 'ready': 15, 'due': 60 } },
//                     { 'name': '6', 'lat': 52.054290, 'lng': 4.248618 }
//                 ])
//             }
//         })
//             .then((result) => {
//                 // console.log(result.data.result.file_path);
//                 console.log(result);
//             })
//             .catch((err) => {
//                 console.log(err);
//             })


//     } catch (err) {
//         console.log("Arxivning boardini chiqarishda xatolik: " + err);
//     }
// }





// want to change language...
const mainThree = async (ctx) => {
    try {
        if (ctx.session.exit_type) {
            await ctx.reply(
                ctx.i18n.t('load'),
                {
                    parse_mode: "markdown",
                    reply_markup: { remove_keyboard: true },
                }
            );
            ctx.session.adminx = undefined;
        } else {
            await ctx.reply(
                ctx.i18n.t('load'),
                {
                    parse_mode: "markdown",
                    reply_markup: { remove_keyboard: true },
                }
            );
            ctx.session.allBaseBtn = undefined;
        }
        await start_fun(ctx);
    } catch (err) {
        console.log(err);
    }
}
// Admin panel uchun functions
const main_buttons = async (ctx) => {
    ctx.session.exit_type = true;
    await ctx.replyWithHTML(ctx.i18n.t("addmin_desc"),
        Markup.keyboard([
            [ctx.i18n.t("send_file_btn"), ctx.i18n.t("read_file_btn")],
            [ctx.i18n.t("send_message_btn")],
            // ["🔍 Qidirish"],
            [ctx.i18n.t('mainFuntion2')]

        ])
            .oneTime()
            .resize()
            .extra()
    )
        .then();
}
// send post ...
const send_post = async (ctx) => {
    await ctx.replyWithHTML(ctx.i18n.t('correct_message'),
        Markup.keyboard([
            [ctx.i18n.t("send_post")],
            [ctx.i18n.t("post_cancel")],
        ])
            .oneTime()
            .resize()
            .extra()
    )
        .then();
    ctx.session.send_m = undefined;
}


// barcha userlarga chatni automatik tarzda yuborish...
const send_message = async (ctx) => {
    try {
        let users_id = await all_users_id();
        // console.log(users_id);
        // ctx.replyWithHTML(ctx.i18n.t('accept_message'));
        // ctx.session.message_id = ctx.message.message_id;
        let i = 0;
        let stop = setInterval(() => {
            // console.log(users_id[i]["chat_id"]);
            // bot.telegram.editMessageText(ctx.message.from.id, ctx.session.message_id, ctx.i18n.t('accept_message') + (i + 1));
            // console.log(key);
            if (i < users_id.length) {
                if (users_id[i]["chat_id"]) {
                    ctx.telegram
                        .sendMessage(users_id[i]["chat_id"], ctx.session.message_text)
                        .then((Response) => {
                            // console.log("userga yuborildi!");
                        })
                        .catch((err) => {
                            console.log("blocklangan user!");
                        });
                }
                i++;
            } else {
                clearInterval(stop);
                console.log("Userlarga jo'natilish yakunlandi...");
                ctx.session.message_id = undefined;
            }
        }, 50);
        await main_buttons(ctx)
    } catch (err) {
        console.log("Barchaga chat yuborishda xatolik: " + err);
    }
}
// arxive datani chiqarish...
const show_data_board = async (ctx, data) => {
    try {
        // console.log(data);
        if (data != undefined) {
            return ctx.i18n.t("show_ready_products")
                .replace('{n0}', ctx.session.count + 1)
                .replace('{n1}', data["started_time"].toString().substring(0, 24))
                .replace('{n2}', data["lastname"])
                .replace('{n3}', data["name"])
                .replace('{n4}', data["phone_number"])
                .replace('{n5}', data["product_name"])
                .replace('{n6}', data["shipment_payment"] == 1 ? "To'langan" : "To'lanmagan")
                .replace('{n7}', data["product_payment"] == 1 ? "To'langan" : "To'lanmagan")
        } else {
            return "Sizda Tovarlar mavjud emas!";
        }
    } catch (err) {
        console.log("Tovar datasini to'g'irlab chiqarishda xatolik: " + err);
    }
}

// numberni tekshirish...
const isItNumber = async (params) => {
    // nomer kelganda orqa oldida yoki o'rtasida "-" yoki " " joylarni tozlash.
    const x = params.trim().replace(/ /g, "");
    if (/^\+998\d/.test(x)) {
        return x.substring(1);
    } else {
        return x;
    }
}
module.exports = {
    check_session,
    start_fun,
    Btn_for_customer,
    mainThree,
    show_data_board,
    main_buttons,
    show_ready_product,
    send_post,
    send_message,
    isItNumber,
    Btns_for_driver,
    Draw_yandex_route,

}