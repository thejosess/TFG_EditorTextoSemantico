import { MarkSpec } from 'prosemirror-model';

import { colorType } from '../../types/types';

export const ThemePaletteMarkSpec = {
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
        getAttrs(dom: HTMLElement) {
            let color = dom.getAttribute("color")
            let spanColor = colorType.indexOf(color!) > -1 ? color : false
            return { 'color': spanColor }
        }
    }]

} as MarkSpec