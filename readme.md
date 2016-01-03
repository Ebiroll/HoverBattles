Hoverbattles
------------

The clone of Hooverbattles aims to launch the game as 




This is a toy project I pick up from time to time, socket.io + webgl + a healthy dose of shared server/client code = gaming fun, supposedly. I'm trying to do the quickest thing possible for most part, to get to a playable game with as little fuss as possible, this means spending days on little pieces of technology is a no-no (brute force terrain, lack of octrees etc :-))

To run the server do,

npm install
mkdir cache
node server.js

Currently implemented:
------------

- A basic rendering pipeline (render everything given to it, make sure that globals are settable like camera etc)
- A shader delivery system (packaging up shaders from server into a single json file)
- A brute force terrain, genned from sin/cos and cached on disk (so theoretically could model them in a BMP or whatever)
- A simple hovercraft simulation + interaction with terrain
- The simplest scene graph ever, with the obvious bit of frustum culling
- Entities + components system
- A chase camera with a bit of damping, I'm sure it'll cause motion sickness for people that way inclined
- Some 'intelligence' in the chase camera (trying to look at the current target)
- An eventing system for inter-entity (and internal) communication, used for syncing across network boundaries
- A messaging system for external input into scene in a replicable manner (across client/server boundaries)
- Synchronisation code for keeping client/server in sync with some rubber-banding for good measure
- collision detection between entities (hah, for x in entities, for y in entities...)
- A GPU calculated particle system (without trails, it's a bit hard to see other players)
- An input system for controlling the hovercraft (WASD + Space for jump)
- Targetting + automated firing on entities
- An overlay system for rendering 2D elements + text over the scene
- a HUD for displaying current targets/other players
- A loading screen (using the overlay system)
- Entity destruction sequence, explosions and all that
- Post processing pipeline (currently being used for a tacky neon glow)
- Scoring (entity is destroyed, score is incremented across client/server displays)
- Login/registration/guest-access
- Persistence of events to a datastore (for statistics in the future)

*See the issues list for tasks I'm currently eyeballing*
