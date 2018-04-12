% Vars is a list of Name-Variable pairs where Variable is a free variable
% and Name is an atom or some other identifier for the variable.
:- use_module(library(clpfd)).
:- use_module(library(when)).

trace_vars(Vars) :-
  maplist(trace_var(Vars), Vars).

trace_var(Vars, Id-V) :-
  when(ground(V), print_new_binding(Vars, Id-V)).

print_new_binding(Vars, Id-V) :-
  format('new binding ~w, all bindings now: ~w~n', [Id-V, Vars]).

print_new_binding(_, Id-_) :-
  format('undo binding for ~w~n', [Id]),
  false.

% TODO: automatically trace domain change
trace_domains(Vars) :-
  maplist(trace_domain, Vars).

% TODO: Increment timestamp
trace_domain(Var) :-
  get_attr(Var, clpfd, Attribute),
  Attribute =.. List,
  nth0(4, List, Domain),
  format('current domain for ~w is ~w~n', [Var, Domain]).

% TODO: Name variable via attributes
% (Or instead of a-A, try [a, A] etc.)
test_trace_vars() :-
  Vars = [a-A,b-B,c-C], trace_vars(Vars), [A,B,C] ins 0..8,
  A #< B,
  B #< C, 
  labeling([],[A,B,C]).

test_trace_domains() :-
  [A,B] ins 0..8,
  A #< B,
  trace_domains([A,B]).