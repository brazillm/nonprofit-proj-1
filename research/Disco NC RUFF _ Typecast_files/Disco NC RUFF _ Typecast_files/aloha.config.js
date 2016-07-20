/*
 *  Aloha Configuration
 *
 *  Configuration for all Aloha editor settings
 *
 *  @author Pete Hawkins
 */
var Aloha = Aloha || {};

Aloha.settings = Aloha.settings || {
    requireConfig:  {
        paths: {
            'cleansePasteHandler'   :  "../plugins/Typecast/cleansePaste/lib/cleansePasteHandler",
            'genericVariantHandler' :  "../plugins/Typecast/genericVariant/lib/genericVariantHandler",
            'backbone_amd'          :  "/js/libs/backbone/backbone-amd",
            'underscore'            :  "/js/libs/underscore/underscore-amd"
        },
        urlArgs: "bust=" + Config.global.cache_beater
    },
    baseUrl: "/js/libs/aloha/lib",
    contentHandler: {
        // Do not use 'generic' for handling paste, we have created our own variant of this 'genericVariant'
        insertHtml: ['word', 'sanitize', 'genericVariant', 'blockelement', 'cleansePaste'],
        initEditable: [],
        getContent: ['sanitize'],
        allows: {
            elements: [
                'a', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'b', 'i', 'blockquote', 'br', 'ul', 'ol', 'li',
                'div', 'section', 'article', 'aside', 'nav', 'menu', 'header', 'footer', 'time',
                'img'
            ],
            attributes: {
                // Leave the class attached incase the user copy & pastes from within Typecast
                // cleansePaste will pick this up
                'a':          [/*'class',*/ 'href', /*'data-retain-classes'*/],
                'h1':         ['class', 'data-retain-classes'],
                'h2':         ['class', 'data-retain-classes'],
                'h3':         ['class', 'data-retain-classes'],
                'h4':         ['class', 'data-retain-classes'],
                'h5':         ['class', 'data-retain-classes'],
                'h6':         ['class', 'data-retain-classes'],
                'p':          ['class', 'data-retain-classes'],
                'b':          [/*'class', 'data-retain-classes'*/],
                'i':          [/*'class', 'data-retain-classes'*/],
                'blockquote': ['class', 'data-retain-classes'],
                'ul':         ['class', 'data-retain-classes'],
                'ol':         ['class', 'data-retain-classes'],
                'li':         ['class', 'data-retain-classes'],
                'div':        ['class', 'data-retain-classes'],
                'section':    ['class', 'data-retain-classes'],
                'article':    ['class', 'data-retain-classes'],
                'aside':      ['class', 'data-retain-classes'],
                'nav':        ['class', 'data-retain-classes'],
                'menu':       ['class', 'data-retain-classes'],
                'header':     ['class', 'data-retain-classes'],
                'footer':     ['class', 'data-retain-classes'],
                'time':       ['class', 'data-retain-classes'],
                'img':        ['class', 'data-retain-classes', 'src']
            },
            protocols: {},
        }
    },
    contentEvent: {
        unnecessaryAttributes: ['id', 'width', 'height', 'style']
    }
};
