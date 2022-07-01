importScripts('./pkg/s1gtrap_github_io.js');

const { init, step, update } = wasm_bindgen;

async function init_wasm_in_worker() {
  await wasm_bindgen('./pkg/s1gtrap_github_io_bg.wasm');

  let game, arr;
  self.onmessage = async (e) => {
    switch (e.data.type) {
      case 'resize':
        const states = Array.from(Array(e.data.width * e.data.height)).map(() => [0, 0, 0, Math.random() > 0.92 ?  255 : 0]).flat();
        game = init(e.data.width, e.data.height, states);
        console.log(game);
        arr = new Uint8Array(states);
        self.postMessage(arr);
        break;
      case 'step':
        step(game, arr);
        self.postMessage(arr);
        break;
      case 'update':
        update(game, e.data.states);
        break;
    }
  };
};

init_wasm_in_worker();
