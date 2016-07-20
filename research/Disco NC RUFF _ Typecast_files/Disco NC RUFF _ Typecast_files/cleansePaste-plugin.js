/*
 * cleanse paste plugin
 *
 * Sets up the cleanse paste handler within the content handler manager
 * so that it can cleanse html on paste.
 *
 * Shann McNicholl & Pete Hawkins
 */

define(
['aloha', 'aloha/plugin', 'aloha/contenthandlermanager', 'cleansePasteHandler'],
function( aloha, plugin, ContentHandlerManager, handler) {
	return plugin.create('cleansePaste', {

		events: {},
		handler:	handler,

		// Setup the handler within contenthandlerManager
		init: function() {
			window.Aloha.CleansePaste = this;

			this.debug("Plugin initialising.");

			// Register the paste handler
			ContentHandlerManager.register( 'cleansePaste', handler );

			this.debug("Plugin initialised.");
		},

		debug: function(msg, objs) {
			if(!objs) objs = "";
			// window.console.log("[cleansePaste] "+ msg, objs);
		},
	});
});
