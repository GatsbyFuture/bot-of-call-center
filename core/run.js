const { Telegraf } = require('telegraf');
const session = require("telegraf/session");
require('dotenv').config({ path: "./environment/.env" });
const config = require('config');
const bot = new Telegraf(config.get('bot_token'));
// Middleware functions ...
// bot.use(Telegraf.log());
const TelegrafI18n = require("telegraf-i18n");
const path = require("path");
bot.use(session());

const i18n = new TelegrafI18n({
    defaultLanguage: "ru",
    useSession: true,
    defaultLanguageOnMissing: true,
    directory: path.resolve(__dirname, "locales"),
});

bot.use(i18n.middleware());

// chack the bot, it is working or not
bot
    .launch()
    .then(() => {
        console.log("callcenterbot ishga tushdi...");
    })
    .catch((err) => {
        console.log("bot ishga tushishida xatolik..." + err);
    });
module.exports = {
    bot
}