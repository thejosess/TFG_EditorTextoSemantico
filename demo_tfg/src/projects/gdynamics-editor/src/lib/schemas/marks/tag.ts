import { MarkSpec } from 'prosemirror-model';

// tendría que venir de una consulta a servidor
const tagType = ['OPE', 'DUE', 'TCAE']
export type tagType = 'OPE' | 'DUE' | 'TCAE'



export const TagMarkSpec = {
  attrs: { tagType: { default: 'OPE' }, color: { default: '#FF0000' } },
  // These marks are rendered as div with a `tag-type` attribute.
  toDOM: mark => [
    'span',
    {
      class: 'tag',
      'tag-type': mark.attrs.tagType,
    },
    ['span',
      {
        // TODO: añadirle algo luego en el CSS?
        //'tag-type': mark.attrs.tagType,
        //'style': `background-color: ${mark.attrs.color}`,
        // 'style': `.tag-tag::after {
        //   content:  ${mark.attrs.tagType};
        //   margin: 8px;
        //   background-color: #dee;
        //   padding: 6px;
        //   border: 1px solid #AAA;
        //   border-radius: 5px;
        // }`,
      },
      0],
    ['span',
      {
        class: 'tag-' + mark.attrs.tagType,
      }]
  ],

  parseDOM: [{
    // tags que matchea para parsear, en este caso es un div de class tag
    tag: "span.tag",
    getAttrs(dom: HTMLElement) {
      let type = dom.getAttribute("tag-type")
      let color = dom.getAttribute("color")
      let tag_type = tagType.indexOf(type!) > -1 ? { type } : false
      return { 'tag-type': tag_type, 'style': color }
    }
  }]

} as MarkSpec