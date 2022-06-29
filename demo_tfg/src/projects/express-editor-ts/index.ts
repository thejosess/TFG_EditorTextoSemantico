//@ts-nocheck
import axios from 'axios';
import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Express, Request, Response } from 'express';
import { Node } from 'prosemirror-model';
import { schema } from 'prosemirror-schema-basic';
import { EditorState, Transaction } from 'prosemirror-state';
import { Step } from 'prosemirror-transform';

import { createCoreSchema } from '../gdynamics-editor/src/lib/schemas/schema';

const app: Express = express();
const port = 3000;

let mySchema = createCoreSchema()

const state = EditorState.create({
    schema,
});

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

var jsonParser = bodyParser.json()
// TODO: hacer un tipo de lo que se envia
app.put('/content', jsonParser, (req, res) => {
    let contentNode = Node.fromJSON(mySchema, req.body.content)

    let state = EditorState.create({
        doc: contentNode,
    });

    let tr: Transaction = state.tr
    console.log()
    //console.log('docuemnto', contentNode)
    console.log()
    req.body.steps.forEach((serializedStep: any) => {
        let step = Step.fromJSON(mySchema, serializedStep)
        // let stepResult = step.apply(contentNode)
        // if (stepResult) {
        //     if (stepResult.failed) {
        //         console.log('Ha fallado el step')
        //     } else {
        //         contentNode = stepResult.doc!
        //     }
        // }
        tr.step(step)
    });
    let newState = state.apply(tr)
    let stateData = newState.toJSON()
    console.log()
    console.log('Documento modificado por los steps')
    console.log()
    // let otroState = EditorState.create({
    //     doc: contentNode,
    // });
    //let stateData = otroState.toJSON()
    let jsonState = {
        doc: {
            content: stateData.doc.content,
            type: stateData.doc.type,
        }
    }
    // // General HTTP function
    // const result = axios({
    //     method: 'put',
    //     url: 'http://localhost:8000/content/62a0d6abc13030cfc2aa9eac/doc',
    //     data:
    // })

    res.jsonp(jsonState);

})
app.use(cors());

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
