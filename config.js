var config = {};
//Global settings
config.url = "https://example.com/"
//Reputation settings
config.rep_create_user = 150;
config.rep_delete_user = 1500;
config.rep_change_ticket = 50;
config.rep_delete_ticket = 100;
config.rep_create_comment = 300;
config.rep_delete_comment = 400;
config.rep_create_room = 200;
config.rep_delete_room = 400;
//Email settings
config.smtp_host = "smtp.example.com";
config.smtp_user = "user";
config.smtp_port = "user";
config.smtp_user = "user";
config.smtp_password = "passwd";
config.smtp_address = "it@example.com"
//DB settings
if (process.env.MONGODB_URI) config.mongo_connect = process.env.MONGODB_URI;
else config.mongo_connect = 'mongodb://localhost/netzzwergdb';
if (process.env.REDIS_URL) config.redis_url = process.env.REDIS_URL;
else config.redis_url = '//127.0.0.1:6379';
//Bootstrapuser
if (process.env.BOOSTRAP_USER_REPUTATION) config.bootstrap_user_reputation = process.env.BOOSTRAP_USER_REPUTATION;
else config.bootstrap_user_reputation = 4000;
if (process.env.BOOSTRAP_USER_PASSWORD) config.bootstrap_user_password = process.env.BOOSTRAP_USER_PASSWORD;
else config.bootstrap_user_password = "bootstrap";
//misc
config.crypt_saltRounds = 10;
if (process.env.PORT) config.app_port = process.env.PORT;
else config.app_port = 8080;
if (process.env.SESSION_SECRET) config.session_secret = process.env.SESSION_SECRET;
else config.session_secret = 'nqpvn32czr7';
config.info_api_root = "<h1>BountyDesk-Backend</h1>Usage: <a href=\"https://github.com/ikarulus\">https://github.com/ikarulus</a>";

module.exports = config;
