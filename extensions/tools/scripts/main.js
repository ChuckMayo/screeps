'use strict';

module.exports = function() {
    var timerStart = Game.getUsedCpu();
    var profiler = AI.extensions.scripts.profiler;
    var profileID = "Main";
    profiler.openProfile(profileID);

    AI.extensions.scripts.setup();
    var timerSetup = Game.getUsedCpu();

    if (AI.isFirstTurn()) {
        AI.emit("firstTurn");
    }

    AI.emit("preController");
    var timerPreController = Game.getUsedCpu();

    var creepTimers = AI.extensions.scripts.creeps();
    var timerCreeps = Game.getUsedCpu();

    AI.extensions.scripts.spawners();
    var timerSpawners = Game.getUsedCpu();

    AI.emit("postController");
    var timerEnd = Game.getUsedCpu();

    if (typeof global.run === "function") {
        global.run();
        global.run = undefined;
    }

    if (timerEnd > AI.settings.roundTimeLimit) {
        var message = '';
        message += "🚀 Round " + Game.time + " * ";
        message += AI.getTimeDiff(0, timerEnd).toFixed(2) + " ms used";

        if (Number.isFinite(Game.cpuLimit))
            message += " (" + Math.round(timerEnd / Game.cpuLimit * 100) + "% of " + Game.cpuLimit + " ms available)";

        message += "\n";

        // Set up table data
        var stageMessages = [
            "Main timers",
            "Start",
            "Setup",
            "Pre controller",
            "Creeps",
            "Spawners",
            "Post controller"
        ];

        var stageTimers = [
            "⌛",
            AI.getTimeDiff(0,                  timerStart        ).toFixed(2) + " ms",
            AI.getTimeDiff(timerStart,         timerSetup        ).toFixed(2) + " ms",
            AI.getTimeDiff(timerSetup,         timerPreController).toFixed(2) + " ms",
            AI.getTimeDiff(timerPreController, timerCreeps       ).toFixed(2) + " ms",
            AI.getTimeDiff(timerCreeps,        timerSpawners     ).toFixed(2) + " ms",
            AI.getTimeDiff(timerSpawners,      timerEnd          ).toFixed(2) + " ms"
        ];

        var creepRoleMessages = Object.keys(creepTimers).length > 0 ? ["Creep timers"] : [];
        var creepRoleTime     = Object.keys(creepTimers).length > 0 ? ["⌛"] : [];
        var creepTimeMessages = Object.keys(creepTimers).length > 0 ? [""] : [];
        var tmp;

        for (var i in creepTimers) {
            creepRoleMessages.push(i);
            creepRoleTime.push(AI.getTimeDiff(0, creepTimers[i].totalTime).toFixed(2) + " ms");

            // Format: <number of creeps> - <creepTimer1> - <creepTimer2> - etc...
            tmp = Object.keys(creepTimers[i].timers).length;
            for (var creep in creepTimers[i].timers) {
                var creepDisplayName = creep.substr(creep.indexOf(" ") + 1); // Hides role name
                tmp += " - " + creepDisplayName + " " + creepTimers[i].timers[creep].toFixed(2) + " ms";
            }
            creepTimeMessages.push(tmp);
        }

        var displayData = [
            stageTimers,
            stageMessages,
            creepRoleTime,
            creepRoleMessages,
            creepTimeMessages
        ];

        message += AI.alignColumns(displayData, {glue: " ", align: ["right", "left", "right", "left", "left"]});
        message += "Time to print debug message: " + AI.getTimeDiff(timerEnd, Game.getUsedCpu()).toFixed(2) + " ms";

        console.log(message);
    } else if (AI.dontRepeat("Fast round!") === true) {
        console.log("Round " + Game.time + " went fast! (¯`•¸•´¯)");
    }

    profiler.closeProfile(profileID);
};
