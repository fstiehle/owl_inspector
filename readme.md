Owl Inspector is a web based visualization software for SWI-Prolog’s CLP(FD) library.

Take a look at the `examples` folder to get a quick overview of what's possible.

## Quickstart
### Install
Prerequisites:  `npm` & `SWI Prolog` both available, for example, via `bower`.
Install via  `npm init`. Run `npm run` or `gulp run` once.

### Hello world
Start the server with `npm run` or `gulp run`. Once this is done once, the server can be started via `gulp webserver`. The GUI can be accessed at: [http://localhost:8080/](http://localhost:8080/)

The `owl_tracer` module exposes a set of annotations that can be used by a CLP program to annotate certain parts of the program and collect data on its execution.

You can use the following predicates to annotate your program. 
- `'📌'/1`
- `'📌'/2`
- `owl_trace/1`
- `owl_trace/2`

```js
:- use_module(library(clpfd)).
:- use_module(tracer/owl_tracer).

sendmore(L):-
  L = [S,E,N,D,M,O,R,Y],
  '📌'(L, ['S','E','N','D','M','O','R','Y']),
  '📌'(L ins 0..9),
  '📌'(S #\= 0),
  '📌'(M #\= 0),
  '📌'(all_different(L)),
  '📌'(1000*S + 100*E + 10*N + D
	  + 1000*M + 100*O + 10*R + E
	  #= 10000*M + 1000*O + 100*N + 10*E + Y).
```

Use `owl_send/0` to start a socket connection and send the trace to the GUI.

```js
?- sendmore(L), labeling([], L), owl_send.
```

## 3D Propagation view
Each bar depicts the state of one variable at a given timestamp
- The height of the bar represents its domain size
- timestamps progress along the x-axis
- variables are arranged along the y-axis

![3D Propagation](https://github.com/fstiehle/owl_inspector/blob/master/docs/propagation.png)

## Tracer
Access the tracer's docs in `docs/owl_tracer.html`

## Hosting the GUI yourself
All the necessary files of the GUI are contained in the `gui/dist` folder once `npm run` or `gulp run`  or `gulp build` is executed. This represents a static web page and can be hosted on every server. The socket address in `tracer/owl_server` as well as in `gui/src/renderer/components/Layout.jsx` need to be adopted.
