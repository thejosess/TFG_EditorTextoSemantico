import {
    chainCommands, createParagraphNear, deleteSelection, exitCode, joinBackward, joinForward,
    liftEmptyBlock, newlineInCode, selectAll, selectNodeBackward, selectNodeForward, splitBlock
} from 'prosemirror-commands';
import { Command } from 'prosemirror-state';

import { checkIfDeletingLastParagraph } from '../commands/commands';

// TODO aqui hay que añadir un comando que compruebe que no se borra el ultimo parrafo
let backspace = chainCommands(checkIfDeletingLastParagraph, deleteSelection, joinBackward, selectNodeBackward)
let enter = chainCommands(newlineInCode, createParagraphNear, liftEmptyBlock, splitBlock)
let del = chainCommands(deleteSelection, joinForward, selectNodeForward)

export const baseKeymap: { [key: string]: Command } = {
    "Enter": enter,
    "Mod-Enter": exitCode,
    "Backspace": backspace,
    "Mod-Backspace": backspace,
    "Shift-Backspace": backspace,
    "Delete": del,
    "Mod-Delete": del,
    "Mod-a": selectAll
}
