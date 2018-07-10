% modules
:- use_module(library(http/websocket)).
:- use_module(library(http/thread_httpd)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(http/http_json)).
:- use_module(owl_tracer).

% constants
port(26878).
host(localhost).

:- dynamic
  socket_store/1.

:- http_handler(root(trace), obtain_trace, []).
:- http_handler(root(socket),
  http_upgrade_to_websocket(socket, []),
  [spawn([])]).

start_server :-
  port(Port),
  http_server(http_dispatch, [port(Port)]).

obtain_trace(_Request) :-
  owl_file(JSONOut),
  reply_json(JSONOut).

socket(WebSocket) :-
  assert(socket_store(WebSocket)),
  ws_receive(WebSocket, Message),
  ( Message.opcode == close -> true
  ; owl_file(JSONOut),
    ws_send(WebSocket, json(JSONOut)),
    socket(WebSocket)
  ).

talk :-
  socket_store(WebSocket),
  owl_file(JSONOut),
  ws_send(WebSocket, json(JSONOut)).

%:- start_server.
