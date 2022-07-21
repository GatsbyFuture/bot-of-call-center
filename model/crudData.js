// bu faylda faqat crud ammallari bajariladi...
const { pool } = require('../db/connect_db');
// bazadan userni nomeri bo'yicha tekshirish va bor bo'lsa unga chat_id beradi...
const sleep_status = async () => {
    try {
        let data = pool.query("select * from date_tb");
        if (data) {
            let date_query = `UPDATE date_tb SET status=0`;
            let main_query = `UPDATE main_tb SET status=0`;
            // let foot_query = `UPDATE foot_tb SET status=0`;
            await pool.query(date_query);
            await pool.query(main_query);
            // await pool.query(foot_query);
            console.log("Datalarni statusini 0 ga tushurish...");
        } else {
            console.log("Data statusini 0 qilishda data yo'q!");
        }
    } catch (err) {
        console.log("statuslarni 0 qilishda xatolik: " + err);
    }
}
// tel nomerni formatlash uchun...
const form_phone_number = (number) => {
    let phone_number = number.replace(/-/g, '');
    // console.log(phone_number);
    return "+998 " + phone_number.substring(phone_number.length - 9, phone_number.length).replace(/\D+/g, '').replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, '($1) $2-$3-$4');
}
// tel nomer bo'yicha tekshirib ko'rish...
const check_number = async (id, phone_number) => {
    try {
        let number = form_phone_number(phone_number);         
        // phone_number
        //     .replace(/ /g, "")
        //     .substring(3);
        console.log(number);
        let who_am_i = { user_right: false, driver_right: false };
        // driver uchun tekshirib ko'ramiz...
        let question_driver = `select phone_number from tb_driver where phone_number = ? and status = 1`;
        let update_data_driver = `UPDATE tb_driver SET telegram_id = ? WHERE phone_number = ? and status = 1`;
        let answer_driver = await pool.query(question_driver, [number]);
        // customer uchun tekshirib ko'rami...
        let question_user = `select phone_number from tb_customer where phone_number = ? and status = 1`;
        let update_data_user = `UPDATE tb_customer SET telegram_id = ? WHERE phone_number = ? and status = 1`;
        let answer_user = await pool.query(question_user, [number]);
        // console.log(answer);
        // console.log(answer[0][0]["тел_номер"]);
        if (answer_user[0].length == 1) {
            await pool.query(update_data_user, [id, number])
            // return true;
            who_am_i["user_right"] = true;
        } else if (answer_driver[0].length == 1) {
            await pool.query(update_data_driver, [id, number])
            // return false;
            who_am_i["driver_right"] = true;
        }
        return who_am_i;
    } catch (err) {
        console.log("Tel nomerni tekshirishda xatolik ->" + err);
    }
}
// driverni tekshiramiz bo'sh yoki bandligini
const driver_is_busy = async (id) => {
    try {
        // boshligini tekshirish uchun query
        let question = `select busy from tb_driver where telegram_id = ? and status = 1`;
        let answer = await pool.query(question, [id]);
        // console.log(answer);
        // console.log(answer[0][0]["тел_номер"]);
        if (answer[0][0]["busy"] == 1) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.log("driverni bo'sh yoki bandligini tekshirishda xatolik ->" + err);
    }
}
// driverga urlni olib kelish va btnga biriktirib qo'yish...
const get_optimal_url = async (chat_id) => {
    try {
        // boshligini tekshirish uchun query
        let question = `select url_silka from tb_optimal_route where chat_id_of_driver = ? and status = 1`;
        let answer = await pool.query(question, [chat_id]);
        // console.log(answer);
        // console.log(answer[0][0]["тел_номер"]);
        if (answer[0].length == 1) {
            return answer[0][0]["url_silka"];
        } else {
            return false;
        }
    } catch (err) {
        console.log("driverga tegishli urlni btnga biriktirish uchun olib berish ->" + err);
    }
}

// userni latitude va longitude larini olib olish
const add_location = async (id, location) => {
    try {
        let question = `select id from tb_customer where telegram_id = ? and status = 1`;
        let update_data = `UPDATE tb_order SET latitude = ?, longitude = ? WHERE customer_id = ? and status = 1`;
        let answer = await pool.query(question, [id]);
        // console.log(answer);
        // console.log(answer[0][0]["тел_номер"]);
        if (answer[0].length == 1) {
            await pool.query(update_data, [location["latitude"], location["longitude"], answer[0][0]["id"]])
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.log("Tel nomerni tekshirishda xatolik ->" + err);
    }
}
// userlarni chat_id bo'yicha olib chiqish va ularga chat yuborish...
const all_users_id = async () => {
    try {
        let question = `select chat_id from main_tb where status = 1`;
        let users = await pool.query(question);
        return users[0];
    } catch (err) {
        console.log("All users send message: " + err);
    }
}
// userni bor yo'qligini tekshirish...
const check_user = async (id) => {
    try {
        let isUser = false;
        let isDriver = false;
        let question_user = `select id from tb_customer where telegram_id = ? and status = 1`;
        let question_driver = `select id from tb_driver where telegram_id = ? and status = 1`;
        let answer_user = await pool.query(question_user, [id]);
        let answer_driver = await pool.query(question_driver, [id]);
        // console.log(answer)
        if (answer_user[0].length == 1)
            isUser = true;
        if (answer_driver[0].length == 1)
            isDriver = true;
        return { user: isUser, driver: isDriver }
    } catch (err) {
        console.log("Userni mavjudligini tekshirishda xatolik ->" + err);
    }
}
// arxive oylik xisoboti...
const archive_data = async (id) => {
    try {
        let max_text = `select 
        name_date,
        Сотрудники,
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
        Подоходный_налог,
        Займ,
        Всего_удержано,
        Аванс,
        К_выдаче,
        creation_date
        from
        main_tb 
        where chat_id = ? limit ?,3`;
        let min_text = `select 
        name_date,
        Сотрудники,
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
        Подоходный_налог,
        Займ,
        Всего_удержано,
        Аванс,
        К_выдаче,
        creation_date 
        from 
        main_tb
        where chat_id = ?`;
        let amount_text = `select count(id) as amount from date_tb`;
        let amount = await pool.query(amount_text);
        // console.log(id);
        // console.log(amount[0][0]["amount"]);
        if (amount[0][0]["amount"] < 4) {
            return await pool.query(min_text, [id]);
        } else {
            return await pool.query(max_text, [id, amount[0][0]["amount"] - 4]);
        }
    } catch (err) {
        console.log("arxivni tortishda xatolik: " + err);
    }
}
// optimal idlarni chaqirib olish...
const get_optimal_id = async (id) => {
    try {
        // mahsulotni id bo'yicha joylashtirish
        let question = `select
        optimal_sort
        from
        tb_optimal_route
        where status = 1 and chat_id_of_driver = ?`;
        let ids_of_orders = await pool.query(question, [id]);
        // console.log(ids_of_orders[0][0]["optimal_sort"]);
        let array_id = ids_of_orders[0][0]["optimal_sort"].split(",");

        return array_id;
    } catch (err) {
        console.log("optimal id olish xatolik :" + err);
    }
}
// xali yetkazib berilagan mahsulotlar soni...
const amout_of_deliver = async (array) => {
    try {
        let ortder_qestion = `select 
        status_of_deliver
        from
        tb_order
        where id = ?
        `;
        let data_of_orders = 0;
        for (let i = 0; i < array.length; i++) {
            let obj = await pool.query(ortder_qestion, [parseInt(array[i])]);
            // console.log(obj[0][0]);
            if (obj[0][0]["status_of_deliver"] == 1)
                data_of_orders++;
        }
        return data_of_orders;
    } catch (err) {
        console.log("Dateni tortishda xatolik :" + err);
    }
}
// optimal idlarni chaqirib olish...
const get_product_data = async (id) => {
    try {
        // productni olib yuborish...
        let ortder_qestion = `
        select
        tb_order.product_name,
        tb_order.started_time,
        tb_order.shipment_payment,
        tb_order.product_payment,
        tb_order.status_of_deliver,
        tb_customer.name,
        tb_customer.lastname,
        tb_customer.phone_number
        from
        tb_order
        left join tb_customer on tb_customer.id = tb_order.customer_id
        where tb_order.id = ?
        `;
        let obj = await pool.query(ortder_qestion, [id]);
        return obj[0][0];
    } catch (err) {
        console.log("Product datasini tortishda xatolik :" + err);
    }
}
// productlarni delever statusini o'zgarirish...
const update_delever_status = async (id, key) => {
    try {
        // productni olib yuborish...
        let ortder_qestion = `
        update
        tb_order
        set
        status_of_deliver = ?
        status = 0
        where
        id = ?
        `;
        let obj = await pool.query(ortder_qestion, [key, id]);
        // console.log(obj[0]);
        // return obj[0][0];
    } catch (err) {
        console.log("Product datasini tortishda xatolik :" + err);
    }
}
// yetkazib berish nixoyasiga yetganidan keyin busyni 0 qilib qo'yish...
const update_driver_busy = async (chat_id) => {
    try {
        let update_of_busy = `
        update
        tb_driver
        set
        busy = 0
        where
        telegram_id = ?
        `;
        let id_for_driver = await pool.query(update_of_busy, [chat_id]);
        console.log(id_for_driver);
    } catch (err) {
        console.log("Product datasini tortishda xatolik :" + err);
    }
}

module.exports = {
    check_number,
    check_user,
    // need_data,
    sleep_status,
    archive_data,
    all_users_id,
    // locationni joylash
    add_location,
    // driverni bo'sh yoki yoqligi
    driver_is_busy,
    // driverga tegishli urlni olish
    get_optimal_url,
    // optimal idlarni olib olish
    get_optimal_id,
    // yetkazib berilishi kerak bo'lgan product soni
    amout_of_deliver,
    // optimal productni olib kelish
    get_product_data,
    // deliverni statusini orderdan 2 ga ko'tarish
    update_delever_status,
    // driver busyni statusini 0 qilib qoyish...
    update_driver_busy
}