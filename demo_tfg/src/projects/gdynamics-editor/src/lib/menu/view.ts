// NOTE: It is important that these are all `type` only imports!
// This keeps code that relies on this file from accidentally introducing cyclical dependencies
// and keeps the actual code out of the bundle if consumers decide to code split/tree-shake
import type { Schema, Node } from "prosemirror-model";
import type { EditorState } from "prosemirror-state";
import type { EditorView } from "prosemirror-view";
// import type { ExternalEditorPlugin } from "./external-editor-plugin";
// import type { ImageUploadOptions } from "./prosemirror-plugins/image-upload";
// import { stackOverflowValidateLink } from "./utils";

export interface PluginView {
    //@ts-ignore
    update?(view: EditorView<Schema>, prevState?: EditorState<Schema>): void;
    destroy?(): void;
}