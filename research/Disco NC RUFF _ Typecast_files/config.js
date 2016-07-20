/*
 * Typecast Application Configuration
 *
 */
var Config = {
    appHolderSelector:  ".typecast",
    disabledModules: {
        service: [],
        data: [],
        ui: []
    },

    // Global config options that get passed to every module
    global: {
        supported_elements: {
            containers: ["article", "aside", "div", "footer", "header", "nav", "section"],
            child_elements: ["blockquote", "h1", "h2", "h3", "h4", "h5", "h6", "ol", "p", "ul", "code"],
            list_elements: ["li"],
            image_elements: ["img"],
            inline: ["strong", "em", "a", "b", "i", "u", "span", "sub", "sup"]
        },
        placeholder_image: "/js/src/images/placeholders/placeholder.png",
        placeholders_path: "/js/src/images/placeholders/",
        uploads: {
            images: {
                allowed_file_extensions: ["png", "jpg", "jpeg", "svg", "gif"]
            }
        }
    },

    // Module specific configuration
    modules: {
        service: {
            'debug': {
                'namespace':    'core:debug'
            },
            connection: {
                types: {
                    'socket.io': {
                        protocol: 'https',

                        // Options for socket.io
                        // https://github.com/LearnBoost/Socket.IO/wiki/Configuring-Socket.IO#client
                        options: {
                            'connect timeout':             2500,   // Set timeout between transport types - default: 10000
                            'reconnection delay':          100,    // default: 500
                            'max reconnection attempts':   104,
                            'secure':                      true
                        },

                        // Custom reconnection settings
                        reconnection: {
                            'exponential backoff':         true,
                            'exponential threshold':       3000,   // 3 seconds. Set to 0 to disable
                            'fatal disconnection timeout': 150000  // 2.5 minutes
                        },

                        // Authentication details
                        authentication: {
                            cookies: {
                                session: 'exp_sessionid',
                                auth_token: 'exp_tracker.Inoped'
                            }
                        },

                        // Reauthentication request details
                        reauthentication: {
                            url: '/?ACT=102&class=members&method=reAuth',
                            timeout: 10000
                        },

                        // Communication details
                        communication: {
                            timeout: 5000
                        }
                    },

                    "ajax": {
                        fetch_url: "/?ACT=102&class=projects&method=getProject&project_id={{project_id}}",
                        fetch_revision_url: "/?ACT=102&class=projects&method=getProject&project_id={{project_id}}&revision={{revision}}",
                        save_url: "/?ACT=102&class=projects&method=saveProject&project_id={{project_id}}"
                    },

                    'localstorage': {
                        update_throttle: 500,
                        key_prefix: 'typecast_demo_project_',
                        init_data: {"data":{"project":{"id":"77618","share_url":"1mi173k3n83nejdhbw83neudbh73nbdud873","title":"Test Project Data"},"containers":{"containers":[{"index":0,"element_id":"orek1-234fds-23rwefdv-1","id":"a-container-id-1"},{"index":1,"element_id":"orek1-234fds-23rwefdv-2","id":"a-container-id-2"},{"index":2,"element_id":"orek1-234fds-23rwefdv-3","id":"a-container-id-3"}],"elements":[{"id":"orek1-234fds-23rwefdv-1","type":"element","tag_name":"div","attributes":{"class":"first-div","width":"480px"},"children":[{"element_id":"orek1-234fds-23rwefdx-1-font-integration","type":"element","index":0},{"element_id":"orek1-234fds-23rwefdx-2-font-integration","type":"element","index":1},{"element_id":"orek1-234fds-23rwefdx-3-font-integration","type":"element","index":2},{"element_id":"orek1-234fds-23rwefdx-4-font-integration","type":"element","index":3}]},{"id":"orek1-234fds-23rwefdx-1-font-integration","parent_id":"orek1-234fds-23rwefdv-1","type":"element","tag_name":"p","attributes":{"class":"effra-regular-font-integration"},"children":[{"index":0,"type":"text","content":"Effra W02 Regular"}]},{"id":"orek1-234fds-23rwefdx-2-font-integration","parent_id":"orek1-234fds-23rwefdv-1","type":"element","tag_name":"p","attributes":{"class":"effra-heavy-font-integration"},"children":[{"index":0,"type":"text","content":"Effra W02 Heavy"}]},{"id":"orek1-234fds-23rwefdx-3-font-integration","parent_id":"orek1-234fds-23rwefdv-1","type":"element","tag_name":"p","attributes":{"class":"effra-light-italic-font-integration"},"children":[{"index":0,"type":"text","content":"Effra W01 Light Italic"}]},{"id":"orek1-234fds-23rwefdx-4-font-integration","parent_id":"orek1-234fds-23rwefdv-1","type":"element","tag_name":"p","attributes":{"class":"droid-sans-regular-font-integration"},"children":[{"index":0,"type":"text","content":"Droid Sans (selected in 5 seconds)"}]},{"id":"orek1-234fds-23rwefdv-2","type":"element","tag_name":"div","attributes":{"width":"480px"},"children":[{"element_id":"orek1-234fds-23rwefdx-2","type":"element","index":0}]},{"id":"orek1-234fds-23rwefdx-2","parent_id":"orek1-234fds-23rwefdv-2","type":"element","tag_name":"p","children":[{"index":0,"type":"text","content":"Type or "},{"index":1,"type":"element","element_id":"orek1-234fds-23rwefdx-bolded"},{"index":2,"type":"text","content":" text here..."}]},{"id":"orek1-234fds-23rwefdx-bolded","parent_id":"orek1-234fds-23rwefdx-2","type":"element","tag_name":"strong","children":[{"index":0,"type":"text","content":"paste"}]},{"id":"orek1-234fds-23rwefdv-3","type":"element","tag_name":"div","attributes":{"width":"480px"},"children":[{"element_id":"orek1-234fds-23rwefdx-3","type":"element","index":0}]},{"id":"orek1-234fds-23rwefdx-3","parent_id":"orek1-234fds-23rwefdv-3","type":"element","tag_name":"p","children":[{"index":0,"type":"text","content":"Type or paste text here..."}]}]},"styles":{"styles":[{"id":12345},{"id":12346}],"style_declarations":[{"style_id":12345,"selector":".first-div p.first","id":"b525e8fb-f696-4bec-b137-2d3299540230","attributes":{"color":["#333"],"font-size":["1.125em"],"line-height":["1.25em"],"text-transform":["capitalize"],"text-indent":[".5em"],"letter-spacing":["-0.05em"],"text-align":["center"],"font-family":[["'Effra W02 Regular'","Arial","Sans-Serif"]]}},{"style_id":12346,"selector":"p.first","id":"c525e8fb-f696-4bec-b137-2d329954d879","attributes":{"font-size":["1.175em"]}},{"style_id":12345,"selector":"p.effra-regular-font-integration","id":"c525e8fb-f696-4bec-b137-2d329954d879-1-font-integration","attributes":{"font-family":["Effra W02 Regular"]}},{"style_id":12345,"selector":"p.effra-heavy-font-integration","id":"c525e8fb-f696-4bec-b137-2d329954d879-2-font-integration","attributes":{"font-family":["Effra W02 Heavy"]}},{"style_id":12345,"selector":"p.effra-light-italic-font-integration","id":"c525e8fb-f696-4bec-b137-2d329954d879-3-font-integration","attributes":{"font-family":["Effra W01 Light Italic"]}},{"style_id":12345,"selector":"p.droid-sans-regular-font-integration","id":"c525e8fb-f696-4bec-b137-2d329954d879-4-font-integration","attributes":{"font-family":["Droid Sans"]}},{"style_id":12345,"selector":".alt p.first","id":"d525e8fb-f696-4bec-b137-2d3299540231","attributes":{"font-size":["1.2em"]}},{"style_id":12345,"selector":"p","id":"e525e8fb-f696-4bec-b137-2d3299540232","attributes":{"font-size":["1.13em"]}}]},"fonts":{"activeFonts":[{"id":"6035","variations":[{"id":28400},{"id":28390},{"id":28395}]}]},"permissions":{}}},
                    },

                    'demo': {
                        root_demo_url: "/preview",
                        url_path: document.location.pathname.split("/").slice(2).join("/"),
                        data_url: "/?ACT=102&class=preview&method=getPublicTemplateByNameAndJsonFontsString",
                        templates: {
                            "default": {
                                "default_template": "type-on-screen",
                                "font_family_template": "showcase-font-family",
                                "font_variation_template": "type-specimen"
                            },
                            "google": {
                                "default_template": "type-on-screen",
                                "font_family_template": "showcase-font-family",
                                "font_variation_template": "type-specimen"
                            },
                            "myfonts": {
                                "default_template": "type-on-screen",
                                "font_family_template": "type-on-screen",
                                "font_variation_template": "type-on-screen"
                            }
                        }
                    }
                }
            },
            collaboration: {
                event_mappings: {
                    // Project events
                    'data:project:changed': {
                        event_name: 'data:project:set',
                        type: 'update'
                    },
                    'data:project:forceSave': {
                        event_name: 'data:project:forceSave:complete',
                        type: 'queue'
                    },

                    // Element events
                    'data:elements:new:element': {
                        event_name: 'data:elements:createElement',
                        type: 'queue'
                    },
                    'data:elements:updated:element': {
                        event_name: 'data:elements:updateElement',
                        type: 'update'
                    },
                    'data:elements:deleted:element': {
                        event_name: 'data:elements:deleteElement',
                        type: 'queue'
                    },

                    // Style events
                    'data:styles:changed': {
                        event_name: 'data:styles:setAttributesForStyleDeclaration',
                        type: 'update'
                    },
                    'data:styles:deleted:styleDeclaration': {
                        event_name: 'data:styles:deleteStyleDeclaration',
                        type: 'queue'
                    },
                    'data:fonts:changed:active-fonts': {
                        event_name: 'data:fonts:set:active-fonts',
                        type: 'update'
                    },

                    // Media Query events
                    'data:styles:new:mediaQuery': {
                        event_name: 'data:styles:createMediaQuery',
                        type: 'queue'
                    },
                    'data:styles:updated:mediaQuery': {
                        event_name: 'data:styles:updateMediaQuery',
                        type: 'update'
                    },
                    'data:styles:deleted:mediaQuery': {
                        event_name: 'data:styles:deleteMediaQuery',
                        type: 'queue'
                    },

                    // External events
                    'external:previous-version:changed': {
                        event_name: 'external:previous-version:change',
                        type: 'update'
                    }

                },
                throttle_interval: 500
            },
            'log-service': {
                cloud_logging_levels: [ "error" ],
                loggly_key: "3da7259d-2379-4d61-a51d-2364e39aafe9"
            },
            metrics: {
            }
        },
        data: {
            elements: {
                namespace:                  "data:elements",
                default_container_element:  "div",
                default_new_element:        "p",
                default_new_element_content:"Type or paste some content here",
                default_container_width:    "480px"
            },
            fonts: {
                namespace:    'data:fonts',
                xhr: {
                    timeout: 0
                },
                actionIds: {
                    "fetchFontFamilyById": 102,
                    "fetch": 102,
                    "fetchFilters": 102,
                    "getByCSSFontFamily": 102,
                    "addFavourite": 102,
                    "deleteFavourite": 102
                }
            },
            project: {
                id:                 null,
                title:              "Untitled Project",
                share_url:          null,
                // Auto save interval in seconds
                auto_save_interval: 60,
                // Inactivity timeout in seconds
                inactivity_timeout: 1800,
                unlock_project_url: "/?ACT=102&class=projects&method=unlockProject"
            },
            styles: {
                prefixes: {
                    prefixes: [
                        "-webkit-",
                        "-o-",
                        "-moz-",
                        "-ms-"
                    ],
                    attributes: [
                        "column-count",
                        "column-width",
                        "column-gap",
                        "column-rule-width",
                        "column-rule-style",
                        "column-rule-color",
                        "column-break-before",
                        "column-break-inside",
                        "column-break-after",
                        "box-shadow",
                        "border-radius",
                        "font-feature-settings"
                    ]
                },
                default_mq_min_width: "300px"
            },
            'baseline-grid': {
                supportedUnits: ["px", "em", "%"]
            },
            "walkthroughs": {
                "api": {
                    "action_id": 118,
                    "class": "walkthroughs"

                }
            }
        },
        ui: {
            'main-dialog': {
                controls: {
                    "defaults": ["breadcrumbs", "colour_swatches", "font_family", "font_size", "transform", "box_model", "background_image"],
                    "img": ["breadcrumbs", "image", "box_model"]
                },
                font_family: {
                    opentype: {
                        features: {
                            "abvf": "Above-base Forms",
                            "abvm": "Above-base Mark Positioning",
                            "abvs": "Above-base Substitutions",
                            "alig": "Accent Ligatures",
                            "aalt": "Access All Alternates",
                            "akhn": "Akhand",
                            "nalt": "Alternate Annotation",
                            "halt": "Alternate Half Widths",
                            "afrc": "Alternative Fractions",
                            "valt": "Alternative Vertical Metrics",
                            "vhal": "Alternative Vertical Half Metrics",
                            "bare": "Bare Base Glyphs",
                            "blwf": "Below-base Forms",
                            "blwm": "Below-base Mark Positioning",
                            "blws": "Below-base Substitutions",
                            "cpsp": "Capital Spacing",
                            "c2pc": "Capitals to Petite Caps",
                            "c2sc": "Capitals to Small Caps",
                            "case": "Case Sensive Forms",
                            "cpct": "Centered CJK Punctuation",
                            "cv01-cv99": "Character Variant",
                            "cjct": "Conjunct Forms",
                            "cfar": "Conjunct Form After Ro",
                            "calt": "Contextual Alternates",
                            "clig": "Contextual Ligatures",
                            "cswh": "Contextual Swash",
                            "curs": "Cursive Positioning",
                            "dnom": "Denominator",
                            "dlig": "Discretionary Ligatures",
                            "dist": "Distance",
                            "expt": "Expert Forms",
                            "falt": "Final Glyph on Line Alternates",
                            "frac": "Fractions",
                            "fwid": "Full Widths",
                            "ccmp": "Glyph Composition/Decomposition",
                            "haln": "Halant Forms",
                            "half": "Half Form",
                            "hwid": "Half Widths",
                            "hngl": "Hangul",
                            "hist": "Historical Forms",
                            "hlig": "Historical Ligatures",
                            "hkna": "Horizontal Kana Alternates",
                            "hojo": "Hojo Kanji Forms",
                            "init": "Initial Forms",
                            "isol": "Isolated Forms",
                            "ital": "Italics",
                            "jp04": "JIS 04 Forms",
                            "jp78": "JIS 78 Forms",
                            "jp83": "JIS 83 Forms",
                            "jp90": "JIS 90 Forms",
                            "jalt": "Justification Alternates",
                            "kern": "Kerning",
                            "lnum": "Lining Figures",
                            "ljmo": "Leading Jamo Forms",
                            "lfbd": "Left Bounds",
                            "ltra": "Left-to-right glyph alternates",
                            "ltrm": "Left-to-right mirrored forms",
                            "locl": "Localized Forms",
                            "mark": "Mark Positioning",
                            "mset": "Mark Positioning via Substitution",
                            "mkmk": "Mark-to-mark Positioning",
                            "mgrk": "Mathematical Greek",
                            "math": "Mathematical Forms",
                            "medi": "Medial Forms",
                            "med2": "Medial Form #2",
                            "mono": "Monospaced Widths",
                            "nlck": "NLC Kanji Forms",
                            "nukt": "Nukta Forms",
                            "numr": "Numerator",
                            "onum": "Oldstyle Figures",
                            "opbd": "Optical Bounds",
                            "size": "Optical size",
                            "ordn": "Ordinals",
                            "ornm": "Ornaments",
                            "pcap": "Petite Caps",
                            "pref": "Pre-base Forms",
                            "pres": "Pre-base Substitutions",
                            "psts": "Post-base Substitutions",
                            "pstf": "Post-base Forms",
                            "palt": "Proportional Alternates",
                            "vpal": "Proportional Alternate Vertical Metrics",
                            "pnum": "Proportional Figures",
                            "pkna": "Proportional Kana",
                            "pwid": "Proportional Widths",
                            "qwid": "Quarter Widths",
                            "rand": "Randomize",
                            "rkrf": "Rakar Forms",
                            "rphf": "Reph Form",
                            "rlig": "Required Ligatures",
                            "rtbd": "Right Bounds",
                            "rtla": "Right-to-left glyph alternates",
                            "rtlm": "Right-to-left mirrored forms",
                            "rmnz": "Romanization",
                            "ruby": "Ruby Notation Forms",
                            "sinf": "Scientific Inferiors",
                            "smpl": "Simplified Forms",
                            "zero": "Slashed Zero",
                            "smcp": "Small Caps",
                            "liga": "Standard Ligatures",
                            "salt": "Stylistic Alternates",
                            "ss01-ss20": "Stylistic Set",
                            "subs": "Subscript",
                            "sups": "Superscript",
                            "swsh": "Swash",
                            "tnum": "Tabular Figures",
                            "fina": "Terminal Forms",
                            "fin2": "Terminal Form #2",
                            "fin3": "Terminal Form #3",
                            "twid": "Third Widths",
                            "titl": "Titling Alternates",
                            "trad": "Traditional Forms",
                            "tnam": "Traditional Name Forms",
                            "tjmo": "Trailing Jamo Forms",
                            "trns": "Transliteration",
                            "typo": "Typographic Punctuation Marks",
                            "unic": "Unicase",
                            "vatu": "Vattu Variants",
                            "vert": "Vertical Alternates",
                            "vrt2": "Vertical Alternates and Rotation",
                            "vkna": "Vertical Kana",
                            "vkrn": "Vertical Kerning",
                            "vjmo": "Vowel Jamo Form"
                        }
                    }
                }
            },
            'font-loader': {
                providers: {
                    google: {
                        css_url: '//fonts.googleapis.com/css?family=',
                        css_extension: ''
                    },
                    typekit: {
                        loader: {
                            auth_id: 'typc',
                            auth_token: '3bb2a6e53c9684ffdc9a98f6185b2a62c91558083b789ab73fbbe67c348d99d61361563896158de7cdb45829c7afa81860a880c4d77cd3ddb0b3452bf1d07606aa020db06164b7c1dff5940da12f3f351dacb4855e259c3f21433bf400da9518f1114e6f0972c2e9495203c8c44c99804e1ff6492d5cc80786012ad45f67b0fa1d37ceb63bf9bdc456a21cb64d7913b4e8ca730d3b0dcafb006d558035e857967752abf50997d3ff912581cc99b448ce73b518251f6d5bdff52935fbaf50a7c256d367632ec5012ab0a7',
                            subset: 'all'
                        }
                    },
                    fontdeck: {
                        css_url: '//f.fontdeck.com/s/css//',
                        css_extension: '.css'
                    },
                    monotype: {
                        css_url: '/project/css/',
                        css_extension: ''
                    },
                    webtype: {
                        css_url: '//cloud.webtype.com/css/',
                        css_extension: '.css'
                    },
                    myfonts: {
                        css_url: '//easy.myfonts.net/v1/css?',
                        css_extension: ''
                    },
                },
                font_loading_timeout: 10000,
                font_data_timeout: 10000
            },
            'css-editor': {
                default_title: "Default styles"
            },
            'media-queries': {
                values: {
                    max_input_width: 5000,
                    min_input_width: 300,
                    min_drag_width:   300
                },
                max_width: {
                    rwd_strategy: 'desktop-first',
                    attribute: 'max-width',
                    queries: [
                        {
                            'type': 'screen',
                            'attr': 'max-width',
                            'width': '1280px'
                        },
                        {
                            'type': 'screen',
                            'attr': 'max-width',
                            'width': '1024px'
                        },
                        {
                            'type': 'screen',
                            'attr': 'max-width',
                            'width': '768px'
                        },
                        {
                            'type': 'screen',
                            'attr': 'max-width',
                            'width': '480px'
                        },
                        {
                            'type': 'screen',
                            'attr': 'max-width',
                            'width': '320px'
                        }
                    ]
                },
                min_width: {
                    rwd_strategy: 'mobile-first',
                    attribute: 'min-width',
                    queries: [
                        {
                            'type': 'screen',
                            'attr': 'min-width',
                            'width': '320px'
                        },
                        {
                            'type': 'screen',
                            'attr': 'min-width',
                            'width': '480px'
                        },
                        {
                            'type': 'screen',
                            'attr': 'min-width',
                            'width': '768px'
                        },
                        {
                            'type': 'screen',
                            'attr': 'min-width',
                            'width': '1024px'
                        },
                        {
                            'type': 'screen',
                            'attr': 'min-width',
                            'width': '1280px'
                        }
                    ]
                }
            }
        }
    },
    xhr: {
        defaultTimeout: 0
    }
};
