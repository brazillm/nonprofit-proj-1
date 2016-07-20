/*
 * Generic Variant plugin
 *
 */

define(
['aloha', 'aloha/plugin', 'aloha/contenthandlermanager', 'genericVariantHandler'],
function( aloha, plugin, ContentHandlerManager, handler) {
	return plugin.create('genericVariant', {

		events: {},
		handler:	handler,

		// Setup the handler within contenthandlerManager
		init: function() {
			window.Aloha.CleansePaste = this;

			this.debug("Plugin initialising.");

			// Register the paste handler
			ContentHandlerManager.register( 'genericVariant', handler );

			this.debug("Plugin initialised.");
		},

		debug: function(msg, objs) {
			if(!objs) objs = "";
			// window.console.log("[genericVariant] "+ msg, objs);
		},
	});
});
