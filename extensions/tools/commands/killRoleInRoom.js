'use strict';

function command(flag, parameters) {
    var creepsInRoom = (flag.room)? flag.room.find(FIND_MY_CREEPS) : [];
    for (var c in creepsInRoom) {
        var creep = creepsInRoom[c];
        if (creep.memory.role == parameters[1])
        {
            console.log('killing ' + creep.name);
            creep.memory.copyOnDeath = false;
            creep.suicide();
        }
    }

    flag.remove();
}

module.exports = {
    exec: command,
    command: "killRoleInRoom",
    help: 'Description:\n- Kills all creeps matching the role in this room\n\nUsage:\n- killRoleInRoom <role>',
};
