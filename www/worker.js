// The worker has its own scope and no direct access to functions/objects of the
// global scope. We import the generated JS file to make `wasm_bindgen`
// available which we need to initialize our WASM code.
importScripts('./pkg/wasm_in_web_worker.js');

//console.log('Initializing worker')

// In the worker, we have a different struct that we want to use as in
// `index.js`.
const { init, step, update } = wasm_bindgen;

async function init_wasm_in_worker() {
  // Load the wasm file by awaiting the Promise returned by `wasm_bindgen`.
  await wasm_bindgen('./pkg/wasm_in_web_worker_bg.wasm');

  // Create a new object of the `NumberEval` struct.
  //const width = 100;
  //const height = 100;
  //const states = Array.from(Array(width * height)).map(() => [0, 0, 0, Math.random() > 0.5 ? 255 : 0]).flat();
  //console.log(`init w=${width} h=${height}`);
  //let game = init(width, height, states);
  //let arr = new Uint8Array(states);
  let game, arr;
  self.onmessage = async (e) => {
    //console.log(e.data);
    switch (e.data.type) {
      case 'resize':
        const states = Array.from(Array(e.data.width * e.data.height)).map(() => [0, 0, 0, Math.random() > 0.92 ?  255 : 0]).flat();
        //console.log(states.length);
        game = init(e.data.width, e.data.height, states);
        console.log(game);
        arr = new Uint8Array(states);
        self.postMessage(arr);
        break;
      case 'step':
        //console.log(arr);
        step(game, arr);
        //console.log(arr);
        self.postMessage(arr);
        break;
      case 'update':
        //console.log(game);
        update(game, e.data.states);
        break;
    }
  };
};

init_wasm_in_worker();
