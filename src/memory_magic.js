/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('memory_magic');
 * mod.thing == 'a thing'; // true
 */

//const creep = require('creep');
module.exports.init_vars = function () {
    if (!Memory.goalpaths) {
        Memory.goalpaths = {};
    }
    
    Memory.creeps_waiting_for_harvest = false;
    for (let creep_key in Game.creeps) {
        let creep = Game.creeps[creep_key];
        if (creep.memory.job == undefined) {
            console.log("Set job key of creep " + creep_key);
            creep.memory.job = "idle";
        } else {
            console.log("Creep " + creep_key + " job is " + creep.memory.job);
        }
    }
};

module.exports.clean_vars = function () {
    
}