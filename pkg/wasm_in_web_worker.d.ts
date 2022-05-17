declare namespace wasm_bindgen {
	/* tslint:disable */
	/* eslint-disable */
	/**
	* Run entry point for the main thread.
	*/
	export function startup(): void;
	/**
	* @param {HTMLCanvasElement} c
	*/
	export function run(c: HTMLCanvasElement): void;
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
	/**
	* A number evaluation struct
	*
	* This struct will be the main object which responds to messages passed to the
	* worker. It stores the last number which it was passed to have a state. The
	* statefulness is not is not required in this example but should show how
	* larger, more complex scenarios with statefulness can be set up.
	*/
	export class NumberEval {
	  free(): void;
	/**
	* Create new instance.
	* @returns {NumberEval}
	*/
	  static new(): NumberEval;
	/**
	* Check if a number is even and store it as last processed number.
	*
	* # Arguments
	*
	* * `number` - The number to be checked for being even/odd.
	* @param {number} number
	* @returns {boolean}
	*/
	  is_even(number: number): boolean;
	/**
	* Get last number that was checked - this method is added to work with
	* statefulness.
	* @returns {number}
	*/
	  get_last_number(): number;
	}
	
}

declare type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

declare interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_numbereval_free: (a: number) => void;
  readonly numbereval_new: () => number;
  readonly numbereval_is_even: (a: number, b: number) => number;
  readonly numbereval_get_last_number: (a: number) => number;
  readonly startup: () => void;
  readonly run: (a: number) => void;
  readonly __wbg_handle_free: (a: number) => void;
  readonly init: (a: number, b: number, c: number, d: number) => number;
  readonly step: (a: number, b: number, c: number) => void;
  readonly update: (a: number, b: number, c: number) => void;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
  readonly __wbindgen_export_2: WebAssembly.Table;
  readonly _dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h8c6b2cf7bd0739f9: (a: number, b: number) => void;
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
