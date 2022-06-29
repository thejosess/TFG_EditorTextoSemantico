// supported color background box
export const colorType = ['primary', 'accent', 'warn']
export type colorType = 'primary' | 'accent' | 'warn'

export type jsonState = {
    content: any;
    type: any;
}
export type pendingSteps = {
    steps: any[];
    doc: jsonState;
};
