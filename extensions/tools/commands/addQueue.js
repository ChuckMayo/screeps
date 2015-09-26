'use strict';

function addQueue(priority, flag, parameters) {
    var roles = AI.extensions.roles;

    if (parameters.length < 2) {
        console.log("Flag command " + parameters[0] + ": addQueue command has not enough parameters");
        if (flag) flag.remove();
        return;
    }

    if (!(parameters[1] in roles)) {
        console.log("Flag command " + parameters[0] + ": can not find role " + parameters[1]);
        if (flag) flag.remove();
        return;
    }

    var queue;
    var queueName;
    if (parameters[2] !== undefined) {
        if (!Game.spawns[parameters[2]]) {
            console.log("Flag command " + parameters[0] + ": can't find spawn " + parameters[2]);
            if (flag) flag.remove();
            return;
        }
        queue = Memory.spawns[parameters[2]];
        queueName = "spawn " + parameters[2];
    } else {
        queue = Memory;
        queueName = "global spawn queue";
    }

    if (undefined === Memory[priority] && parameters[1] in roles) {
        queue[priority] = [parameters[1]];
    } else {
        queue[priority][queue[priority].length] = parameters[1];
    }

    console.log('Flag command ' + parameters[0] + ': added ' + parameters[1] + " to " + priority + " in " + queueName);
    if (flag) flag.remove();
}

function command(flag, parameters) {
    addQueue("spawnQueue", flag, parameters);
}

var native = function(command, priority, parameters) {
    return addQueue(priority, null, parameters);
};


module.exports = {
    exec: command,
    command: "addQueue",
    native: native,
    help: 'Description:\n- Adds an ant to a spawnQueue\n\nUsage:\n- addQueue &lt;role&gt; [spawn]',
    addQueue: addQueue,
};
