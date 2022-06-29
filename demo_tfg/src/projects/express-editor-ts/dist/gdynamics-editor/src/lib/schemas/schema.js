"use strict";
//@ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCoreSchema = void 0;
const prosemirror_model_1 = require("prosemirror-model");
const prosemirror_schema_basic_1 = require("prosemirror-schema-basic");
const prosemirror_schema_list_1 = require("prosemirror-schema-list");
const prosemirror_tables_1 = require("prosemirror-tables");
const content_tag_1 = require("./marks/content-tag");
const tag_1 = require("./marks/tag");
const theme_palette_1 = require("./marks/theme-palette");
const box_1 = require("./nodes/box");
const node_with_cols_1 = require("./nodes/node-with-cols");
/**
 * Create core Schema
 */
function createCoreSchema() {
    var nodes = prosemirror_schema_basic_1.schema.spec.nodes.addBefore('block', 'box', box_1.BoxNodeSpec);
    nodes = nodes.addBefore('block', 'node_multi_cols', node_with_cols_1.NodeMultiColsSpec);
    nodes = nodes.addBefore('block', 'subbox', box_1.SubBoxNodeSpec);
    // @ts-ignore
    //nodes = schema.spec.nodes.addBefore('block', 'tag', TagNodeSpec)
    var marks = prosemirror_schema_basic_1.schema.spec.marks.addBefore('block', 'tag', tag_1.TagMarkSpec);
    marks = marks.addBefore('block', 'palette', theme_palette_1.ThemePaletteMarkSpec);
    marks = marks.addBefore('block', 'content', content_tag_1.ContentTagMarkSpec);
    // @ts-ignore: Soluciona un mal type con el OrdererMap
    nodes = nodes.append((0, prosemirror_tables_1.tableNodes)({
        tableGroup: "block",
        cellContent: "block+",
        cellAttributes: {
            background: {
                default: null,
                // @ts-ignore
                getFromDOM(dom) { return dom.style.backgroundColor || null; },
                setDOMAttr(value, attrs) { if (value)
                    attrs.style = (attrs.style || "") + `background-color: ${value};`; }
            }
        }
    }));
    // we have to say to doc which new type supported
    //nodes.doc.content = "(block | org_property)+"
    //var contentObject = { content: "(block | tag)+" }
    //nodes = nodes.update('doc', contentObject)
    return new prosemirror_model_1.Schema({
        // Mix the nodes from prosemirror-schema-list into the basic schema to
        // create a schema with list support.
        nodes: (0, prosemirror_schema_list_1.addListNodes)(nodes, "paragraph block*", "block"),
        marks: marks
    });
}
exports.createCoreSchema = createCoreSchema;
