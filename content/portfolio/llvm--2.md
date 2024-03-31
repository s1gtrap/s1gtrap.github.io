+++
title = 'LLVM--2'
weight = 10
+++

[Repo](https://github.com/s1gtrap/llvm--2)

The codebase for my bachelor's project. A spiritual successor to the Tiger compiler written during the compilers course, except this would attempt to allocate registers with the use of graph coloring and linear scan instead of greedily spilling each variable to the stack as we were directed to during the compilers course.

Written in OCaml 4.14 with the help of the [OCamlgraph](https://github.com/backtracking/ocamlgraph) library for control-flow graph to conduct dataflow analysis to derive liveness, as well as interference graphs in the case of graph coloring. The results were mostly measurements of runtime performance and can be seen in [the corresponding report (pp. 25-29)](/article.pdf#page=28).
