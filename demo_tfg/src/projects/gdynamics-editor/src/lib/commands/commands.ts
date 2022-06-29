import { chainCommands, exitCode } from 'prosemirror-commands';
import { Fragment } from 'prosemirror-model';
import { Command, EditorState, TextSelection, Transaction } from 'prosemirror-state';
import { findWrapping } from 'prosemirror-transform';

import { boxType } from '../schemas/nodes/box';
import { isInBox, isLastNode } from '../utils/utils';

/**
 * Add a hard break at selection
 */
export const insertHardBreak: Command = (
    chainCommands(exitCode, (state, dispatch) => {
        //@ts-ignore
        dispatch(state.tr.replaceSelectionWith(
            state.schema.nodes.hard_break.create()).scrollIntoView())
        return true
    })
)

/**
 * Check if your are deleting last paragraph node and block it.
 */
//@ts-ignore: Problema con tipos pero debería de hacerlo bien...
export const checkIfDeletingLastParagraph: Command = (
    (
        state: EditorState,
        dispatch: (tr: Transaction) => void,
    ): boolean => {
        let divTypes = ['div', 'box']
        if (isLastNode(state)) {
            let current_node = state.doc.nodeAt(state.selection.$from.pos - 1)
            if (current_node?.type.name! === 'paragraph') {
                console.log('bloqueamos borrado')
                // If one of the commands in chainCommands return True
                // stop execution of the rest
                return true
            }
        }

        return false
    }
)



/**
 * Command which allow you to insertTable with empty cell. Table 2x3
 * 2 rows and 3 colums
 */
export function insertTable() {
    return (
        state: EditorState,
        dispatch: (tr: Transaction) => void
    ): boolean => {
        const offset: number = state.tr.selection.anchor + 1;
        const transaction: Transaction = state.tr;
        //@ts-ignore
        const cell: Node = state.schema.nodes.table_cell.createAndFill();
        //@ts-ignore
        const node: Node = state.schema.nodes.table.create(
            null,
            Fragment.fromArray([
                state.schema.nodes.table_row.create(
                    null,
                    //@ts-ignore
                    Fragment.fromArray([cell, cell, cell])
                ),
                state.schema.nodes.table_row.create(
                    null,
                    //@ts-ignore
                    Fragment.fromArray([cell, cell, cell])
                )
            ])
        );

        if (dispatch) {
            dispatch(
                transaction
                    //@ts-ignore
                    .replaceSelectionWith(node)
                    .scrollIntoView()
                    .setSelection(
                        TextSelection.near(
                            transaction.doc.resolve(offset)
                        )
                    )
            );
        }

        return true;
    };
}


//TODO: pasarlo a Command como arriba
/**
 * Create a BoxNode with one paragraph inside. If Selection, wrap it inside Box
 * @param type boxType
 */
export function insertBoxNode(type: boxType) {
    return (
        state: EditorState,
        dispatch: (tr: Transaction) => void
    ): boolean => {
        let { $from, $to } = state.selection, index = $from.index()
        const { tr } = state;
        // TODO: revisar esto no funciona
        // if (!$from.parent.canReplaceWith(index, index, state.schema.nodes.box))
        //     return false
        //if ($from.parent.canAppend())
        // TODO:
        //@ts-ignore
        const paragraph: Node = state.schema.nodes.paragraph.createAndFill();
        console.log('I need it')
        console.log(paragraph)
        // se puede meter directamente sobre replaceSelection
        let attrs = { type }
        let nodeType = state.schema.nodes.box

        if (isLastNode(state)) {
            // @ts-ignore
            tr.insert(state.doc.content.size, paragraph)
        }

        if ($from === $to) {
            // TODO: poner el cursor en el nuevo parrafo
            tr.replaceSelectionWith(
                //@ts-ignore
                state.schema.nodes.box.create(attrs, paragraph)).scrollIntoView()
        }
        else {
            // Wrap it inside new box node
            let range = $from.blockRange($to),
                wrapping = range && findWrapping(range, nodeType, attrs)
            if (!wrapping) return false

            // @ts-ignore
            tr.wrap(range, wrapping).scrollIntoView()
        }

        if (dispatch) {
            dispatch(tr)
        }
        return true
    };
}

/**
 * Create a new div.subbox inside a box
 */
export const insertSubbox: Command = (
    state: EditorState,
    dispatch: ((tr: Transaction) => void) | undefined
) => {
    if (!isInBox(state)) return false;

    const { tr } = state;

    //@ts-ignore
    const paragraph: Node = state.schema.nodes.paragraph.createAndFill();

    // TODO: poner el cursor en el nuevo parrafo
    tr.replaceSelectionWith(
        //@ts-ignore
        state.schema.nodes.subbox.create({}, paragraph)).scrollIntoView()

    if (dispatch) {
        dispatch(tr)
    }
    return true
}

/**
 * Create a NodeMultiCols with one paragraph inside. If Selection, wrap it inside Box
 * @param number ncols
 */
export function insertNodeMultiCols(ncols: number) {
    return (
        state: EditorState,
        dispatch: (tr: Transaction) => void
    ): boolean => {
        let { $from, $to } = state.selection, index = $from.index()
        const { tr } = state;
        // TODO: revisar esto no funciona
        // if (!$from.parent.canReplaceWith(index, index, state.schema.nodes.box))
        //     return false
        //if ($from.parent.canAppend())
        //@ts-ignore
        const paragraph: Node = state.schema.nodes.paragraph.createAndFill();
        // se puede meter directamente sobre replaceSelection
        let attrs = { ncols }
        let nodeType = state.schema.nodes.node_multi_cols

        if (isLastNode(state)) {
            // @ts-ignore
            tr.insert(state.doc.content.size, paragraph)
        }

        if ($from === $to) {
            // TODO: poner el cursor en el nuevo parrafo
            tr.replaceSelectionWith(
                //@ts-ignore
                state.schema.nodes.node_multi_cols.create(attrs, paragraph)).scrollIntoView()
        }
        else {
            // Wrap it inside new box node
            let range = $from.blockRange($to),
                wrapping = range && findWrapping(range, nodeType, attrs)
            if (!wrapping) return false

            // @ts-ignore
            tr.wrap(range, wrapping).scrollIntoView()
        }

        if (dispatch) {
            dispatch(tr)
        }
        return true
    };
}
