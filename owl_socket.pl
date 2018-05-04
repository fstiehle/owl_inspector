:- module(owl_socket, [ 
  open_connection/1,
  talk/2
]).

% modules
:- use_module(library(socket)).
:- use_module(library(http/json)).

% constants
port(26878).
host(localhost).

talk(StreamPair, Message) :-
  json_write(StreamPair, Message),
  flush_output(StreamPair).

% startup
open_connection(StreamPair) :-
  port(Port),
  host(Host),
  tcp_connect(Host:Port, StreamPair, []).

%:- socket_connection.