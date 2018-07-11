:- use_module(library(clpfd)).
:- use_module(tracer/owl_tracer).

regions(Rs):-
  Rs = [WA,NT,Q,NSW,V,SA,_],
  '📌'(Rs, ["WA","NT","Q","NSW","V","SA","T"]),
  % 0 = red
  % 1 = green
  % 2 = blue
  '📌'(Rs ins 0..2),
  '📌'(WA #\= NT), '📌'(WA #\= SA),
  '📌'(SA #\= NT), '📌'(SA #\= Q), '📌'(SA #\= NSW), '📌'(SA #\= V),
  '📌'(NT #\= Q), 
  '📌'(Q #\= NSW),
  '📌'(NSW #\= V),
  labeling([], Rs).