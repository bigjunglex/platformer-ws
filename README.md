# Study project
## Learning playground to get familiar with 2d HTML5 games with authorative websocket servers

### Progress

#### Current stage: [ SYNC] 
naive webscoket sync of clients without any amortization (1v1 atm), syncs both client states
approx 60 ticks per second, server is a bit of realay, batchy update even on lan and 2 players,
alot of desyncs. After finish will be in [ SYNC ] branch;

### Next stage: [ Lockstep ]
full authorative sever, with blocking lockstep(pausing the game until all clients went forward), without any 
clientside prediction


### (will be) Build with:
- [Kaplay](https://kaplayjs.com/)
- [React](https://react.dev/)
- [Jotai](https://jotai.org/)

### Credits:
 - Assets: [Kenny](https://kenney.nl)