# Out Of The Way

CMPM120 - Final Project

## Mechanics
The player can move omnidirectionally, calling **player turn**; has priority when moving into a spot. (e.g: moving into a spot, and a bus taking the same move order will cause the bus to bounce back to position, giving player priority to the spot). The player can also use _gas_, where you will move 2 steps where your last move went. (e.g. moving left from the last turn will cause you to move left again, with 2 steps)

The bus can move only up or down **every 2 player turns**.

The cars move randomly **every turn** with no prediction -- they have a higher chance of staying still than taking a move order.

The chicken will follow the best path to you, taking a move **every 2 player turns**. The chicken is blocked by entities.

The ambulance will warn you for two turns, and will instantly kill any entity within its path. For urgency.

The police will warn you that gas is not allowed -- attempting to use gas will be denied. Police will spawn after 2 turns randomly in a spot.

## Instructions
Move the player to the end of the goal. All external entities are blocking your path.
Additionally, rack points by passing vehicles within one lane, and avoid collisions with other entities.

## Points
- Every move order that you take that does not constitute you a point will deduce a point.
- Passing a car within one lane earns you 1 point.
- Avoiding being caught by the police earns you 5 points.
- Avoiding collisions with other entities earns you 5 points.
- Passing a bus within one lane earns you 10 points.
- Avoiding emergency vehicle runs earns you 20 points.

## Notes
All cars will behave such as a freeway. Examples include:
- Cars will spawn most likely from the right side, indicating that they're incoming from a freeway entrance.
- Emergency vehicles will spawn behind the player.
- Police cars will spawn in a random spot, as if you just saw them on the side of the freeway looking to find their next ticket.
- Cars will move randomly, as if they're driving on the I-680.

Not the Chicken though. He just hates Peter.

## Background
This project was created from Family Guy's Stuck Behind a Bus fake game. It was taken as a spin-off to mimick a partial mechanic from BitLife's prison escape game, with a focus on strategy and unpredictability.
