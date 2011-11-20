HovercraftFactory = require('../../shared/hovercraftfactory').HovercraftFactory;
MissileFactory = require('../../shared/missilefactory').MissileFactory;
MissileFirer = require('../../shared/missilefirer').MissileFirer;
Hovercraft = require('../../shared/hovercraft').Hovercraft;
Identity = require('../identity').Identity;
HovercraftSpawner = require('../../shared/hovercraftspawner').HovercraftSpawner;
ScoreKeeper = require('../../shared/scorekeeper').ScoreKeeper;

exports.ServerGameReceiver = function(app, communication) {
  var self = this;
  var guestCount = 0;
  var missileFirer = new MissileFirer(app, new MissileFactory());
  var spawner = HovercraftSpawner.Create(app.scene);
  var scoreKeeper = ScoreKeeper.Create(app.scene);

  self.removePlayer = function(id) {
    spawner.removePlayer(id);
  };

  self.getSyncForPlayer = function(id) {
    var craft = app.scene.getEntity(id);
	  if(craft)
	    return craft.getSync();
    return null;
  };

  self.getSceneState = function() {
	  var state = {};
	  state.craft = [];
    state.others = [];

    app.scene.forEachEntity(function(entity) {
      if(entity.is(Hovercraft)) {
		    var craftState = {};
		    craftState.id = entity.getId();
		    craftState.sync = entity.getSync();
		    state.craft.push(craftState);
      } else if(entity.getSync) {
        var otherState = {};
        otherState.id = entity.getId();
        otherState.sync = entity.getSync();
        state.others.push(otherState);
      }
    });

	  return state;	
  };
  
  self._ready = function(data) {
    if(data.username) {
      if(!Identity.verifyUsername(data.username, data.sign)) {
        communication.rejectClient(data.source);
        return;
      }
    } else {
      data.username = 'guest-' + guestCount++;
    }; 

    spawner.namePlayer(data.source, data.username);
    spawner.createPlayer(data.source);
	  communication.syncPlayerFull(data.source);
  };

  self._fireRequest = function(data) {
    app.scene.withEntity(data.id, function(entity) {
      entity.tryFireMissile();
    });
  };
};
