import { NodeSpec } from 'prosemirror-model';

export const NodeMultiColsSpec = {
    // BoxNode have one attribute boxType. Default color is square
    // types allow you to define specific style on css
    attrs: { ncols: { default: 2 } },
    //inline: true,
    group: 'block',
    draggable: true,
    // Here "block+" is equivalent to "(paragraph | blockquote)+".
    //content of new node
    content: "block+",
    // These nodes are rendered as div with a `box-type` attribute.
    toDOM: node => ['div',
        {
            ncols: node.attrs.ncols,
            'style': `column-count: ${node.attrs.ncols}`,
            //style: `background-color: #FF0000`,
            class: 'node-multi-cols'
        }, 0],

    parseDOM: [{
        // tags que matchea para parsear, en este caso es un div de class box
        tag: "div.node-multi-cols",
        getAttrs(dom: HTMLElement) {
            let ncols = dom.getAttribute("ncols")
            return { 'ncols': ncols }
        }
    }]

} as NodeSpec