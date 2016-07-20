/**
*  ContentEvent
*
*  Listens to all interactions within aloha and broadcasts them on the events
*  channel. The Typecast app listens out on this event channel to figure
*  out what has happened within the editor and relay it to the rest of
*  the application.
*
*  @author Pete and Shann
*/
define(
['aloha', 'aloha/plugin', 'aloha/console', 'jquery', 'backbone_amd', 'underscore'],
function(al, plugin, alohaConsole, $, Backbone, _) {
    "use strict";

    /* Leaving trailing commas for less git conflicts */
    var supported_inline_tag_names = [
            "em",
            "strong",
            "a",
            "b",
            "i",
        ],
        black_listed_tag_names = [
            "script",
            "style",
            "iframe",
            "frame",
            "html",
            "body",
            "head",
            "title",
            "object",
            "embed",
            "applet",
            "video",
            "audio",
            "blink",
            "marquee"
        ];

    return plugin.create( 'contentEvent', {

        events: {},           // Setup after load to an event object for pub/sub

        state:  {},           // Holds the current state of the contentEditable field

        activeElement: null,  // Holds the current focused active element

        init: function() {
            // Setup content event to be accessible from the global Aloha object
            window.Aloha.ContentEvent = this;

            // Executed on plugin initialization
            alohaConsole.log("info", 'contentEvent', "Content Event has started.");

            // Setup events object
            this.events = $.extend({}, Backbone.Events);

            al.bind("aloha-ready", $.proxy(this, "ready"));
            al.bind("aloha-editable-activated", $.proxy(this, "activated"));
            al.bind("aloha-editable-deactivated", $.proxy(this, "deactivated"));
            al.bind("aloha-editable-created", $.proxy(this, "newEditable"));
            al.bind("aloha-editable-destroyed", $.proxy(this, "destroyEditable"));
            al.bind("aloha-smart-content-changed", $.proxy(this, "changed"));
            al.bind("aloha-selection-changed", $.proxy(this, "selectionChanged"));
            al.bind("aloha-command-will-execute", $.proxy(this, "commandWillExecute"));
            al.bind("aloha-command-executed", $.proxy(this, "commandExecuted"));
            // aloha-selection-changed, aloha-block-selected, aloha-command-will-execute, aloha-command-executed, aloha-link-href-change, aloha-link-selected, aloha-link-unselected, aloha-format-block, aloha-image-cropped, aloha-image-reset, aloha-image-resize, aloha-image-resized, aloha-image-unselected, aloha-image-selected, aloha-image-resize-outofbounds

            return true;
        },


        /*
         *  commandWillExecute
         *
         *  Fired before aloha runs commands and allows us to prevent them
         */
        commandWillExecute: function(ev, command) {
            if (command.commandId === "insertparagraph") {
                var rangeObject = ev.currentTarget.Selection.rangeObject;
                this.insertParagraphCommandInBlockquote(rangeObject, command);
            }
        },


        /*
         *  commandExecuted
         *
         *  When aloha inserts a new paragraph, we want to run our changeset
         *  immediately, to strip classes and  data-id's from the new paragraph
         */
        commandExecuted: function(ev, command) {
            if (command === "insertparagraph") {
                this.changed();
            }
        },


        /*
         * Check For Blockquotes
         *
         * Finds an insertParagraph command in blockquotes and
         * takes over the default action.
         */
        insertParagraphCommandInBlockquote: function(rangeObject, command) {
            var startContainer = $(rangeObject.startContainer),
                blockquote = this.findBlockquoteElementInTree(startContainer),
                blockquoteText,
                newParagraph;

            // Check if current element or one of it's parents is a blockquote
            if (blockquote && blockquote.length > 0) {

                // Aloha is trying to insert a paragraph into a blockquote, let's not do that.
                command.preventDefault = true;

                // Check if our blockquote has inline elements
                if (blockquote.children().length) {
                    // Just add a new empty paragraph below the blockquote
                    newParagraph = $("<p><br></p>");
                }
                else {
                    // Split the container text properly

                    // Get the text of the range object
                    blockquoteText = this.getTextAtStartAndEndOfRange(startContainer.text(), rangeObject.startOffset, rangeObject.endOffset);

                    // If the end text for the blockquote is empty, set it to BR to keep the paragraph tag open
                    if (!$.trim(blockquoteText.endText)) blockquoteText.endText = "<br>";

                    // Set the new blockquote text
                    blockquote.text(blockquoteText.startText);

                    // Insert a new paragraph after the blockquote element
                    newParagraph = $("<p>"+ blockquoteText.endText +"</p>");
                }

                blockquote.after(newParagraph);

                // Tell the DOM Interface Adapter to select the element
                this.events.trigger("content-event:dia-select-element", newParagraph.get(0));

                return true;
            }

            return false;
        },


        getTextAtStartAndEndOfRange: function(text, start, end) {
            if (!text) text = "";
            if (!start) start = 0;
            if (!end && end !== 0) end = text.length;

            return {
                startText: text.substr(0, start),
                endText: text.substr(end)
            };
        },


        /*
         * Find Blockquote element in tree
         *
         * Takes a dom node and looks for a blockquote element
         * either in the current element or any of it's parents.
         */
        findBlockquoteElementInTree: function(element) {
            if (!element || element.length < 1) return null;

            if (element.get(0).tagName === "BLOCKQUOTE") {
                return element;
            }

            if (element.parents("blockquote")) {
                return element.parents("blockquote").first();
            }

            return null;
        },


        /*
         * change
         *
         * The aloha instance has indicated that a change has occurred.
         * Transpose the change into elements that are:
         *      - New
         *      - Deleted
         *      - Updated
         */
        changed: function() {
            if ( ! al.getActiveEditable()) {
                return false;
            }

            this.events.trigger("content-event:changeset-start");

            var currentHtml = $(al.getActiveEditable().originalObj[0]),
                containerId = currentHtml.attr("data-id");

            // Remove any duplicate data-id's from elements
            this.cleanseContainerOfDuplicateElements(currentHtml);

            // Remove any black listed elements
            this.removeBlackListedElements(currentHtml);

            // Check for updated elements
            this.checkForUpdatedElements(containerId, this.getPreviousHtmlState(containerId), currentHtml);

            // Check for new elements
            this.checkForNewlyAddedElements(containerId, currentHtml);

            // Check for removed elements
            this.checkForRemovedElements(containerId, this.getPreviousHtmlState(containerId), currentHtml);

            // Cache the current html object for future comparison
            // Current HTML is a reference to a live object so it gets the updates from the above methods
            this.setPreviousHtmlState(containerId, currentHtml.get(0).outerHTML);

            // Broadcast we are finished with the current stack of changes
            this.events.trigger("content-event:changeset-complete");
        },


        /*
         *  cleanseContainerOfDuplicateElements
         *
         *  Removes duplicate element data-id's from elements.
         */
        cleanseContainerOfDuplicateElements: function(newHtml) {
            var checked_ids = [],
                $el;

            if (! newHtml) {
                return false;
            }

            newHtml.find("*").each(function() {
                $el = $(this);

                if (! $el.attr("data-id")) return;

                // If we have already come across this ID before, strip out all
                // of its data attrs so that it is picked up as a new element
                if (checked_ids.indexOf($el.attr("data-id")) !== -1) {
                    $el.attr("data-id", null);
                    return;
                }

                checked_ids.push($el.attr('data-id'));
            });
        },


        /*
         * selectionChanged
         *
         * The aloha instance has indicated that a selection change has occurred.
         * This covers all cursor position and selections over single or multuple elements.
         */
        selectionChanged: function(ev, data) {
            // If we don't have a start container we can't do much now can we?
            if ( ! data || typeof data !== "object" || ! data.startContainer || typeof data.startContainer !== "object" || ! data.startContainer.parentNode) return false;

            // Check if the element selection is over an inline element
            var inlineContents = []; // Holds the contents of an inline selection e.g. ["strong", "a"]

            if (this._isSupportedInlineElement($(data.startContainer.parentNode))) {
                // Figure out what the inlineContents are
                inlineContents = this.getAllChildInlineElements(data.startContainer);
            }

            // If there is no active editable don't select anything
            if ( ! al.getActiveEditable()) return false;

            var currentHtml = $(al.getActiveEditable().originalObj[0]),
                containerId = currentHtml.attr("data-id"),
                media_query_id = currentHtml.attr("data-media-query-id"),
                range = {
                    "start": data.startOffset,
                    "end": data.endOffset
                },
                elementIds = [],
                startContainer = this.getParentElementId(data.startContainer),
                endContainer = this.getParentElementId(data.endContainer);

            if ((startContainer && startContainer.trim() === "") || (endContainer && endContainer.trim() === "")) {
                // There are new Elements in the dom
                // Call the changed event, which will auto select the newest element
                this.changed();
                return true;
            }

            if (startContainer === endContainer) {
                // Set the active element
                this.setActiveElement(containerId, startContainer);
            }

            elementIds.push(startContainer);
            elementIds.push(endContainer);

            this.events.trigger("content-event:selection", range, elementIds, data, inlineContents, media_query_id);
        },

        /*
         *  getParentElementId
         *
         *  Recursively goes up until it finds an element with a data-id
         */
        getParentElementId: function(element) {
            var element_id;

            // If the element passed is a text node, get it's parent element
            if (typeof element === "object" && element.nodeName === "#text" && (element.parentNode instanceof HTMLElement)) {
                element = element.parentNode;
            }

            if (!(element instanceof HTMLElement)) {
                return;
            }

            element_id = $(element).attr("data-id");

            if ( ! element_id) {
                return this.getParentElementId(element.parentNode);
            }

            return element_id;
        },


        /*
         * Get All Child Inline elements
         *
         * Recursively goes through element nodes until it finds a valid block tag
         * and returns all of the inline tags within the selection
         */
        getAllChildInlineElements: function(element, elementArray) {

            // Setup the array for the first run
            if (!elementArray) elementArray = [];

            // We want to go up recursively if we don't have a valid element, or
            // if it is an inline element, and collect the inline tags
            if ( ! this._isValidElement($(element)) || this._isSupportedInlineElement($(element))) {
                // Check the tag name is a valid inline property and add it to the stack
                if (this._isSupportedInlineElement($(element))) {
                    elementArray.push(element.nodeName.toLowerCase());
                }

                // Recurse on through
                return this.getAllChildInlineElements(element.parentNode, elementArray);
            }

            // Return the inline tags array
            return elementArray;
        },


        /**
         * _isEmptyFloatedElement
         *
         * Checks element if it is empty and floated
         *
         * @param  {jQuery element}  element
         *
         * @return {Boolean}
         */
        _isEmptyFloatedElement: function(element) {
            var contents, is_empty = true, float_value;

            // Check if it is single jQuery element
            if ( ! (element instanceof $) || element.length !== 1) return false;

            // It is possible to select an image so we don't need to check them
            if (element.is("img")) return false;

            // Get element contents
            contents = element.contents();

            contents.each(function() {
                if (this.nodeName === "#text" && this.textContent.length === 0) {
                    return false;
                }

                if (this.nodeName.toLowerCase() === "br") {
                    return false;
                }

                is_empty = false;

                return true;
            });

            if ( ! is_empty) return false;

            // Get css float property value of element
            float_value = element.css("float");

            // Check if element is not floated
            if (["left", "right"].indexOf(float_value) === -1) return false;

            return true;
        },


        /**
         * _addRemoveEmptyFloatedElementAttribute
         *
         * Adds or removes data attribute on element
         *
         * @param  {jQuery element}  element
         *
         * @return {Boolean}
         */
        _addRemoveEmptyFloatedElementAttribute: function(element) {
            // Remove attribute from the element
            element.removeAttr("data-empty-floated-element");

            // Check if element is empty and floated
            if (this._isEmptyFloatedElement(element)) {
                // Add data attribute to indicate it
                element.attr("data-empty-floated-element", "yes");
            }

            return true;
        },


        /*
         * check for black listed elements
         *
         * Runs through the html and removes elements which are black listed
         */
        removeBlackListedElements: function(current_html) {
            var self = this;

            // Get all sub elements in the tree
            $(current_html).find("*").each(function() {
                var $el = $(this);

                if (self._isBlackListedElement($el)) {
                    $el.remove();
                }
            });
        },


        /*
         * check for newly added elements
         *
         * Runs through the html and checks for elements without a unique ID
         */
        checkForNewlyAddedElements: function(containerId, currentHtml, is_first_run) {
            // First we loop through and check for text nodes
            var contentsOfHtml = $(currentHtml).andSelf().contents(),
                media_query_id = currentHtml.attr("data-media-query-id"),
                domEl, jqElement, newElement, children,
                elSelection, j, jLen, i, len, $el, elInfo;

            for (j = 0, jLen = contentsOfHtml.length; j < jLen; j++) {
                domEl = contentsOfHtml[j];
                jqElement = $(domEl);

                // If the element is a text node, wrap it in a paragraph
                if (domEl.nodeName === "#text" && domEl.textContent.trim().length > 0) {
                    newElement = $("<p>"+ domEl.textContent +"</p>");
                    jqElement.replaceWith(newElement);
                }
            }

            // Get all sub elements in the tree
            children    =   $(currentHtml).find("*");
            elSelection =   null;

            if (children.length < 1) return false;
            // #TODO Else if not valid inline tag, remove.

            for (i = 0, len = children.length; i < len; i++) {
                $el = $(children[i]);

                // Do check for all elements when first run
                if (is_first_run === true) {
                    // Check if element is empty and floated and add data attribute
                    // We need setTimeout to ensure that css styles are applied
                    // to check element float css property.
                    // Proxy "$el" to have a correct element instead of always the last one.
                    setTimeout($.proxy(this._addRemoveEmptyFloatedElementAttribute, this, $el), 0);
                }

                // If the element doesn't have an ID it is new
                if (this._isValidElement($el) && this.validId($el.attr("data-id"))) {
                    continue;
                }

                // Check if element is empty and floated and add data attribute
                this._addRemoveEmptyFloatedElementAttribute($el);

                // Take out unnecessary attributes
                $el = this.stipUnnecessaryAttributes($el);

                // Take out the classes
                $el = this.stripAllClassesUnlessDataAttrIsSet($el);
                // Generate a new ID for the element
                elInfo = {
                    "el": $el,
                    "newId": this.getNewElementId(),
                    "parent": $el.parent().attr("data-id") || containerId,
                    "index": $el.index(),
                    "tagName": $el.get(0).tagName,
                    "text": $el.html()
                };

                // Newly added element, give it a new ID
                $el.attr("data-id", elInfo.newId);

                // Hold onto the first new element as this will be used for the selection
                // event that we fire
                if (elSelection === null) {
                    elSelection = elInfo;
                }

                // Trigger newly added event
                this.events.trigger("content-event:element-added", elInfo.newId, elInfo.parent, elInfo.index, elInfo.tagName, elInfo.text, this.getAttributesHashFromNodeMap($el.get(0).attributes));
            }

            if (elSelection) {
                if (elSelection.el.is("img")) {
                    this.events.trigger("content-event:image-selected", elSelection.newId, media_query_id);
                } else {
                    this.events.trigger("content-event:selection", {"start": 0, "end": 0}, [elSelection.newId, elSelection.newId], null, [], media_query_id);
                }
            }

            return true;
        },


        /**
         * stipUnnecessaryAttributes
         *
         * Returns element without unnecessary attributes.
         * When we drag some element from another page it could be copied
         * with attributes like id, width, height or style which we do not support.
         */
        stipUnnecessaryAttributes: function(el) {
            // Get a list of attributes from Aloha config
            var unnecessary_attributes = window.Aloha && window.Aloha.settings && window.Aloha.settings.contentEvent && window.Aloha.settings.contentEvent.unnecessaryAttributes;

            // Check if it is not an empty array
            if (Array.isArray(unnecessary_attributes) && unnecessary_attributes.length > 0) {
                // Remove attributes
                el.removeAttr(unnecessary_attributes.join(" "));
            }

            return el;
        },


        /*
         * Strip all classes unless data attr is set
         *
         * We set a data-retain-classes attribute on duplicate and paste,
         * if this attr is not set we should strip all classes on new elements.
         */
        stripAllClassesUnlessDataAttrIsSet: function(el) {
            var retainClasses = el.attr("data-retain-classes");

            if (retainClasses !== "yes") {
                // Destroy the classes
                el.attr("class", "");
            }
            else {
                // Remove the data attr
                el.attr("data-retain-classes", null);
            }

            return el;
        },


        /*
         * check for removed elements
         *
         * will trigger element-removed event if any elements have been deleted
         */
        checkForRemovedElements: function(containerId, oldHtml, newHtml) {
            if (! oldHtml || ! newHtml) {
                return false;
            }

            // Loop through old elements in html cache
            for (var id in oldHtml) {
                // Try to find each element in the newHtml
                if ($(newHtml).find("[data-id='"+ id +"']").length === 0) {
                    // Element has been deleted trigger an event
                    this.events.trigger("content-event:element-removed", id);

                    // If the ID is the active element, unset it
                    if (this.getActiveElement() === id) {
                        this.activeElement = null;
                    }
                }
            }

            return true;
        },


        /*
         * check for updated elements
         *
         * will trigger element-updated event if any elements have been updated
         * this includes: type, content and index
         */
        checkForUpdatedElements: function(containerId, oldHtml, newHtml) {
            var self = this,
                parent_id,
                $el,
                oldEl;

            if (! newHtml) {
                return false;
            }

            newHtml.find("*").each(function() {
                $el = $(this);

                if (! $el.attr("data-id")) return;

                // Find an old state by ID
                oldEl = self.getPreviousHtmlStateForId(containerId, $el.attr("data-id"));

                // If the oldEl was not found return
                if ( ! oldEl) return;

                // Check for changes
                if (self.diffDomChanges(oldEl, $el.get(0))) {
                    // If the element does not have a parent ID its parent must be the container
                    parent_id = $el.parent().attr("data-id") || containerId;

                    // Check if element is empty and floated and add data attribute
                    self._addRemoveEmptyFloatedElementAttribute($el);

                    // Changes are present, emit an event
                    self.events.trigger("content-event:element-updated", $el.attr("data-id"), parent_id, $el.index(), $el.get(0).tagName, $el.html(), self.getAttributesHashFromNodeMap($el.get(0).attributes));
                }
            });
        },


        /*
         * diff dom changes
         *
         * Determines if a DOM node has changed.
         *
         * @param {Object} old_element - Old version of the element
         * @param {HTMLElement} new_element - Reference to the DOM node
         * @returns {Boolean} - true if changes are present, otherwise false
         */
        diffDomChanges: function(old_element, new_element) {
            var data_attribute_reg_exp = /\sdata-.+?((=["'].*?["'])|.*?(?=\s|>))/g,
                new_element_class;

            // Check content for changes, ignoring data- attribute changes
            if (old_element.innerHTML.replace(data_attribute_reg_exp, "") !== new_element.innerHTML.replace(data_attribute_reg_exp, "")) return true;

            // Check tagname for changes
            if (old_element.tagName !== new_element.tagName) return true;

            // Check for index changes
            if (old_element.index !== $(new_element).index()) return true;

            // Normalise class names and check for change
            if (typeof old_element.className === "undefined") {
                old_element.className = "";
            }

            new_element_class = $(new_element).attr("class");
            if (typeof new_element_class === "undefined") {
                new_element_class = "";
            }

            if (old_element.className !== new_element_class) return true;

            return false;
        },


        validId: function(id) {
            // Check the ID is a UUID
            if (typeof id === "string" && id.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/)) return true;

            return false;
        },


        /*
         * get new element id
         *
         * returns a new unique element ID
         */
        getNewElementId: function() {
            return this.generateUUID();
        },


        /*
         * generate UUID
         *
         * generates an RFC4122 version 4 compliant UUID
         */
        generateUUID: function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        },


        /*
         * ready
         *
         * The aloha instance has gained focus.
         */
        ready:  function() {

        },


        /*
         * activated
         *
         * The aloha instance has gained focus.
         */
        activated:  function(ev, data) {
            var containerId = $(data.editable.originalObj[0]).attr("data-id");
            this.events.trigger("content-event:container-activated", containerId);
        },


        /*
         * deactivated
         *
         * The aloha instance has lost focus, is blurred.
         */
        deactivated:    function(ev, data) {
            var containerId = $(data.editable.originalObj[0]).attr("data-id");
            this.setActiveElement(containerId, null);
            this.events.trigger("content-event:container-deactivated", containerId);
        },


        /**
         * clickImage
         *
         * This method will handle the click event on images (eg. within editables).
         */
        clickImage: function (editable, e) {
            var image = $(e.target),
                element_id,
                media_query_id;

            if (image.length !== 1) return false;

            element_id = image.attr("data-id");

            if ( ! _.isString(element_id) || element_id.length < 1) return false;

            media_query_id = $(editable.originalObj[0]).attr("data-media-query-id");

            if ( ! _.isString(media_query_id) || media_query_id.length < 1) return false;

            this.events.trigger("content-event:image-selected", element_id, media_query_id);

            return true;
        },


        /*
         * new editable
         *
         * Triggered when a new editable field is activated
         */
        newEditable: function(ev, data) {
            var editor = $(data.obj),
                containerId = editor.attr("data-id");

            if (!editor || !containerId) return false;

            // Inital click on images will be handled here
            data.obj.delegate("img", "mouseup", $.proxy(this, "clickImage", data));

            // Ensure there are no duplicate IDs
            this.duplicateResolver(editor);

            // Remove any black listed elements
            this.removeBlackListedElements(editor);

            // First run to give everything an ID
            this.checkForNewlyAddedElements(containerId, editor, true);

            // Cache the current html for state
            this.setPreviousHtmlState(containerId, editor[0].outerHTML);

            // Send out an event to let others know a new container has been set up
            this.events.trigger("content-event:new-container", containerId);

            // Flush out the current changeset
            this.events.trigger("content-event:current-changeset-complete");
        },


        /*
         * destroy editable
         *
         * Triggered when an editable field is destroyed
         */
        destroyEditable: function(ev, data) {
            var editor = $(data.obj),
                containerId = editor.attr("data-id");

            // Remove image click handler
            data.obj.undelegate("img", "mouseup");

            // We want to delete out the html cache for destroyed editables
            this.destroyStateForContainerId(containerId);

            // Send out an event to let others know the container has been destroyed
            this.events.trigger("content-event:destroy-container", containerId);
        },


        /*
         * duplicate resolver
         *
         * Ensures that each element in the content editable field has a unique
         * ID. If duplicates are found, then all dupes are deleted and new IDs
         * generated.
         *
         * WARNING! Only call this function if it is followed by checkForNewlyAddedElements
         * as this function removes IDs from duplicate elements, so they need new IDs assigned.
         */
        duplicateResolver: function(editor) {
            var ids = {};

            if(!editor) return false;   // We need an editor

            // Get a list of all element IDs
            editor.find("*").each(function() {
                var el = $(this);

                if(el.attr("data-id") && !ids[el.attr("data-id")]) {
                    ids[el.attr("data-id")] = 1;
                } else {
                    ids[el.attr("data-id")]++;
                }
            });

            // Check for duplicates
            for(var i in ids) {
                if(ids.hasOwnProperty(i) && ids[i] > 1) {
                    // Broadcast the fact that these elements have been removed
                    this.events.trigger("content-event:element-removed", i);

                    // Remove the duplicate ID from the elements
                    /*jshint loopfunc: true */
                    editor.find("[data-id='"+ i +"']").each(function() {
                        $(this).attr("data-id", null);
                    });
                }
            }

            return true;
        },


        /*
         * set previous html state
         *
         * Saves the state of the editor html for later comparison
         */
        setPreviousHtmlState: function(containerId, html) {
            var domNodes = {},
                self = this;

            if (!containerId || !html) return false;

            // Check state has been setup for this container ID before, or set it up
            if (typeof this.state[containerId] !== "object" || this.state[containerId] === null) {
                this.state[containerId] = {};
            }

            // Add each valid block element to the lookup array
            $(html).find("*").each(function() {
                var el = $(this), element_obj = {};

                if (self._isValidElement(el)) {
                    element_obj.innerHTML = el.get(0).innerHTML;
                    element_obj.tagName = el.get(0).tagName;
                    element_obj.index = el.index();
                    element_obj.className = el.attr("class");

                    domNodes[el.attr("data-id")] = element_obj;
                }
            });

            // Save it
            this.state[containerId].previousHtmlState = domNodes;
        },


        /*
         * get previous html state
         *
         * Returns a hash of key => unique ID : value = => HTMLElement of the previous html state of the editor
         */
        getPreviousHtmlState: function(containerId) {
            // Check we have a stored state for this container ID
            if (typeof this.state[containerId] !== "object" || this.state[containerId] === null) {
                return false;
            }

            // Retrieve last state
            return this.state[containerId].previousHtmlState;
        },


        /*
         * get previous html state for ID
         *
         * Returns a DOM node for the given ID if it exists in the stored state
         */
        getPreviousHtmlStateForId: function(containerId, id) {
            // Get the previous state hash
            var stateHash = this.getPreviousHtmlState(containerId);

            // Check the ID exists in the state
            if (!stateHash || stateHash[id] === undefined) return false;

            return stateHash[id];
        },


        /*
         * Destroy State For Container ID
         *
         * Useful when a container gets removed to clean out it's previous state
         * and free up some more memory
         */
        destroyStateForContainerId: function(containerId) {
            delete this.state[containerId];
        },


        /*
         * set active element
         *
         * Stores the actively focused element ID
         */
        setActiveElement: function(containerId, elementId) {
            // Make sure to default a falsy value to null
            if (!elementId || typeof elementId !== "string") elementId = null;

            if (this.activeElement === elementId) return;

            this.activeElement = elementId;

            // Broadcast the newly focused element
            // (We still want to broadbast `null` for deselection)
            this.events.trigger("content-event:active-element", elementId);
        },


        /*
         * get active element
         *
         * Returns the actively focused element ID, will be `null` if no element is currently focused
         */
        getActiveElement: function() {
            return this.activeElement;
        },


        /*
         * get attributes hash from NodeMap
         *
         * Takes a node map of element attributes and simplifies them down into
         * a hash used to set the properties again using jQuery.
         */
        getAttributesHashFromNodeMap: function(nodeMap) {
            var attrs = {};

            if (nodeMap.length === 0) return attrs;

            // Loop through node map array
            for (var i = 0, len = nodeMap.length; i < len; i++) {
                // Ignore all data attributes
                if (nodeMap[i].name.substr(0, 5) === "data-") {
                    continue;
                }

                attrs[nodeMap[i].name] = nodeMap[i].value;
            }

            return attrs;
        },



        /*
         *  --------------------------------------------------------------------
         *  @ PRIVATE
         *  --------------------------------------------------------------------
         */



        /*
         *  _isValidElement
         *
         *  Determines if an element is valid
         *  based on presence of a data-id
         */
        _isValidElement: function($element) {
            if ( ! ($element instanceof $)) return false;

            return !! $element.attr("data-id");
        },


        /*
         *  _isBlackListedElement
         *
         *  Determines if an element is in our list of bad element types
         */
        _isBlackListedElement: function($element) {
            var tag_name = this._getTagNameForElement($element);

            return black_listed_tag_names.indexOf(tag_name) !== -1;
        },


        /*
         *  _isSupportedInlineElement
         *
         *  Returns {Boolean}
         */
        _isSupportedInlineElement: function($element) {
            var tag_name = this._getTagNameForElement($element);

            return supported_inline_tag_names.indexOf(tag_name) !== -1;
        },


        /*
         *  _getTagNameForElement
         *
         *  Returns a tag name for an element or empty string if it can't be found.
         */
        _getTagNameForElement: function($element) {
            if ( ! ($element instanceof $)) return "";

            return ($element.prop("tagName") || "").toLowerCase();
        }

    });

});
