:- module(owl_tracer, [trace_vars/2]).

:- use_module(library(clpfd)).
:- use_module(library(error)).
:- use_module(library(when)).

% tracepoint(Name, Value, Domain, PossibleValues)
% to_trace(Id, Name)
:- dynamic
  tracepoint/4,
  to_trace/2.

% Associate Var with name and add to database
trace_vars(Vars, Names) :-
  maplist(trace_var, Vars, Names).

trace_var(Var, Name) :-
  ( fd_var(Var) -> true 
  ; type_error(fd_var, Var)
  ),
  term_string(Var, VarId),
  assert(to_trace(VarId, Name)),
  trace_unification(Var, Name).

trace_unification(Var, Name) :-
  when(ground(Var), print_binding(Var, Name)).

print_binding(Var, Name) :- 
  format('new binding for ~w: ~w~n', [Name, Var]).

print_binding(Var, Name) :-
  format('undo binding for ~w~n', [Name]), !, fail.

var_names([], []).
var_names([Var|T1], [Name|T2]) :-
  term_string(Var, VarId),
  to_trace(VarId, Name),
  var_names(T1, T2).

trace_labeling(Goal) :-
  current_predicate(labeling, Goal),
  Goal =.. [Head, Opts, Vs],
  var_names(Vs, Names),
  maplist(trace_labeling(Head, Opts), Vs, Names).
    
trace_labeling(Head, Opts, Var, Name) :-
  fd_dom(Var, Dom),
  print_binding(Dom, Name),
  call(Head, Opts, [Var]).

% Quick Tests
test_trace_vars() :-
  [A,B,C] ins 0..5,
  trace_vars([A,B,C], ["A", "B","C"]),
  B #> A,
  C #> B,
  trace_labeling(labeling([],[A,B,C])).

test_trace_domains() :-
  [A,B] ins 0..1,
  A #< B.