import { EditorState, Transaction } from 'prosemirror-state';

import { HttpClient } from '@angular/common/http';

export function isLastNode(state: EditorState): boolean {
    // TODO: Pasar como parametro un nodo en vez de calcular el actual?
    const startPos = state.doc.content.size - state.doc.lastChild!.nodeSize;
    const endPos = state.doc.content.size;
    let current_node = state.doc.nodeAt(state.selection.$from.pos - 1)
    let isLastNode = false

    // Searching if we are in last node
    state.doc.nodesBetween(startPos, endPos, (node, pos) => {
        if (node == current_node) {
            isLastNode = true
            return false; // don't recurse into the node
        }

        return true; // recurse into the node.
    });

    return isLastNode;
}

export function isInBox(state: EditorState): boolean {

    let $head = state.selection.$head;
    // ascendants of a node
    for (let d = $head.depth; d > 0; d--) {
        if ($head.node(d).type == state.schema.nodes.box) return true;
    }
    return false;

}

// TODO: hacer un tipo de lo que se envia
export function sendSerializedSteps(tr: Transaction, jsonState: any, http: HttpClient) {
    let steps: any[] = []
    tr.steps.forEach(step => {
        console.log('step', step)
        let stepJSON = step.toJSON()
        steps.push(stepJSON)
    });
    let body = {
        content: jsonState,
        steps: steps,
    }
    http.put<any>(
        'http://localhost:3000/content',
        body)
        .subscribe({
            next: data => {
                console.log('Send steps...')
            },
            error: error => {
                console.error('There was an error sending steps!', error);
            }
        })
}