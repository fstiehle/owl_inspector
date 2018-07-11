% From: http://www.pathwayslms.com/swipltuts/clpfd/clpfd.html
:- use_module(library(clpfd)).
:- use_module(tracer/owl_tracer).

names([amy,bill,charley,deanna,eric,frieda,george,harley]).
% women are 1, men are 0
genders([1,0,0,1,0,1,0,0]).
ages([22,19,73,65,40,38,25,27]).

% maps compatible names
romance(A, B) :-
  names(Names),
  length(Names, NameLength),
  '📌'(AIndex, ["AIndex"]),
  '📌'(AIndex in 1..NameLength),
  '📌'(BIndex, ["BIndex"]),
  '📌'(BIndex in 1..NameLength),
  genders(G),
  element(AIndex, G, AG),
  element(BIndex, G, BG),
  AG #\= BG,
  ages(Ages),
  element(AIndex, Ages, AAge),
  element(BIndex, Ages, BAge),
  '📌'([AAge,BAge], ["AAge","BAge"]),
  '📌'(AAge #< BAge #==> AAge + 10 #>= BAge),
  '📌'(AAge #>= BAge #==> BAge + 10 #>= AAge),
  '📌'(AIndex #< BIndex), % remove unwanted symmetry and reflexiveness
  labeling([], [AIndex, BIndex]),
  nth1(AIndex, Names, A),
  nth1(BIndex, Names, B).