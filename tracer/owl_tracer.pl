:- encoding(utf8).

:- module(owl_tracer, [
  '📌'/1,
  '📌'/2,
  owl_trace/1,
  owl_trace/2,
  owl_send/0,
  owl_clean/0,
  owl_gen_names/2,
  owl_gen_names/3,
  owl_names_from_term/2,
  owl_names_from_term/3
]).

:- use_module(library(clpfd)).
:- use_module(library(error)).
:- use_module(library(when)).
:- ensure_loaded([owl_json]).
:- ensure_loaded([owl_server]).

:- dynamic
  tracepoint_goal/5,
  tracepoint/4,
  variables/1.

/* ------------------ 
 * Public predicates
 --------------------*/
'📌'(Goal) :- owl_trace(Goal).
'📌'(Vars, Names) :- owl_trace(Vars, Names).

%% owl_trace(+Goal)
% Trace state after the given goal is executed
owl_trace(Goal) :- trace_goal(Goal).

%% owl_trace(+Vars, +Names)
% Trace given variables when they become ground
owl_trace(Vars, Names) :-
  \+ground(Vars),
  is_list(Names),
  trace_vars(Vars, Names).

%% obtain_file(-Bag)
owl_file(Bag) :-
  bagof(Json, to_json(Json), Bag).

owl_send :-
  talk.

owl_clean :-
  retractall(variables(_)),
  retractall(tracepoint_goal(_,_,_,_,_)),
  retractall(tracepoint(_,_,_,_)).

owl_names_from_term(Term, Result, Postfix) :-
  term_variables(Term, Vars),
  length(Vars, L),
  abc_names(L, Result, Postfix).

owl_gen_names(Number, Result, Postfix) :-
  I is ceiling(Number / 26),
  findnsols(I, R, gen_names(Postfix, R), List), !,
  append(List, List2),
  take(Number, List2, Result).

owl_names_from_term(Term, Result) :-
  abc_names_from_term(Term, Result, _).

owl_gen_names(Number, Result) :-
  abc_names(Number, Result, _).

/* ------------------ 
 * Private predicates
 * Trace Goal
 --------------------*/
trace_goal(Goal) :-
  term_variables(Goal, Vars),
  goal_name(Goal, GoalName),
  var_names(Vars, Names), % obacht!
  call(Goal),
  maplist(trace_var, Vars, Doms, Sizes),
  assertz(tracepoint_goal(
    GoalName, Names, Vars, Doms, Sizes)).

%% goal_name(+Goal, -Name)
goal_name(Goal, Name) :-   
  compound_name_arity(Goal, N, _),
  term_string(N, Name).

/* ------------------ 
 * Trace Vars
 --------------------*/
trace_vars(Goal, Names) :-
  term_variables(Goal, Vars),
  var_names(Vars, Names),  
  maplist(trace_ground(Vars, Names), Vars).

% trace_ground(+AllVars, +AllNames, +Var)
trace_ground(AllVars, AllNames, Var) :-
  when(ground(Var), trace_ground(AllVars, AllNames)).
  
% trace_ground(+AllVars, +AllNames)
trace_ground(Vars, Names) :-
  maplist(trace_var, Vars, Doms, Sizes),
  assertz(tracepoint_labeling(
    Names, Vars, Doms, Sizes)).

%% trace_var(+Var, -Dom, -Size)
trace_var(Var, Dom, Size) :-
  fd_size(Var, Size),  
  fd_dom(Var, Dom).

/* ------------------ 
 * Retrieve or assign names
 --------------------*/
var_names(Vars, Names) :- !,
  ( nonvar(Names) -> assert_names(Vars, Names)
  ; get_names(Vars, Names)
  ).

assert_names(Vars, Names) :-
  length(Vars, L1), length(Names, L2),
  ( L1 = L2 -> true
  ; write("No matching variable names supplied."),
    writeln(Vars), writeln(Names), false
  ),
  assertz(variables(Names)),
  maplist(assert_name, Vars, Names).

assert_name(Var, Name) :-
  ( get_attr(Var, owl_tracer, _) ->
    write("Name already applied: "), writeln(Name), false
  ; true
  ),
  put_attr(Var, owl_tracer, Name).

get_names([], []).
get_names([Var|T1], [Name|T2]) :-
  ( integer(Var) -> Name = Var
  ; get_attr(Var, owl_tracer, Name)
  % TODO: Throw error when name not found,
  % Error: variables and names given/not given
  ),
  get_names(T1, T2).

/* ------------------ 
 * Generate names
 --------------------*/
gen_names(Postfix, Result) :-
  length(Result, 26), 
  is_+integer(N),
  ( nonvar(Postfix) -> term_string(N, P),
    string_concat(P, Postfix, P1)
  ; P1 is N
  ),
  generate_abc(P1, Result).

generate_abc(Postfix, Result) :-
  char_code("A", ACode),
  char_code("Z", ZCode),
  atom_codes(Postfix, PCode),
  bagof(C, between(ACode, ZCode, C), Bag),
  maplist(postfix_codes(PCode), Bag, Result).

postfix_codes(Postfix, C, String) :-    
  append([[C], Postfix], List),
  atom_codes(String, List).

take(N, List, Result) :- 
  findnsols(N, Ele, member(Ele, List), Result), !.

is_+integer(1).
is_+integer(N) :- is_+integer(X), N is X + 1.

attr_unify_hook(Name, Var) :-
  ( nonvar(Var) -> true
  ; get_attr(Var, owl_tracer, NewName), NewName==Name
  ).