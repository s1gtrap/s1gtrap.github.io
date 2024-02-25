+++
menus = 'main'
title = "Portfolio"
+++

#### `LLVM--2`

[Repo](https://github.com/s1gtrap/llvm--2)

The codebase for my bachelor's project. A spiritual successor to the Tiger compiler written during the compilers course, except this would attempt to allocate registers with the use of graph coloring and linear scan instead of greedily spilling each variable to the stack as we were directed to during the compilers course.

Written in OCaml 4.14 with the help of the [OCamlgraph](https://github.com/backtracking/ocamlgraph) library for control-flow graph to conduct dataflow analysis to derive liveness, as well as interference graphs in the case of graph coloring. The results were mostly measurements of runtime performance and can be seen in [the corresponding report (pp. 25-29)](/article.pdf#page=28).

#### Con^2

[Demo](https://tan.ge/con2) | [Repo (frontend)](https://github.com/s1gtrap/con2) | [Repo (backend)](https://github.com/s1gtrap/con2-api)

A minimum viable product enabling users to share pictures of nearby bus stops on a map for others to enjoy.

The backend consists of TypeScript using the fastify web framework, Postgres for data storage and Amazon S3 for media storage.

The frontend is written with TypeScript and React.

#### Dasha

[Demo](https://tan.ge/dasha-demo) | [Repo](https://github.com/s1gtrap/dasha)

An x86 disassembler written in Rust with a demo targeting WebAssembly mostly intended as a demo/toy project linking assembly code to machine code generated.

Minimal utility in practice but it looks really cool to see specific parts of the machine code corresponding to associated assembly highlighted as you mouse over.

#### Popeye

[Demo](https://tan.ge/popeye-demo) | [Repo](https://github.com/s1gtrap/popeye)

Another demo/toy project intended for optimizing training programs for workout routines using graph colouring.

Written in Rust targeting WebAssembly using the Yew framework with the datasets loosely lifted/borrowed from https://exrx.net.

No real purpose other than demo'ing the use of graph colouring and its application in something other than register allocation.

#### Isthmus

[Demo](https://tan.ge/) | [Repo](https://github.com/s1gtrap/isthmus)

A rushed attempt at a Hugo theme for my own personal website.

Hugo seemed like the go-to for statically generated homepages.

#### Homepage

[Repo](https://github.com/s1gtrap/s1gtrap.github.io)

The site you're on! Built with Hugo, deployed and hosted with GitHub Actions on GitHub Pages.
