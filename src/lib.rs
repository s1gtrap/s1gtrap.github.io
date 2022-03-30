use std::cell::RefCell;
use std::rc::Rc;

use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;

use web_sys::{console, HtmlElement, HtmlInputElement, MessageEvent, Worker};

/// A number evaluation struct
///
/// This struct will be the main object which responds to messages passed to the
/// worker. It stores the last number which it was passed to have a state. The
/// statefulness is not is not required in this example but should show how
/// larger, more complex scenarios with statefulness can be set up.
#[wasm_bindgen]
pub struct NumberEval {
    number: i32,
}

#[wasm_bindgen]
impl NumberEval {
    /// Create new instance.
    pub fn new() -> NumberEval {
        NumberEval { number: 0 }
    }

    /// Check if a number is even and store it as last processed number.
    ///
    /// # Arguments
    ///
    /// * `number` - The number to be checked for being even/odd.
    pub fn is_even(&mut self, number: i32) -> bool {
        self.number = number;
        match self.number % 2 {
            0 => true,
            _ => false,
        }
    }

    /// Get last number that was checked - this method is added to work with
    /// statefulness.
    pub fn get_last_number(&self) -> i32 {
        self.number
    }
}

/// Run entry point for the main thread.
#[wasm_bindgen(start)]
pub fn startup() {
    console_error_panic_hook::set_once();

    wasm_logger::init(wasm_logger::Config::default());
}

#[wasm_bindgen]
pub fn run(c: web_sys::HtmlCanvasElement) {
    // Here, we create our worker. In a larger app, multiple callbacks should be
    // able to interact with the code in the worker. Therefore, we wrap it in
    // `Rc<RefCell>` following the interior mutability pattern. Here, it would
    // not be needed but we include the wrapping anyway as example.
    //let worker_handle = Rc::new(RefCell::new(Worker::new("./worker.js").unwrap()));
    let worker_handle = Worker::new("./worker.js").unwrap();
    console::log_1(&"Created a new worker from within WASM".into());

    let obj = js_sys::Object::new();
    js_sys::Reflect::set(&obj, &"type".into(), &"init".into());
    js_sys::Reflect::set(&obj, &"width".into(), &JsValue::from_f64(100.0));
    js_sys::Reflect::set(&obj, &"height".into(), &JsValue::from_f64(100.0));
    worker_handle.post_message(&obj);

    let f = Closure::wrap(Box::new(move || { /* whatever */ }) as Box<dyn FnMut()>);

    worker_handle.add_event_listener_with_callback("message", f.as_ref().unchecked_ref());
    f.forget();
}

/// Create a closure to act on the message returned by the worker
fn get_on_msg_callback() -> Closure<dyn FnMut(MessageEvent)> {
    let callback = Closure::wrap(Box::new(move |event: MessageEvent| {
        console::log_2(&"Received response: ".into(), &event.data().into());

        let result = match event.data().as_bool().unwrap() {
            true => "even",
            false => "odd",
        };

        let document = web_sys::window().unwrap().document().unwrap();
        document
            .get_element_by_id("resultField")
            .expect("#resultField should exist")
            .dyn_ref::<HtmlElement>()
            .expect("#resultField should be a HtmlInputElement")
            .set_inner_text(result);
    }) as Box<dyn FnMut(_)>);

    callback
}

#[wasm_bindgen]
#[derive(Debug)]
pub struct Handle(usize, usize, Vec<u8>);

fn count(w: usize, h: usize, s: &[u8], c: &mut [u8]) {
    for y in 0..h {
        for x in 0..w {
            let v = s[((x as isize - 1).rem_euclid(w as _) as usize
                + (y as isize - 1).rem_euclid(h as _) as usize * w)
                * 4
                + 3] as usize
                + s[(x + (y as isize - 1).rem_euclid(h as _) as usize * w) * 4 + 3] as usize
                + s[((x + 1) % w + (y as isize - 1).rem_euclid(h as _) as usize * w) * 4 + 3]
                    as usize
                + s[((x as isize - 1).rem_euclid(w as _) as usize + y * w) * 4 + 3] as usize
                + s[((x + 1) % w as usize + y * w) * 4 + 3] as usize
                + s[((x as isize - 1).rem_euclid(w as _) as usize + ((y + 1) % h) * w) * 4 + 3]
                    as usize
                + s[(x + ((y + 1) % h) * w) * 4 + 3] as usize
                + s[((x + 1) % w + ((y + 1) % h) * w) * 4 + 3] as usize;
            c[x + y * w] = (v / 255) as u8;
        }
    }
}

#[test]
fn test_counts() {
    let _ = env_logger::builder().is_test(true).try_init();
    fn counts(w: usize, h: usize, s: &[u8]) -> Vec<u8> {
        let mut c = vec![0; w * h];
        count(w, h, s, &mut c);
        c
    }

    assert_eq!(counts(1, 1, &[0, 0, 0, 0]), vec![0]);
    assert_eq!(counts(1, 1, &[0, 0, 0, 255]), vec![8]);
    assert_eq!(
        counts(
            5,
            1,
            &[0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255],
        ),
        vec![8, 8, 8, 8, 8],
    );
    assert_eq!(
        counts(
            3,
            3,
            &[
                0, 0, 0, 0, 0, 0, 0, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 255, 0, 0, 0, 0, 0,
            ],
        ),
        vec![3, 2, 3, 3, 2, 3, 3, 2, 3],
    );
    assert_eq!(
        counts(
            3,
            5,
            &[
                0, 0, 0, 0, 0, 0, 0, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            ],
        ),
        vec![2, 1, 2, 3, 2, 3, 2, 1, 2, 1, 1, 1, 1, 1, 1],
    );
    assert_eq!(
        counts(
            5,
            5,
            &[
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            ],
        ),
        vec![0, 1, 1, 1, 0, 0, 2, 1, 2, 0, 0, 3, 2, 3, 0, 0, 2, 1, 2, 0, 0, 1, 1, 1, 0],
    );
}

#[wasm_bindgen]
pub fn init(w: usize, h: usize, s: &[u8]) -> Handle {
    let mut c = vec![0; (w + 2) * (h + 2)];
    count(w, h, s, &mut c);

    //log::debug!("init {}x{}, states={:?}, counts={:?}", w, h, s, c);
    Handle(w, h, c)
}

pub fn resize(ha: &mut Handle, w: usize, h: usize) {
    ha.0 = w;
    ha.1 = h;
    ha.2.resize((w + 2) * (h + 2), 0);
}

#[wasm_bindgen]
pub fn step(h: &mut Handle, buf: &mut [u8]) {
    //log::debug!("step {}x{}, counts={:?}", h.0, h.1, h.2);
    for i in 0..h.1 {
        for j in 0..h.0 {
            if buf[(j + i * h.0) * 4 + 3] == 255 {
                if h.2[j + i * h.0] < 2 {
                    //log::info!("{},{} dies of lonely", j, i);
                    buf[(j + i * h.0) * 4 + 3] = 0;
                } else if h.2[j + i * h.0] > 3 {
                    //log::info!("{},{} dies of crowding", j, i);
                    buf[(j + i * h.0) * 4 + 3] = 0;
                }
            } else {
                if h.2[j + i * h.0] == 3 {
                    //log::info!("{},{} born bc h.2[{j} + {i} * {}] == 3", j, i, h.0);
                    buf[(j + i * h.0) * 4 + 3] = 255;
                }
            }
        }
    }
    h.2.iter_mut().for_each(|b| *b = 0);
    count(h.0, h.1, buf, &mut h.2);
    /*for i in 0..buf.len() / 4 {
        log::debug!("was {:?}", buf[i * 4 + 3]);
        buf[i * 4 + 3] = !buf[i * 4 + 3];
        log::debug!("is {:?}", buf[i * 4 + 3]);
    }*/
}

#[wasm_bindgen]
pub fn update(h: &mut Handle, s: &[u8]) {
    //log::info!("{:?} {:?}", h, s);
    count(h.0, h.1, s, &mut h.2);
    //log::info!("{:?} {:?}", h, s);
}
