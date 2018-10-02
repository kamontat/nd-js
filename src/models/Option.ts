/**
 * COption is the custom option for commander option
 */
export type COption = { name: string; desc: string; fn?: (arg1: any, arg2: any) => void; default?: any };
