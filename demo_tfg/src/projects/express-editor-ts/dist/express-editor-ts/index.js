"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const prosemirror_model_1 = require("prosemirror-model");
const prosemirror_schema_basic_1 = require("prosemirror-schema-basic");
const prosemirror_state_1 = require("prosemirror-state");
const prosemirror_transform_1 = require("prosemirror-transform");
const schema_1 = require("../gdynamics-editor/src/lib/schemas/schema");
const app = (0, express_1.default)();
const port = 3000;
let mySchema = (0, schema_1.createCoreSchema)();
const state = prosemirror_state_1.EditorState.create({
    schema: prosemirror_schema_basic_1.schema,
});
app.get('/', (req, res) => {
    res.send('Express + TypeScript Server');
});
var jsonParser = body_parser_1.default.json();
// TODO: hacer un tipo de lo que se envia
app.put('/content', jsonParser, (req, res) => {
    let contentNode = prosemirror_model_1.Node.fromJSON(mySchema, req.body.content);
    let state = prosemirror_state_1.EditorState.create({
        doc: contentNode,
    });
    let tr = state.tr;
    console.log();
    //console.log('docuemnto', contentNode)
    console.log();
    req.body.steps.forEach((serializedStep) => {
        let step = prosemirror_transform_1.Step.fromJSON(mySchema, serializedStep);
        // let stepResult = step.apply(contentNode)
        // if (stepResult) {
        //     if (stepResult.failed) {
        //         console.log('Ha fallado el step')
        //     } else {
        //         contentNode = stepResult.doc!
        //     }
        // }
        tr.step(step);
    });
    let newState = state.apply(tr);
    let stateData = newState.toJSON();
    console.log();
    console.log('Documento modificado por los steps');
    console.log();
    // let otroState = EditorState.create({
    //     doc: contentNode,
    // });
    //let stateData = otroState.toJSON()
    let jsonState = {
        doc: {
            content: stateData.doc.content,
            type: stateData.doc.type,
        }
    };
    // // General HTTP function
    // const result = axios({
    //     method: 'put',
    //     url: 'http://localhost:8000/content/62a0d6abc13030cfc2aa9eac/doc',
    //     data:
    // })
    res.jsonp(jsonState);
});
app.use((0, cors_1.default)());
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
