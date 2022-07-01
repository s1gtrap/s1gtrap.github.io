// We only need `startup` here which is the main entry point
// In theory, we could also use all other functions/struct types from Rust which we have bound with
// `#[wasm_bindgen]`
const {startup} = wasm_bindgen;

async function run_wasm() {
    // Load the wasm file by awaiting the Promise returned by `wasm_bindgen`
    // `wasm_bindgen` was imported in `index.html`
    await wasm_bindgen('./pkg/s1gtrap_github_io_bg.wasm');

    //console.log('index.js loaded');

    // Run main WASM entry point
    // This will create a worker from within our Rust code compiled to WASM
    startup();
}

const SCALE = 1;
const FRAME_RATE = 10;

function createCanvas(align) {
  const worker = new Worker('worker.js');

  const main = document.getElementById('main');

  const c = document.createElement('canvas');
  c.style.position = 'fixed';
  c.style.top = 0;
  c.style[align] = 0;
  //c.style['z-index'] = -1;
  c.style['image-rendering'] = 'pixelated';
  c.style.height = '100%';
  c.style.opacity = '50%';
  const ctx = c.getContext('2d');

  let id;
  function resize() {
    //console.log('posting resize');
    c.width = Math.floor(Math.ceil((window.innerWidth - main.offsetWidth) / 2) / SCALE);
    c.height = Math.floor(window.innerHeight / SCALE);
    worker.postMessage({
      type: 'resize',
      width: c.width,
      height: c.height,
    });
    id = new ImageData(c.width, c.height);
  }

  let timer;
  worker.onmessage = (e) => {
    //console.log(e);
    id.data.set(e.data);
    //console.log(id.data, id.data.indexOf(255));
    ctx.putImageData(id, 0, 0);

    clearTimeout(timer);
    timer = setTimeout(render, 100);
  };

  function render() {
    worker.postMessage({ type: 'step' });
  }

  window.addEventListener('resize', resize);

      function spray(arr, e) {
        const r = 19;
        const r2 = (r-1)/2;
        for (let y = 0; y < r; y++) {
          for (let x = 0; x < r; x++) {
            let d = Math.sqrt((x - r2)*(x - r2)+(y - r2)*(y - r2));
            console.log(d);
            arr[(Math.floor((e.offsetY + y - r2) / SCALE) * c.width + Math.floor((e.offsetX + x - r2) / SCALE)) * 4 + 3] = Math.random() * ( 1- d / r2 ) > 0.2 ? 255 : arr[(Math.floor((e.offsetY + y - r2) / SCALE) * c.width + Math.floor((e.offsetX + x - r2) / SCALE)) * 4 + 3];
          }
        }
      }

  let down = false;
  c.addEventListener('mousedown', (e) => {
    e.preventDefault();

    clearTimeout(timer);

    const arr = Array.from(id.data);
    spray(arr, e);
    id.data.set(arr);
    ctx.putImageData(id, 0, 0);
    worker.postMessage({ type: 'update', states: new Uint8Array(arr) });

    down = true;
  });
  c.addEventListener('mouseup', (e) => {
    down = false;
    render();
    //console.log(e);
  });
  c.addEventListener('mousemove', (e) => {
    e.preventDefault();
    if (down) {
      const arr = Array.from(id.data);
      //console.log('arr', arr);
      spray(arr, e);
      id.data.set(arr);
      ctx.putImageData(id, 0, 0);
      worker.postMessage({ type: 'update', states: new Uint8Array(arr) });
    }
  });

  setTimeout((t0) => {
    resize();
    /*setTimeout(() => {
      render();
      requestAnimationFrame(function frame(t) {
        if (t - t0 >= 1000 / FRAME_RATE) {
          render();
          t0 = t;
        }
        requestAnimationFrame(frame);
      });
    }, 100);*/
  }, 100);

  //console.log(c);

  return c;
}

document.body.appendChild(createCanvas('left'));
document.body.appendChild(createCanvas('right'));

run_wasm();
