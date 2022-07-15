// create tables...
const { pool } = require('./db/connect_db');
const schema_date = `create table date_tb (
    id int(11) not null auto_increment,
    date_month varchar(255) not null,
    status int default 1,
    creation_date datetime default current_timestamp,
    PRIMARY KEY (id),
    KEY id (id)
) ENGINE=InnoDB AUTO_INCREMENT=604334 DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT`;
const schema_main = `create table main_tb (
    id int(11) not null auto_increment,
    name_date varchar(255) not null,
    chat_id int(11) default null,
    Сотрудники varchar(255) not null,
    Сальдо_на_начало varchar(255) default null,
    Доход_с_начала varchar(255) default null,
    Необлагаемые_суммы varchar(255) default null,
    Удержано_подох_налога varchar(255) default null,
    Кол_во_выходов varchar(255) default null,
    Кол_во_отраб varchar(255) default null,
    Кол_во_Дежурства_день varchar(255) default null,
    Кол_о_Дежурства_ночь varchar(255) default null,
    Оклад varchar(255) default null,
    За_вредность varchar(255) default null,
    Дежурства_день varchar(255) default null,
    Дежурства_ночь varchar(255) default null,
    Отпускные varchar(255) default null,
    Доплата varchar(255) default null,
    Премия varchar(255) default null,
    Всего_ачислено varchar(255) default null,
    Облагаемый_доход varchar(255) default null,
    Подоходный_налог varchar(255) default null,
    ИНПС varchar(255) default null,
    Подох_налог varchar(255) default null,
    Единый_социальный varchar(255) default null,
    Займ varchar(255) default null,
    Всего_удержано varchar(255) default null,
    Пластиковые_карточки varchar(255) default null,
    Касса_Зарплата varchar(255) default null,
    Аванс varchar(255) default null,
    К_выдаче varchar(255) default null,
    тел_номер varchar(255) default null,
    status int default 1,
    creation_date datetime default current_timestamp,
    PRIMARY KEY (id),
    KEY id (id),
    KEY name_date (name_date),
    KEY chat_id (chat_id)
) ENGINE=InnoDB AUTO_INCREMENT=604334 DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT`;
const schema_foot = `create table foot_tb (
    id int(11) not null auto_increment,
    name_date varchar(255) not null,
    ИТОГО varchar(255) not null,
    Сальдо_на_начало varchar(255) default null,
    Доход_с_начала varchar(255) default null,
    Необлагаемые_суммы varchar(255) default null,
    Удержано_подох_налога varchar(255) default null,
    Кол_во_выходов varchar(255) default null,
    Кол_во_отраб varchar(255) default null,
    Кол_во_Дежурства_день varchar(255) default null,
    Кол_о_Дежурства_ночь varchar(255) default null,
    Оклад varchar(255) default null,
    За_вредность varchar(255) default null,
    Дежурства_день varchar(255) default null,
    Дежурства_ночь varchar(255) default null,
    Отпускные varchar(255) default null,
    Доплата varchar(255) default null,
    Премия varchar(255) default null,
    Всего_ачислено varchar(255) default null,
    Облагаемый_доход varchar(255) default null,
    Подоходный_налог varchar(255) default null,
    ИНПС varchar(255) default null,
    Подох_налог varchar(255) default null,
    Единый_социальный varchar(255) default null,
    Займ varchar(255) default null,
    Всего_удержано varchar(255) default null,
    Пластиковые_карточки varchar(255) default null,
    Касса_Зарплата varchar(255) default null,
    Аванс varchar(255) default null,
    К_выдаче varchar(255) default null,
    status int default 1,
    creation_date datetime default current_timestamp,
    PRIMARY KEY (id),
    KEY id (id),
    KEY name_date (name_date)
) ENGINE=InnoDB AUTO_INCREMENT=604334 DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT`;
const create_date_tb = async (query) => {
    try {
        await pool.query(query);
        console.log("date_tb created seccesful!");
    } catch (err) {
        console.log("date_tb created error! " + err);
    }
}
const create_main_tb = async (query) => {
    try {
        await pool.query(query);
        console.log("main_tb created seccesful!");
    } catch (err) {
        console.log("main_tb created error! " + err);
    }
}
const create_foot_tb = async (query) => {
    try {
        await pool.query(query);
        console.log("foot_tb created seccesful!");
    } catch (err) {
        console.log("foot_tb created error! " + err);
    }
}
create_date_tb(schema_date);
create_main_tb(schema_main);
// create_foot_tb(schema_foot);
