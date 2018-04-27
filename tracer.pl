:- encoding(utf8).

:- module(owl_tracer, [ 
  trace_vars/2,
  op(900, fx, [#, '📌']),
  (#)/1,
  trace_constraint/1,
  trace_labeling/1
]).

:- use_module(library(clpfd)).
:- use_module(library(error)).
:- use_module(library(when)).

% tracepoint(Name, Value, Domain, PossibleValues)
% to_trace(Id, Name)
:- dynamic
  tracepoint/4,
  to_trace/2,
  constraint/2.

% Trace domain 
'📌'(X) :- #(X).
#(X) :- trace_constraint(X).
trace_constraint(Goal) :-
  % Todo how to check if it is a constraint operator?
  ( current_predicate(_, Goal) -> true 
  ; type_error(predicate_t, Goal)
  ),
  call(Goal),
  term_string(Goal, CId),
  \+constraint(CId, _),
  term_variables(Goal, List),
  maplist(trace_domain(CId), List).

trace_domain(CId, Head) :-
  fd_var(Head),
  write(Head).

% Associate Var with name and add to database
trace_vars(Vars, Names) :-
  maplist(trace_var, Vars, Names).

trace_var(Var, Name) :-
  ( fd_var(Var) -> true 
  ; type_error(fd_var, Var)
  ),
  term_string(Var, VarId),
  \+to_trace(VarId, _),
  assertz(to_trace(VarId, Name)),
  trace_unification(Var, Name).

trace_unification(Var, Name) :-
  when(ground(Var), print_binding(Var, Name)).

print_binding(Var, Name) :- 
  format('new binding for ~w: ~w~n', [Name, Var]).

print_binding(_, Name) :-
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
  bagof([Names, Vs, Dom],
    maplist(trace_labeling(Head, Opts), Vs, Names, Dom),
    List),
  write(List).
    
trace_labeling(Head, Opts, Var, Name, Dom) :-
  fd_dom(Var, Dom),
  print_binding(Dom, Name),
  call(Head, Opts, [Var]).

% Quick Tests
test_trace_vars() :-
  [A,B] ins 0..3,
  trace_vars([A,B], ["A", "B"]),
  B #> A,
  trace_labeling(labeling([],[A,B])).

test_trace_domains() :-
  '📌'([A,B] ins 0..2),
  '📌'(A #< B).