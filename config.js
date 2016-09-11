var config = {};
//Reputation settings
config.rep_create_user = 300;
config.rep_delete_user = 500;
config.rep_change_ticket = 300;
config.rep_delete_ticket = 500;
config.rep_create_comment = 300;
config.rep_delete_comment = 500;
config.rep_create_room = 500;
config.rep_delete_room = 3248;
//DB settings
config.mongo_connect = 'mongodb://localhost/netzzwergdb';
config.redis_host = '127.0.0.1';
config.redis_port = 6379;
//misc
config.session_secret = 'nqpvn32czr7';
config.info_api_root = "<h1>Nussbaum-Backend</h1>Usage: <a href=\"https://github.com/ikarulus\">https://github.com/ikarulus</a>";

module.exports = config;
