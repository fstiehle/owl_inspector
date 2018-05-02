:- encoding(utf8).

:- module(owl_tracer, [ 
  op(900, fx, [#, '📌']),
  (#)/1
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

% Trace Operators
'📌'(Goal) :- #(Goal).
'📌'(Goal, Names) :- #(Goal, Names).
#(Goal) :- #(Goal, Names).

#(Goal, Names) :- 
  nonvar(Goal),
  tracer(Goal, Names).

% Decide what to trace
% Trace labeling
tracer(Goal, Names) :-
  current_predicate(labeling, Goal), !,
  write("Trace labeling..."),
  trace_labeling(Goal, Names).

% Trace Goal
% Only trace constraint predicates?
tracer(Goal, Names) :-
  current_predicate(_, Goal),
  write("Trace Goal..."),
  trace_constraint(Goal, Names).

trace_constraint(Goal, Names) :-
  call(Goal),  
  term_variables(Goal, Vars),
  var_names(Vars, Names),
  assert_constraint(Goal, Names),
  term_string(Goal, ConstraintID),
  maplist(trace_var, Vars, Doms),
  write(Names),
  write(Vars),
  write(Doms).
  % TODO: assert tracepoint

assert_constraint(Goal, Names) :-
  term_string(Goal, ConstraintID),
  ( \+constraint(ConstraintID, _) -> true
  ; permission_error(apply_constraint_to_name, Goal, ConstraintID)
  ),
  assertz(constraint(ConstraintID, Names)).

%trace_domain(CId, Head) :-
%  fd_var(Head),
%  write(Head).

% Associate Var with name and add to database
trace_var(Var, Dom) :-
  write("Trace Var..."),
  fd_dom(Var, Dom).

  % TODO: Could've already been grounded!
%  ( fd_var(Var) -> true 
%  ; type_error(fd_var, Var)
 % ),
  % assert var<->name into database
 % assert_var(ConstraintID, Var, Name).

print_binding(Var, Name) :- 
  format('new binding for ~w: ~w~n', [Name, Var]).

print_binding(_, Name) :-
  format('undo binding for ~w~n', [Name]), !, fail.

var_names(Vars, Names) :-
  ( nonvar(Names) -> assert_names(Vars, Names)
  ; get_names(Vars, Names)
  ).

assert_names(Vars, Names) :-
  maplist(assert_name, Vars, Names).

assert_name(Var, Name) :-
  term_string(Var, VarID),
  ( \+to_trace(VarID, _) -> true
  ; permission_error(apply_var_to_name, Var, VarID)
  ),
  assertz(to_trace(VarID, Name)).

get_names([], []).
get_names([Var|T1], [Name|T2]) :-
  term_string(Var, VarId),
  to_trace(VarId, Name),
  % Throw error when name not found
  get_names(T1, T2).

trace_labeling(Goal, Names) :-
  Goal =.. [Head, Opts, Vars],
  var_names(Vars, Names),
  bagof([Names, Vars, Dom],
    maplist(trace_labeling(Head, Opts), Vars, Names, Dom),
    List),
  write(List).
    
trace_labeling(Head, Opts, Var, Name, Dom) :-
  fd_dom(Var, Dom),
  % assert trace point, reuse trace_var function OR assert entire list?
  %print_binding(Dom, Name),
  call(Head, Opts, [Var]).

% TODO: fd_var, ground, etc,
% Print when not fd_dom but grounded variable

% Quick Tests
test_trace_vars() :-
  [A,B] ins 0..3,
  B #> A,
  '📌'(labeling([],[A,B]), ["A", "B"]).

test_trace_domains() :-
  '📌'([A,B] ins 0..2, ["A", "B"]),
  '📌'(A #< B).