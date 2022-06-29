import { NodeSpec } from 'prosemirror-model';

import { colorType } from '../../types/types';

// supported types background box
const boxType = ['green', 'square', 'circle']
export type boxType = 'green' | 'square' | 'circle'



export const BoxNodeSpec = {
    // BoxNode have one attribute type:boxType.
    // Default type is square and color is primary
    // types allow you to define specific style on css
    attrs: {
        type: { default: 'square' },
        title: { default: '' },
        color: { default: 'primary' }
    },
    //inline: true,
    group: 'block',
    draggable: true,
    // Here "block+" is equivalent to "(paragraph | blockquote)+".
    //content of new node
    content: "block+",
    // These nodes are rendered as div with a `box-type` attribute.
    toDOM: node => [
        'div',
        {
            'box-type': node.attrs.type,
            //'style': { 'color': node.attrs.color },
            color: node.attrs.color,
            title: node.attrs.title,
            class: 'box'
        },
        [
            'div',
            {
                // We have to name class otherwise dont create this div
                class: 'subbox'
            },
            0
        ],
    ],

    parseDOM: [{
        // tags que matchea para parsear, en este caso es un div de class box
        tag: "div.box",
        // solo aquellos que el tipo sea válido, dejar esta o con div y box
        //tag: "div[box-type]",
        getAttrs(dom: HTMLElement) {
            let type = dom.getAttribute("box-type")
            let box_type = boxType.indexOf(type!) > -1 ? type : false
            let color = dom.getAttribute("color")
            let box_color = colorType.indexOf(color!) > -1 ? color : false
            let title = dom.getAttribute("title")
            return { 'type': box_type, 'title': title, 'color': box_color }
        }
    }]


} as NodeSpec

export const SubBoxNodeSpec = {
    // SubBoxNode have to be used inside BoxNode
    attrs: {},
    group: 'block',
    draggable: true,
    // Here "block+" is equivalent to "(paragraph | blockquote)+".
    //content of new node
    content: "block+",
    toDOM: node => ['div',
        {
            class: 'subbox'
        }, 0],

    parseDOM: [{
        // tags que matchea para parsear, en este caso es un div de class box
        tag: "div.box",
    }]


} as NodeSpec