"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentTagMarkSpec = void 0;
// supported types of content tag
const contentType = ['enfermeria', 'policia', 'auxiliar'];
exports.ContentTagMarkSpec = {
    //TODO: definir este tipo y que venga desde back
    attrs: { type: { default: 'enfermeria' } },
    toDOM: mark => [
        'span',
        {
            class: 'content',
            'content-type': mark.attrs.type,
        },
    ],
    parseDOM: [{
            // tags que matchea para parsear, en este caso es un div de class content
            tag: "span.content",
            getAttrs(dom) {
                let type = dom.getAttribute("content-type");
                let content_type = contentType.indexOf(type) > -1 ? type : false;
                return { 'type': content_type };
            }
        }]
};
