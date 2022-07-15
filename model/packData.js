// barcha database bilan oldi berdi shu yerda bo'ladi..
const { pool } = require('../db/connect_db');
const data_dateW = async (date) => {
    try {
        console.log(typeof date);
        await pool.query(
            `insert into date_tb (
                id,
                date_month
            ) values (
                null,
                ?
            )`,
            [date]
        )
    } catch (err) {
        console.log("data_date ga yozishda xatolik :" + err);
    }
}
const data_userW = async (date, data) => {
    try {
        let debt = 0;
        for (let key in data) {
            if (key == "__EMPTY_26" || key == "__EMPTY_22" || key == "__EMPTY_18") {
                debt = debt + parseInt(data[key] == undefined ? 0 : data[key]);
            }
        }
        let array = [
            date,
            null,
            data[date],
            data["__EMPTY_1"] == undefined ? null : data["__EMPTY_1"].toString(),
            data["__EMPTY_2"] == undefined ? null : data["__EMPTY_2"].toString(),
            data["__EMPTY_3"] == undefined ? null : data["__EMPTY_3"].toString(),
            data["__EMPTY_4"] == undefined ? null : data["__EMPTY_4"].toString(),
            data["__EMPTY_5"] == undefined ? null : data["__EMPTY_5"].toString(),
            data["__EMPTY_6"] == undefined ? null : data["__EMPTY_6"].toString(),
            data["__EMPTY_7"] == undefined ? null : data["__EMPTY_7"].toString(),
            data["__EMPTY_8"] == undefined ? null : data["__EMPTY_8"].toString(),
            data["__EMPTY_9"] == undefined ? null : data["__EMPTY_9"].toString(),
            data["__EMPTY_10"] == undefined ? null : data["__EMPTY_10"].toString(),
            data["__EMPTY_11"] == undefined ? null : data["__EMPTY_11"].toString(),
            data["__EMPTY_12"] == undefined ? null : data["__EMPTY_12"].toString(),
            data["__EMPTY_13"] == undefined ? null : data["__EMPTY_13"].toString(),
            data["__EMPTY_14"] == undefined ? null : data["__EMPTY_14"].toString(),
            data["__EMPTY_15"] == undefined ? null : data["__EMPTY_15"].toString(),
            data["__EMPTY_16"] == undefined ? null : data["__EMPTY_16"].toString(),
            data["__EMPTY_17"] == undefined ? null : data["__EMPTY_17"].toString(),
            data["__EMPTY_18"] == undefined ? null : data["__EMPTY_18"].toString(),
            data["__EMPTY_19"] == undefined ? null : data["__EMPTY_19"].toString(),
            data["__EMPTY_20"] == undefined ? null : data["__EMPTY_20"].toString(),
            data["__EMPTY_21"] == undefined ? null : data["__EMPTY_21"].toString(),
            data["__EMPTY_22"] == undefined ? null : data["__EMPTY_22"].toString(),
            debt.toString(),
            data["__EMPTY_24"] == undefined ? null : data["__EMPTY_24"].toString(),
            data["__EMPTY_25"] == undefined ? null : data["__EMPTY_25"].toString(),
            data["__EMPTY_26"] == undefined ? null : data["__EMPTY_26"].toString(),
            data["__EMPTY_27"] == undefined ? null : data["__EMPTY_27"].toString(),
            data["__EMPTY_28"] == undefined ? null : data["__EMPTY_28"].toString()
        ];
        // console.log(array);
        await pool.query(
            `insert into main_tb (
                id,
                name_date,
                chat_id,
                Сотрудники,
                Сальдо_на_начало,
                Доход_с_начала,
                Необлагаемые_суммы,
                Удержано_подох_налога,
                Кол_во_выходов,
                Кол_во_отраб,
                Кол_во_Дежурства_день,
                Кол_о_Дежурства_ночь,
                Оклад,
                За_вредность,
                Дежурства_день,
                Дежурства_ночь,
                Отпускные,
                Доплата,
                Премия,
                Всего_ачислено,
                Облагаемый_доход,
                Подоходный_налог,
                ИНПС,
                Подох_налог,
                Единый_социальный,
                Займ,
                Всего_удержано,
                Пластиковые_карточки,
                Касса_Зарплата,
                Аванс,
                К_выдаче,
                тел_номер
                ) values (null,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            array
        );
    } catch (err) {
        console.log("data_userW ga yozishda xatolik :" + err);
    }
}
const data_reportW = async (date, data) => {
    try {
        let debt = 0;
        for (let key in data) {
            if (key == "__EMPTY_24" || key == "__EMPTY_22" || key == "__EMPTY_18") {
                debt = debt + parseInt(data[key] == undefined ? 0 : data[key]);
            }
        }
        let array = [
            date,
            data[date],
            data["__EMPTY_1"] == undefined ? null : data["__EMPTY_1"].toString(),
            data["__EMPTY_2"] == undefined ? null : data["__EMPTY_2"].toString(),
            data["__EMPTY_3"] == undefined ? null : data["__EMPTY_3"].toString(),
            data["__EMPTY_4"] == undefined ? null : data["__EMPTY_4"].toString(),
            data["__EMPTY_5"] == undefined ? null : data["__EMPTY_5"].toString(),
            data["__EMPTY_6"] == undefined ? null : data["__EMPTY_6"].toString(),
            data["__EMPTY_7"] == undefined ? null : data["__EMPTY_7"].toString(),
            data["__EMPTY_8"] == undefined ? null : data["__EMPTY_8"].toString(),
            data["__EMPTY_9"] == undefined ? null : data["__EMPTY_9"].toString(),
            data["__EMPTY_10"] == undefined ? null : data["__EMPTY_10"].toString(),
            data["__EMPTY_11"] == undefined ? null : data["__EMPTY_11"].toString(),
            data["__EMPTY_12"] == undefined ? null : data["__EMPTY_12"].toString(),
            data["__EMPTY_13"] == undefined ? null : data["__EMPTY_13"].toString(),
            data["__EMPTY_14"] == undefined ? null : data["__EMPTY_14"].toString(),
            data["__EMPTY_15"] == undefined ? null : data["__EMPTY_15"].toString(),
            data["__EMPTY_16"] == undefined ? null : data["__EMPTY_16"].toString(),
            data["__EMPTY_17"] == undefined ? null : data["__EMPTY_17"].toString(),
            data["__EMPTY_18"] == undefined ? null : data["__EMPTY_18"].toString(),
            data["__EMPTY_19"] == undefined ? null : data["__EMPTY_19"].toString(),
            data["__EMPTY_20"] == undefined ? null : data["__EMPTY_20"].toString(),
            data["__EMPTY_21"] == undefined ? null : data["__EMPTY_21"].toString(),
            data["__EMPTY_22"] == undefined ? null : data["__EMPTY_22"].toString(),
            debt.toString(),
            data["__EMPTY_24"] == undefined ? null : data["__EMPTY_24"].toString(),
            data["__EMPTY_25"] == undefined ? null : data["__EMPTY_25"].toString(),
            data["__EMPTY_26"] == undefined ? null : data["__EMPTY_26"].toString(),
            data["__EMPTY_27"] == undefined ? null : data["__EMPTY_27"].toString()
        ];
        // console.log(array);
        await pool.query(
            `insert into foot_tb (
                id,
                name_date,
                ИТОГО,
                Сальдо_на_начало,
                Доход_с_начала,
                Необлагаемые_суммы,
                Удержано_подох_налога,
                Кол_во_выходов,
                Кол_во_отраб,
                Кол_во_Дежурства_день,
                Кол_о_Дежурства_ночь,
                Оклад,
                За_вредность,
                Дежурства_день,
                Дежурства_ночь,
                Отпускные,
                Доплата,
                Премия,
                Всего_ачислено,
                Облагаемый_доход,
                Подоходный_налог,
                ИНПС,
                Подох_налог,
                Единый_социальный,
                Займ,
                Всего_удержано,
                Пластиковые_карточки,
                Касса_Зарплата,
                Аванс,
                К_выдаче
                ) values (null,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            array
        );
    } catch (err) {
        console.log("data_reportW ga yozishda xatolik :" + err);
    }
}

module.exports = {
    data_dateW,
    data_userW,
    // data_reportW
}