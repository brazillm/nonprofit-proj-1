/*
 * paste cleanser
 *
 * Ensures that pasted elements have IDs, inline styles removed
 * and that they are valid tags (allowed)
 *
 * Shann McNicholl
 */

define(
['aloha/core', 'jquery', 'aloha/contenthandlermanager'],
function(Aloha, $, ContentHandlerManager) {
    "use strict";

    var cleansePasteHandler = ContentHandlerManager.createHandler({

        content: null,  // Holder for the content to be cleansed

        init: function() {
            this.debug("is initiating");

            this.debug("is done initiating");
        },


        /*
         * handle content
         *
         * This is the main entry point for cleansing pasted content
         */
        handleContent: function(content) {
            this.debug("[handleContent] has started");

            // Set the new value
            this.content    =   content;

            // Cleanse
            this.cleanse();

            // Check if content was an html paste or not
            // if ($("<div>"+this.content+"</div>").children().length) {
            //     if (app && app.eventAggregator) {
            //         app.eventAggregator.trigger("paste-handler:html-paste-completed");
            //     }
            // }

            this.debug("[handleContent] has completed");
            return this.content; // return as HTML text not jQuery/DOM object
        },


        /*
         * cleanse
         *
         * Processes all actions needed to cleanse the content
         */
        cleanse: function() {
            if(!this.content) return false;

            this.debug('cleanse start', this.content);

            this.stripInvalidTags();

            this.stripAttributes();

            this.convertBrsToParagraphs();

            this.preserveClasses();

            this.debug('cleanse end', this.content);

            return true;
        },


        /*
         * strip invalid HTML tags
         *
         * Removes all html tags that are not allowed/supported
         */
        stripInvalidTags: function() {


            // The sanitize Aloha plugin covers this.
            // This comment is here as reference

            return true;
        },


        /*
         * strip all atributes from tags
         *
         * Removes all attributes from the HTML tags
         */
        stripAttributes: function() {

            // The sanitize Aloha plugin covers this.
            // This comment is here as reference

            return true;
        },


        preserveClasses: function() {
            var content = '',
                $content = $('<div>'+this.content+'</div>');

            if (! $content.children().length) {
                return true;
            }

            $content.contents().each(function() {
                var el  =   $(this),
                    classList = (el.attr('class') || '').split(/\s+/);

                if (classList && typeof classList[0] === "string" && classList[0].length > 0) {
                    el.attr('class', classList[0]);
                    el.attr("data-retain-classes", 'yes');
                }

                content += el.outerHtml();
            });

            this.content = content;

        },

        /*
         * convert <br>'s to paragraphs
         *
         * Removes all br tags, that are not used to prop open an element,
         * and replaces them with paragraphs.
         */
        convertBrsToParagraphs: function() {

            // The sanitize Aloha plugin covers this.
            // This comment is here as reference

            this.debug("Here is what we got", this.content);

            var appendElClass   =   "typecast-pre-append-wrapper-div-for-cleansePasteHandler",
                appendEl    =   "<div class="+ appendElClass +"></div>",
                content     =   $(appendEl + this.content + appendEl),
                newContent  =   "",
                counter     =   0,
                self        =   this;

            if(!content) {
                // Assume that what we have has no HTML tags in it, just a straight up string
                newContent  =   this.content;
            } else {

                this.debug("jQuery content: ", content);
                content.each(function() {
                    var el  =   this;

                    if(!el) {
                        self.debug("Error! ", this);
                        return;
                    }

                    if($(el).hasClass(appendElClass)) {
                        return; // Ignore this element as it was just being used to help grab text nodes
                    }
                    self.debug("Element: ", el);

                    if(el.nodeName.toLowerCase() === "br") {
                        self.debug("Found a <br>, ignoring...");
                        return; // Ignore top level BR tags
                    }

                    if(el.nodeName.toLowerCase() === '#text') {
                        if($.trim($(el).text())) {
                            var textContent = $(el).outerHtml();
                            // Only do this if the text node has content
                            if(counter === 0) {
                                newContent  +=  textContent;
                            } else {
                                newContent  +=  "<p>"+ textContent +"</p>";
                            }
                        } else {
                            return; // Ignore whitespace
                        }
                    } else {
                        self.debug("Not text node: ", [el.outerHTML, el]);
                        newContent += el.outerHTML;
                    }

                    counter++;
                    return;
                });
            }

            this.debug("[convertBrsToParagraphs]", newContent);

            this.content    =   newContent;

            return true;
        },


        debug: function(msg, objs) {
            if(!objs) objs = "";
            // window.console.log("[cleansePasteHandler] "+ msg, objs);
        }
    });

    cleansePasteHandler.init();

    return cleansePasteHandler;
});
