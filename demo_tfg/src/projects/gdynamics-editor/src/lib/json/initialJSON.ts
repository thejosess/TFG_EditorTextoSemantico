// import { Attrs, Fragment, Mark } from 'prosemirror-model';

export const initialDoc = {
    "type": "doc",
    "content": [
        {
            "type": "paragraph",
            "content": [
                {
                    "type": "text",
                    "marks": [
                        {
                            "type": "tag",
                            "attrs": {
                                "tagType": "OPE",
                                "color": "#FF0000"
                            }
                        }
                    ],
                    "text": "nuevo mark de exam_tag"
                }
            ]
        },
        {
            "type": "heading",
            "content": [
                {
                    "type": "text",
                    "text": "heading",
                    "attrs": { level: 1 },
                }
            ]
        },
        {
            "type": "paragraph",
            "content": [
                {
                    "type": "text",
                    "text": "parrafo vacio"
                }
            ]
        },
        {
            "type": "box",
            "attrs": {
                "type": "green",
                "title": "titulo del recuadro",
                "color": "primary"
            },
            "content": [
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "probando cuadro de color"
                        }
                    ]
                }
            ]
        },
        {
            "type": "paragraph",
            "content": [
                {
                    "type": "text",
                    "text": "etiquetado de contentido para "
                },
                {
                    "type": "text",
                    "marks": [
                        {
                            "type": "content",
                            "attrs": {
                                "type": "policia"
                            }
                        }
                    ],
                    "text": "policia"
                }
            ]
        },
        {
            "type": "paragraph",
            "content": [
                {
                    "type": "text",
                    "text": "probando "
                },
                {
                    "type": "text",
                    "marks": [
                        {
                            "type": "palette",
                            "attrs": {
                                "color": "warn"
                            }
                        }
                    ],
                    "text": "palette tag nueva"
                }
            ]
        },
        {
            "type": "paragraph",
            "content": [
                {
                    "type": "text",
                    "text": "probando el "
                },
                {
                    "type": "text",
                    "marks": [
                        {
                            "type": "tag",
                            "attrs": {
                                "tagType": "OPE",
                                "color": "#FF0000"
                            }
                        }
                    ],
                    "text": "nuevo mark de exam_tag"
                }
            ]
        },
        {
            "type": "node_multi_cols",
            "attrs": {
                "ncols": "2"
            },
            "content": [
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius."
                        }
                    ]
                }
            ]
        }
    ]
}