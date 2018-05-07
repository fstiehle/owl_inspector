:- use_module(library(clpfd)).
:- use_module(owl_tracer).
% ['S','E','N','D','M','O','R','Y']

sendmore(L):-
  L = [S,E,N,D,M,O,R,Y],
  '📌'(L ins 0..9, ['S','E','N','D','M','O','R','Y']),
  '📌'(S #\= 0),
  '📌'(M #\= 0),
  '📌'(all_different(L)),
  '📌'(1000*S + 100*E + 10*N + D
      + 1000*M + 100*O + 10*R + E
      #= 10000*M + 1000*O + 100*N + 10*E + Y),
  '📌'(labeling([], L)).