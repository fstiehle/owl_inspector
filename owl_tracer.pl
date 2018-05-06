:- encoding(utf8).

:- module(owl_tracer, [ 
  op(900, fx, [#, '📌']),
  (#)/1,
  (#)/2,
  '📌'/1,
  '📌'/2,
  tracer/2,
  obtain_file/1
]).

:- use_module(library(clpfd)).
:- use_module(library(error)).
:- use_module(library(when)).
:- use_module(library(http/json_convert)).

:- json_object
  json_tracepoint_constraint(
    id:string,
    names:list(string),
    values:list(integer),
    domains:list(string),
    domainSizes:list(integer)
  ),
  json_tracepoint_labeling(names:list(string),
    values:list(integer),
    domains:list(string),
    domainSizes:list(integer)
  ).

% JSON conversion
to_json(Json) :-
  tracepoint_constraint(Id,Names,Values,Domains,Sizes),
  maplist(term_string, Domains, DomainsString),
  maplist(term_string, Values, ValuesString),
  prolog_to_json(
    json_tracepoint_constraint(Id,Names,ValuesString,DomainsString,Sizes),Json).

to_json(Json) :-
  tracepoint_labeling(Names,Values,Domains,Sizes),
  maplist(term_string, Domains, DomainsString),
  prolog_to_json(
    json_tracepoint_labeling(Names,Values,DomainsString,Sizes),Json).

obtain_file(Bag) :-
  bagof(Json, to_json(Json), Bag).

% tracepoint(Name, Value, Domain)
% to_trace(ID, Name)
% constraint(ID, Names)
:- dynamic
  tracepoint_constraint/5,
  tracepoint_labeling/4,
  to_trace/2,
  constraint/2.

% Trace Operators
'📌'(Goal) :- #(Goal).
'📌'(Goal, Names) :- #(Goal, Names).
#(Goal) :- #(Goal, _).

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
  % After variables are FD variables, ID stays the same.
  term_variables(Goal, Vars),
  ( maplist(fd_var, Vars) -> var_names(Vars, Names), call(Goal)
  ; call(Goal), var_names(Vars, Names)
  ),
  assert_constraint(Goal, Names, ConstraintID),
  maplist(trace_var, Vars, Doms, Sizes),
  assertz(tracepoint_constraint(ConstraintID, Names, Vars, Doms, Sizes)).

assert_constraint(Goal, Names, ConstraintID) :-
  term_string(Goal, ConstraintID),
  ( \+constraint(ConstraintID, _) -> true
  ; permission_error(apply_constraint_to_name, Goal, ConstraintID)
  ),
  assertz(constraint(ConstraintID, Names)).

% Get Domain
trace_var(Var, Dom, Size) :-
  write("Trace Var..."),
  fd_size(Var, Size),  
  fd_dom(Var, Dom).

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
  maplist(trace_labeling(Head, Opts), Vars, Dom, Size),
  assertz(tracepoint_labeling(Names, Vars, Dom, Size)).

trace_labeling(Head, Opts, Var, Dom, Size) :-
  fd_dom(Var, Dom),
  fd_size(Var, Size),
  call(Head, Opts, [Var]).

% TODO: fd_var, ground, etc,
% Print when not fd_dom but grounded variable

% Clean database
clean_database :-
  retractall(to_trace(_,_)),
  retractall(constraint(_,_)),
  retractall(tracepoint_constraint(_,_,_,_,_)),
  retractall(tracepoint_labeling(_,_,_,_)).

% Quick Tests
test_trace_vars() :-
  clean_database,
  '📌'([A,B] ins 0..3, ["A", "B"]),
  '📌'(B #> A),
  '📌'(labeling([],[A,B])).

test_trace_domains() :-
  '📌'([A,B] ins 0..1, ["A", "B"]),
  '📌'(A #< B).

test(JSON) :-
  test_trace_vars,
  tracepoint_labeling(X,Y,Z), prolog_to_json(json_tracepoint_labeling(X, Y, Z), JSON).