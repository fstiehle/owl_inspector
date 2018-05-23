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
  json_variables(names:list(string)),
  json_tracepoint_constraint(
    id:string,
    names:list(string),
    values:list(string),
    domains:list(string),
    domainSizes:list(integer)
  ),
  json_tracepoint_labeling(names:list(string),
    values:list(string),
    domains:list(string),
    domainSizes:list(integer)
  ).  

% JSON conversion
to_json(Json) :-
  variables(Names),
  prolog_to_json(json_variables(Names), Json).

to_json(Json) :-
  tracepoint_constraint(Id,Names,Values,Domains,Sizes),
  maplist(term_string, Domains, DomainsString),
  maplist(term_string, Values, ValuesString),
  prolog_to_json(
    json_tracepoint_constraint(Id,Names,ValuesString,DomainsString,Sizes),Json).

to_json(Json) :-
  tracepoint_labeling(Names,Values,Domains,Sizes),
  maplist(term_string, Domains, DomainsString),
  maplist(term_string, Values, ValuesString),
  prolog_to_json(
    json_tracepoint_labeling(Names,ValuesString,DomainsString,Sizes),Json).

obtain_file(Bag) :-
  bagof(Json, to_json(Json), Bag).

% tracepoint(Name, Value, Domain)
% to_trace(ID, Name)
% constraint(ID, Names)
:- dynamic
  tracepoint_constraint/5,
  tracepoint_labeling/4,
  constraint/2,
  variables/1.

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
  term_variables(Goal, Vars),
  var_names(Vars, Names), !,
  call(Goal),
  assert_constraint(Goal, Names, ConstraintID),
  maplist(trace_var, Vars, Doms, Sizes),
  assertz(tracepoint_constraint(
    ConstraintID, Names, Vars, Doms, Sizes)).

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

attr_unify_hook(Name, Var) :-
  ( nonvar(Var) -> true
  ; get_attr(Var, owl_tracer, NewName), NewName==Name
  ).

var_names(Vars, Names) :-
  ( nonvar(Names) -> assert_names(Vars, Names)
  ; get_names(Vars, Names)
  ).

assert_names(Vars, Names) :-
  assertz(variables(Names)),
  maplist(assert_name, Vars, Names).

assert_name(Var, Name) :-
  put_attr(Var, owl_tracer, Name).

get_names([], []).
get_names([Var|T1], [Name|T2]) :-
  ( integer(Var) -> Name = Var
  ; get_attr(Var, owl_tracer, Name)
  % TODO: Throw error when name not found
  ),
  get_names(T1, T2).

trace_labeling(Goal, Names) :-
  term_variables(Goal, Vars),
  var_names(Vars, Names),
  maplist(trace_labeling(Vars, Names), Vars), !,
  call(Goal).

trace_labeling(AllVars, AllNames, Var) :-
  when(ground(Var), assertz_labeling(AllVars, AllNames)).
  
% assert tracepoint
assertz_labeling(AllVars, AllNames) :-
  maplist(assertz_labeling, AllVars, Doms, Sizes),
  assertz(tracepoint_labeling(AllNames, AllVars, Doms, Sizes)).

assertz_labeling(Var, Dom, Size) :-
  fd_dom(Var, Dom),
  fd_size(Var, Size).

% TODO: fd_var, ground, etc,
% Print when not fd_dom but grounded variable

% Clean database
clean_database :-
  retractall(variables(_)),
  retractall(constraint(_,_)),
  retractall(tracepoint_constraint(_,_,_,_,_)),
  retractall(tracepoint_labeling(_,_,_,_)).

% Quick Tests
test_trace_vars() :-
  clean_database,
  '📌'([A,B,C] ins 0..3, ["A", "B", "C"]),
  '📌'(B #> A),
  '📌'(C #> B),
  '📌'(labeling([ffc],[A,B,C])).

test_trace() :-
  clean_database,
  '📌'([A,B] ins 0..1, ["A", "B"]),
  '📌'(A #< B),
  '📌'(labeling([ffc],[A,B])).
