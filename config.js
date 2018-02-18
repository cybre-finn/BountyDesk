var config = {};
//Reputation settings
config.rep_create_user = 0;
config.rep_delete_user = 500;
config.rep_change_ticket = 300;
config.rep_delete_ticket = 500;
config.rep_create_comment = 300;
config.rep_delete_comment = 500;
config.rep_create_room = 500;
config.rep_delete_room = 3248;
//DB settings
if (process.env.MONGO_HOST) config.mongo_connect = 'mongodb://'+process.env.REDIS_HOST;
else config.mongo_connect = 'mongodb://localhost/netzzwergdb';
if (process.env.REDIS_HOST) config.redis_host = process.env.REDIS_HOST;
else config.redis_host = '127.0.0.1';
config.redis_port = 6379;
//misc
config.crypt_saltRounds = 10;
if (process.env.PORT) config.app_port = process.env.PORT;
else config.app_port = 8080;
if (process.env.SESSION_SECRET) config.session_secret = process.env.SESSION_SECRET;
else config.session_secret = 'nqpvn32czr7';
config.info_api_root = "<h1>Nussbaum-Backend</h1>Usage: <a href=\"https://github.com/ikarulus\">https://github.com/ikarulus</a>";

module.exports = config;
