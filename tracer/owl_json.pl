:- encoding(utf8).
:- use_module(library(http/json_convert)).

:- json_object
  json_variables(names:list(string)),
  json_tracepoint(
    id:string,
    names:list(string),
    values:list(string),
    domains:list(string),
    domainSizes:list(integer)
  ).

to_json(Json) :-
  bagof(Names, variables(Names), Bag),  
  append(Bag, List),
  prolog_to_json(json_variables(List), Json).

to_json(Json) :-
  tracepoint(
    Id, Names, Values, Domains, Sizes),
  maplist(term_string, Domains, DomainsString),
  maplist(term_string, Values, ValuesString),
  prolog_to_json(json_tracepoint(
    Id, Names, ValuesString, DomainsString, Sizes), Json).