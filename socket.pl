% modules
:- use_module(library(socket)).

% default facts
port(26878).
host(localhost).

talk(StreamPair) :-
    format(StreamPair,
        'PING', []),
    flush_output(StreamPair).

% startup
socket_connection :-
    port(Port),
    host(Host),
    setup_call_cleanup(
        tcp_connect(Host:Port, StreamPair, []),
        talk(StreamPair),
        close(StreamPair)).

:- socket_connection.