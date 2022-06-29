//@ts-nocheck

import { Schema } from 'prosemirror-model';
import { schema } from 'prosemirror-schema-basic';
import { addListNodes } from 'prosemirror-schema-list';
import { tableNodes } from 'prosemirror-tables';

import { ContentTagMarkSpec } from './marks/content-tag';
import { TagMarkSpec } from './marks/tag';
import { ThemePaletteMarkSpec } from './marks/theme-palette';
import { BoxNodeSpec, SubBoxNodeSpec } from './nodes/box';
import { NodeMultiColsSpec } from './nodes/node-with-cols';

/**
 * Create core Schema
 */
export function createCoreSchema(
) {
    var nodes = schema.spec.nodes.addBefore('block', 'box', BoxNodeSpec)
    nodes = nodes.addBefore('block', 'node_multi_cols', NodeMultiColsSpec)
    nodes = nodes.addBefore('block', 'subbox', SubBoxNodeSpec)
    // @ts-ignore
    //nodes = schema.spec.nodes.addBefore('block', 'tag', TagNodeSpec)
    var marks = schema.spec.marks.addBefore('block', 'tag', TagMarkSpec)
    marks = marks.addBefore('block', 'palette', ThemePaletteMarkSpec)
    marks = marks.addBefore('block', 'content', ContentTagMarkSpec)
    // @ts-ignore: Soluciona un mal type con el OrdererMap
    nodes = nodes.append(tableNodes({
        tableGroup: "block",
        cellContent: "block+",
        cellAttributes: {
            background: {
                default: null,
                // @ts-ignore
                getFromDOM(dom) { return dom.style.backgroundColor || null },
                setDOMAttr(value, attrs) { if (value) attrs.style = (attrs.style || "") + `background-color: ${value};` }
            }
        }
    }))
    // we have to say to doc which new type supported
    //nodes.doc.content = "(block | org_property)+"
    //var contentObject = { content: "(block | tag)+" }
    //nodes = nodes.update('doc', contentObject)

    return new Schema({
        // Mix the nodes from prosemirror-schema-list into the basic schema to
        // create a schema with list support.
        nodes: addListNodes(nodes, "paragraph block*", "block"),
        marks: marks
    })

}