:- use_module(library(clpfd)).
:- use_module(tracer/owl_tracer).

all_diff(A,B,C) :-
  '📌'([A,B,C], ["A","B","C"]),
  '📌'([A,B,C] ins 1..2),
  '📌'(all_different([A,B,C])),
  labeling([],[A,B,C]).

all_dist(A,B,C) :-
  '📌'([A,B,C], ["A","B","C"]),
  '📌'([A,B,C] ins 1..2),
  '📌'(all_distinct([A,B,C])),
  labeling([],[A,B,C]).