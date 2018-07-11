:- use_module(tracer/owl_tracer).

main() :-
  owl_clean,
  owl_send.

:- main.