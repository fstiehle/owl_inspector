% From: https://github.com/NishanthMuruganandam/PrologPrograms
:- use_module(library(clpfd)).
:- use_module(tracer/owl_tracer).

sudoku(Rows) :-
  owl_names_from_term(Rows, Names),
  append(Rows, Vs),
  '📌'(Vs, Names),
  '📌'(Vs ins 1..9),
  maplist(trace_all_distinct, Rows),
  transpose(Rows, Columns),
  maplist(trace_all_distinct, Columns),  
  Rows = [A,B,C,D,E,F,G,H,I],
  blocks(A, B, C), blocks(D, E, F), blocks(G, H, I).

blocks([], [], []).
blocks([A,B,C|Bs1], [D,E,F|Bs2], [G,H,I|Bs3]) :-
  '📌'(all_different([A,B,C,D,E,F,G,H,I])),
  blocks(Bs1, Bs2, Bs3).

trace_all_distinct(List) :-
  '📌'(all_different(List)).

board(1, [[_,_,_,_,_,_,_,_,_],
          [_,_,_,_,_,3,_,8,5],
          [_,_,1,_,2,_,_,_,_],
          [_,_,_,5,_,7,_,_,_],
          [_,_,4,_,_,_,1,_,_],
          [_,9,_,_,_,_,_,_,_],
          [5,_,_,_,_,_,_,7,3],
          [_,_,2,_,1,_,_,_,_],
          [_,_,_,_,4,_,_,_,9]]).

run:- board(1, T), sudoku(T), write(T).