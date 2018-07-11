:- use_module(library(clpfd)).
:- use_module(tracer/owl_tracer).

little_clp_programm(V) :-
  V = [V1, V2, V3],
  owl_names_from_term(V, Names),
  '📌'(V, Names),
  '📌'(V ins 0..2),
  '📌'(V1 #< V2),
  '📌'(V2 #< V3).
