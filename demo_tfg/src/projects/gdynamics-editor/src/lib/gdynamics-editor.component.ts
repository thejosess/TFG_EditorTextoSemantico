
import {
    chainCommands, createParagraphNear, exitCode, newlineInCode, setBlockType, toggleMark, wrapIn
} from 'prosemirror-commands';
import { history, redo, undo } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { DOMParser, DOMSerializer, MarkType, Node, Schema } from 'prosemirror-model';
import { schema } from 'prosemirror-schema-basic';
import { addListNodes, wrapInList } from 'prosemirror-schema-list';
import { EditorState, Plugin, Selection, TextSelection, Transaction } from 'prosemirror-state';
import {
    addColumnAfter, addColumnBefore, addRowAfter, addRowBefore, columnResizing, deleteColumn,
    deleteRow, deleteTable, fixTables, goToNextCell, setCellAttr, tableEditing, tableNodes
} from 'prosemirror-tables';
import { Step } from 'prosemirror-transform';
import { EditorView } from 'prosemirror-view';

import { HttpClient } from '@angular/common/http';
import {
    AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild
} from '@angular/core';

import {
    insertBoxNode, insertHardBreak, insertNodeMultiCols, insertSubbox, insertTable
} from './commands/commands';
import { EditorService } from './gdynamics-editor.service';
import { initialDoc } from './json/initialJSON';
import { baseKeymap } from './keymap/basic-keymap';
import { buildKeymap } from './keymap/build-keymap';
import { createMenuPlugin, makeMenuIcon } from './menu/menu';
import { buildInputRules } from './rules/inputsrules';
import { createCoreSchema } from './schemas/schema';
import { jsonState, pendingSteps } from './types/types';

@Component({
  selector: 'gdynamics-editor',
  templateUrl: './gdynamics-editor.component.html',
  styleUrls: [
    './gdynamics-editor.component.scss'
  ]
})
export class EditorComponent implements OnInit, AfterViewInit, OnChanges {
  service: EditorService;
  initialDoc: any;
  //docId: string = '';
  @Input() docId = '';

  constructor(service: EditorService) {
    this.service = service
  }


  ngOnInit(): void {
    //TODO: no funciona lo del input
    this.docId = '62a0d6abc13030cfc2aa9eac'
    console.log('doc_id', this.docId)
    this.service.loadDoc(this.docId).subscribe({
      next: data => {
        this.initialDoc = data
        this.render();
      },
      error: error => {
        console.error('There was an error!', error);
      }
    })
  }



  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes', changes)
    //@ts-ignore
    this.docId = changes.docId
  }


  ngAfterViewInit(): void {
  }

  public saveNewVersion(): void {
    this.service.saveNewVersion(this.docId).subscribe({
      next: data => {
        console.log('Se ha creado una nueva version')
      },
      error: error => {
        console.error('There was an error with new_version eo!', error);
      }
    })
  }


  //async render(): Promise<void> {
  render(): void {
    const mySchema = createCoreSchema()

    const editor = document.querySelector("#editor")
    // const doc = DOMParser.fromSchema(mySchema).parse(document.querySelector("#content2")!)
    // const doc2 = DOMParser.fromSchema(mySchema).parse(document.querySelector("#table")!)
    // const boxDoc = DOMParser.fromSchema(mySchema).parse(document.querySelector("#content")!)

    // @ts-ignore
    // Cuando uso doc3 en vez de parsearlo del HTML, me funciona perfectamente
    // todos los botones que he creado en el menu
    // let doc3 = schema.node("doc", null, [
    //   schema.node("paragraph", null!, [schema.text("One.")]),
    //   schema.node("horizontal_rule"),
    //   schema.node("paragraph", null!, [schema.text("Two!")]),
    //   //mySchema.node("table", null!, [schema.text("Two!")]),
    // ])

    let menuPlugin = createMenuPlugin(
      [
        {
          command: toggleMark(mySchema.marks.strong),
          dom: makeMenuIcon("Bold", "Bold", "bold-btn"),
        },
        {
          command: toggleMark(mySchema.marks.em),
          dom: makeMenuIcon("Italic", "Italic", "italic-btn"),
        },
        {
          command: toggleMark(mySchema.marks.code),
          dom: makeMenuIcon("Code", "Inline code", "code-btn"),
        },
        {
          command: toggleMark(mySchema.marks.tag),
          dom: makeMenuIcon("Tag", "Tag", "tag-btn"),
        },
        {
          command: toggleMark(mySchema.marks.palette),
          dom: makeMenuIcon("Palette", "Palette", "palette-btn"),
        },
        {
          command: toggleMark(mySchema.marks.content),
          dom: makeMenuIcon("Content", "Content", "content-btn"),
        },
        {
          command: wrapIn(mySchema.nodes.blockquote),
          dom: makeMenuIcon("Wrapin", "Wrapin", "wrap-in-btn"),
        },
        {
          command: wrapInList(mySchema.nodes.bullet_list),
          dom: makeMenuIcon("BulletList", "BulletList", "bullet-list-btn"),
        },
        {
          command: wrapInList(mySchema.nodes.ordered_list),
          dom: makeMenuIcon("OrderedList", "OrderedList", "ordered-list-btn"),
        },
        {
          command: deleteTable,
          dom: makeMenuIcon("DeleteTable", "DeleteTable", "delete-table-btn"),
        },
        {
          command: addRowBefore,
          dom: makeMenuIcon("insertRowBefore", "insertRowBefore", "insert-row-before-btn"),
        },
        {
          command: addRowAfter,
          dom: makeMenuIcon("insertRowAfter", "insertRowAfter", "insert-row-after-btn"),
        },
        {
          command: deleteRow,
          dom: makeMenuIcon("deleteRow", "deleteRow", "delete-colum-btn"),
        },
        {
          command: addColumnBefore,
          dom: makeMenuIcon("insertColumBefore", "insertColumBefore", "insert-colum-before-btn"),
        },
        {
          command: addColumnAfter,
          dom: makeMenuIcon("insertColumAfter", "insertColumAfter", "insert-colum-after-btn"),
        },
        {
          command: deleteColumn,
          dom: makeMenuIcon("deleteColum", "deleteColum", "delete-colum-btn"),
        },
        {
          command: setCellAttr("background", "#ff0000"),
          dom: makeMenuIcon("cellRed", "cellRed", "cell-green-btn"),
        },
        {
          command: setCellAttr("background", null),
          dom: makeMenuIcon("notCellRed", "notCellRed", "not-cell-green-btn"),
        },
        {
          command: insertTable(),
          dom: makeMenuIcon("insertTable", "insertTable", "insertTable-btn"),
        },
        {
          command: insertBoxNode('square'),
          dom: makeMenuIcon("insertBox", "insertBox", "insert-box-btn"),
        },
        {
          command: insertSubbox,
          dom: makeMenuIcon("insertSubBox", "insertSubBox", "insert-sub-box-btn"),
        },
        {
          command: insertNodeMultiCols(2),
          dom: makeMenuIcon(
            "insertNodeMultiCols",
            "insertNodeMultiCols",
            "insert-node-multi-cols-btn"),
        },
        {
          command: setBlockType(mySchema.nodes.heading, { level: 1 }),
          dom: makeMenuIcon(
            "heading1",
            "heading1",
            "heading-1-btn"),
        },
        {
          command: setBlockType(mySchema.nodes.heading, { level: 3 }),
          dom: makeMenuIcon(
            "heading2",
            "heading2",
            "heading-2-btn"),
        },
        {
          command: setBlockType(mySchema.nodes.heading, { level: 3 }),
          dom: makeMenuIcon(
            "heading3",
            "heading3",
            "heading-3-btn"),
        },
      ]
    )

    // Plugin to send serialized steps
    //let transactionPlugin = createTransactionPlugin(this.http)

    // let jsonDoc = JSON.parse(initialDoc)
    // let schemaJSON = mySchema.nodeFromJSON(jsonDoc)
    let contentNode = Node.fromJSON(mySchema, this.initialDoc)

    let state = EditorState.create({
      //doc: doc2,
      //doc: boxDoc,
      doc: contentNode,
      plugins: [
        buildInputRules(mySchema),
        history(),
        keymap(buildKeymap(mySchema)),
        keymap(
          {
            "Mod-a": createParagraphNear,
            "Tab": goToNextCell(1),
            "Shift-Tab": goToNextCell(-1),
          }
        ),
        keymap(baseKeymap),
        menuPlugin,
        // Plugin para trabajar con las columnas, mergearlas, etc
        tableEditing(),
        //transactionPlugin,
      ]
    })

    let service = this.service
    let dispatch = function dispatch(tr: Transaction) {
      if (tr.docChanged) {
        //TODO: send serialized steps
        let serializedSteps: any = []
        tr.steps.forEach(step => {
          console.log('step', step)
          console.log('serializamos step')
          serializedSteps.push(step.toJSON())
        });
        let data = tr.before.toJSON()
        let jsonState: jsonState = {
          content: data.content,
          type: data.type,
        }
        // Es el doc sin haber aplicado las tr
        //sendSerializedSteps(tr, jsonState, http)
        console.log('transaction', tr)
        console.log('documento', jsonState)
        let pendingSteps: pendingSteps = {
          // steps: tr.steps,
          steps: serializedSteps,
          doc: jsonState
        }
        let docId = '62a0d6abc13030cfc2aa9eac'
        service.updateSteps(docId, pendingSteps).subscribe({
          next: data => {
            console.log('recibida actualizacion correctamente')
          },
          error: error => {
            console.error('There was an error updating eo!', error);
          }
        })
      }
      let newState = view.state.apply(tr)
      view.updateState(newState)
    }

    // @ts-ignore
    let view = new EditorView(
      editor!,
      {
        state,

        //TODO pasar aqui la actualización del backend
        dispatchTransaction: dispatch
      }
    )
    // Pruebas con Transactions
    // Transaction es una sublcase de Transform sobre un state
    // let tr = state.tr
    // let selection: Selection = TextSelection.create(state.doc, 80, 88)
    // tr.setSelection(selection)
    // tr.insertText("hello") // Replaces selection with 'hello'
    // let newState = state.apply(tr)
    // view.updateState(newState)
    // // Se puede usar así o llamando a view.dispatch

    // tr.steps.forEach(function (value) {
    //   let step_json = value.toJSON()
    //   let step_value = Step.fromJSON(mySchema, step_json)
    // });

    // let stepJson = {
    //   "stepType": "replace",
    //   "from": 80,
    //   "to": 88,
    //   "slice": {
    //     "content": [
    //       {
    //         "type": "text",
    //         "text": "hello"
    //       }
    //     ]
    //   }
    // }

    // console.log(state.toJSON())

    // const response = await fetch('http:localhost:8000/contents/62a0d6abc13030cfc2aa9eac');
    // const data = await response.json();

    // console.log(data);

  }

}
