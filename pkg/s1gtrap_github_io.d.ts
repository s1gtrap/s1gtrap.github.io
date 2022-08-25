declare namespace wasm_bindgen {
	/* tslint:disable */
	/* eslint-disable */
	/**
	*/
	export function startup(): void;
	/**
	* @param {HTMLCanvasElement} _c
	*/
	export function run(_c: HTMLCanvasElement): void;
	/**
	* @param {number} w
	* @param {number} h
	* @param {Uint8Array} s
	* @returns {Handle}
	*/
	export function init(w: number, h: number, s: Uint8Array): Handle;
	/**
	* @param {Handle} h
	* @param {Uint8Array} buf
	*/
	export function step(h: Handle, buf: Uint8Array): void;
	/**
	* @param {Handle} h
	* @param {Uint8Array} s
	*/
	export function update(h: Handle, s: Uint8Array): void;
	/**
	*/
	export class Handle {
	  free(): void;
	}
	
}

declare type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

declare interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly startup: () => void;
  readonly run: (a: number) => void;
  readonly __wbg_handle_free: (a: number) => void;
  readonly init: (a: number, b: number, c: number, d: number) => number;
  readonly step: (a: number, b: number, c: number) => void;
  readonly update: (a: number, b: number, c: number) => void;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
  readonly __wbindgen_export_2: WebAssembly.Table;
  readonly _dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h3a5a75e5146273a4: (a: number, b: number) => void;
  readonly __wbindgen_free: (a: number, b: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __wbindgen_start: () => void;
}

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
declare function wasm_bindgen (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
