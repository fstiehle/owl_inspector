test(A,Id-V) :-
  write(A),
  write(Id-V).

trace_vars(Vars) :-
  maplist(test(Vars), Vars).

