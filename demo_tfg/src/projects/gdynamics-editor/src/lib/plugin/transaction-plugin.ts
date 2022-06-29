
import { Plugin, Transaction } from 'prosemirror-state';

import { HttpClient } from '@angular/common/http';

/**
 * Creates a transaction plugin
 * @param http HttpClient to send serialized steps to backend
 */
export function createTransactionPlugin(
    http: HttpClient,
): Plugin {
    return new Plugin({
        state: {
            init() {
                console.log(http)
                return http
            },
            apply(tr, http, newState) {
                if (tr.docChanged) {
                    console.log('Se ha cambiado el doc...')
                    sendSerializedSteps(tr, newState.doc.toJSON(), http)
                    //serializamos los steps de tr y enviamos con http al server
                }
                return http
            }
        }
    })
}