"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemePaletteMarkSpec = void 0;
const types_1 = require("../../types/types");
exports.ThemePaletteMarkSpec = {
    attrs: { color: { default: 'primary' } },
    toDOM: mark => [
        'span',
        {
            class: 'palette',
            'color': mark.attrs.color,
        },
    ],
    parseDOM: [{
            // tags que matchea para parsear, en este caso es un div de class tag
            tag: "span.palette",
            getAttrs(dom) {
                let color = dom.getAttribute("color");
                let spanColor = types_1.colorType.indexOf(color) > -1 ? color : false;
                return { 'color': spanColor };
            }
        }]
};
