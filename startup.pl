main :-
  [owl_tracer],
  [examples/sendmoney],
  [server],
  clean_database,
  sendmore(_),
  start_server.

:- main.