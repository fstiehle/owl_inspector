% From: http://www.pathwayslms.com/swipltuts/clpfd/clpfd.html
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

solve1(L) :- sendmore(L), labeling([], L).
solve2(L) :- sendmore(L), labeling([min, down], L).