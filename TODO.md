### Naive client (single player) prototype
- [x] item cohesion on movement
- [x] item pickup
- [x] DOM ui health
- [x] attack animation + logic for sword
- [x] Hit + enemy/player logic
---------- AFTER ADDED MULTIPLAYER -------
- [x] ranged weapon - single player branch
- [x] projectile logic + ammo implementation single player branch

- [x]ranged weapon - sync
- [x] projectile logic + ammo implementation sync

- [ ] weapon switch single player branch
- [ ] weapon switch sync

### WebSockets 
- [x] Figure out what should be send per tick, decide on data frame
- [ ] server game loop naive implementation (no latency ammortizatiom) 
- [x] did rebroadcast for this iteration of ^^^^ 
- [x] rooms base

### STAGES
<!-- NO POINT IN IMPLEMENTAITO UNTIL OK NETWORK -->
- [x] load screen
- [ ] connect / make room / current room id
- [ ] wait + ready check
- [ ] replay 