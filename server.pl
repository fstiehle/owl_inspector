% modules
:- use_module(library(http/thread_httpd)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(http/http_json)).
:- use_module(owl_tracer).

% constants
port(26878).
host(localhost).

:- http_handler(root(trace), obtain_trace, []).	

start_server :-	
  port(Port),
  http_server(http_dispatch, [port(Port)]).

obtain_trace(_Request) :-
  obtain_file(JSONOut),
  reply_json(JSONOut).

%:- start_server.