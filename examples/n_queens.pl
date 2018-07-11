% From: http://www.swi-prolog.org/pldoc/man?section=clpfd-n-queens
:- use_module(library(clpfd)).
:- use_module(tracer/owl_tracer).

n_queens(N, Qs) :-
  length(Qs, N),
  owl_gen_names(N, Names),
  '📌'(Qs, Names),
  '📌'(Qs ins 1..N),
  safe_queens(Qs),
  labeling([], Qs).

safe_queens([]).
safe_queens([Q|Qs]) :- safe_queens(Qs, Q, 1), safe_queens(Qs).

safe_queens([], _, _).
safe_queens([Q|Qs], Q0, D0) :-
  '📌'(Q0 #\= Q),
  '📌'(abs(Q0 - Q) #\= D0),
  D1 #= D0 + 1,
  safe_queens(Qs, Q0, D1).