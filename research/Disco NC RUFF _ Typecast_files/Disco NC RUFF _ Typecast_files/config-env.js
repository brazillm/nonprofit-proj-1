/*
 *  production config
 *
 *  Environment specific config
 *  This config allows you to overwrite the defaults
 *  included in `/js/src/config/config.js`
 *
 */

// Do public demo API calls via the CDN
Config.modules.service.connection.types.demo.template_url = "//d3bz0tpj0rzgui.cloudfront.net" + Config.modules.service.connection.types.demo.template_url;
Config.modules.service.connection.types.demo.font_data_url = "//d3bz0tpj0rzgui.cloudfront.net" + Config.modules.service.connection.types.demo.font_data_url;
Config.modules.service["log-service"].loggly_key = "c165c0c8-9cf2-4fab-aa6d-678ef80cb9e9";
