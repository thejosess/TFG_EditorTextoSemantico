import { EditorState, Plugin, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

import type { PluginView } from "./view";

// parche: BORRAR
let tablesIcon = ['DeleteTable', 'insertRowBefore', 'insertRowAfter',
    'deleteRow', 'insertColumBefore', 'insertColumAfter', 'deleteColum', 'cellRed']


class MenuView implements PluginView {
    dom: HTMLDivElement;
    protected items: MenuCommandEntry[];
    //protected menuCommands: MenuCommandEntry[];
    protected view: EditorView;
    //protected readonly: boolean;

    static disabledClass = "is-disabled";

    constructor(items: MenuCommandEntry[], view: EditorView) {
        this.items = items
        this.view = view

        this.dom = document.createElement("div")
        this.dom.className = "menubar"
        items.forEach(({ dom }) => this.dom.appendChild(dom))
        this.update()

        this.dom.addEventListener("mousedown", e => {
            e.preventDefault()
            view.focus()
            items.forEach(({ command, dom }) => {
                // @ts-ignore
                if (dom.contains(e.target))
                    command(view.state, view.dispatch, view)
            })
        })
    }


    update() {
        this.items.forEach(({ command, dom }) => {
            let active = command(this.view.state, null!, this.view)
            // Cuando comando es false, no aparece ni el botón
            // console.log('eo que pasa aqui')
            dom.style.display = active ? "" : "none"
        })
    }

    destroy() {
        this.dom.remove();
    }
}

/**
 * Callback function signature for all menu entries
 * @param view The editor view to act on
 * @param suppressDispatch True if the command should *not* be ran on the state; used to determine if the command is valid
 * @returns true if the entry is valid for the current state
 */
export type MenuCommand = (
    state: EditorState,
    dispatch: (tr: Transaction) => void,
    view?: EditorView
) => boolean;

/**
 * Describes a menu entry where command is the command to run when invoked and dom is the visual button itself
 */
export interface MenuCommandEntry {
    active?: (state: EditorState) => boolean;
    visible?: (state: EditorState) => boolean;
    command: MenuCommand;
    dom: HTMLElement;
    //key: string;

    // if this menu entry is a dropdown menu, it will have child items containing the actual commands
    children?: MenuCommandEntry[];
}


/**
 * Creates a menu plugin with the passed in entries
 * @param items The entries to use on the generated menu
 */
export function createMenuPlugin(
    items: MenuCommandEntry[],
): Plugin {
    // remove all empty / falsy items
    const validItems = items.filter((i) => !!i);

    return new Plugin({
        view(editorView) {
            // @ts-ignore
            let menuView = new MenuView(items, editorView)
            // @ts-ignore
            editorView.dom.parentNode.insertBefore(menuView.dom, editorView.dom)
            return menuView
        }
    })
}



/**
 * Helper function to create consistent menu entry doms
 * @param iconName The html of the svg to use as the icon
 * @param title The text to place in the button's title attribute
 * @param key A unique identifier used for identifying the command to be executed on click
 * @param cssClasses extra CSS classes to be applied to this menu icon (optional)
 */
export function makeMenuIcon(
    iconName: string,
    title: string,
    key: string,
    cssClasses?: string[]
): HTMLButtonElement {
    const button = document.createElement("button");
    button.className = `s-editor-btn flex--item js-editor-btn js-${key}`;
    //button.className = key;

    if (cssClasses) {
        button.classList.add(...cssClasses);
    }
    //TODO: delete
    let index = tablesIcon.indexOf(title)

    if (index > -1) {
        button.textContent = title
    }

    //console.log(button)
    button.title = title;
    button.setAttribute("aria-label", title);
    button.dataset.controller = "s-tooltip";
    button.dataset.sTooltipPlacement = "top";
    button.dataset.key = key;
    button.type = "button";

    // create the svg icon-bg element
    const icon = document.createElement("span");
    icon.className = "icon-bg icon" + iconName;

    button.append(icon);

    // console.log('entrando...')
    // console.log(button)

    return button;
}
