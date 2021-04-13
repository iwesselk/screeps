/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('memory_magic');
 * mod.thing == 'a thing'; // true
 */

//const creep = require('creep');
const enums = require('enums');

module.exports.init_vars = function () {
    if (!Memory.goalpaths) {
        Memory.goalpaths = {};
    }
    
    Memory.creeps_waiting_for_harvest = false;
    for (let creep_key in Game.creeps) {
        let creep = Game.creeps[creep_key];
        if (creep.memory.job == undefined || (!creep.memory.job in Object.values(enums.JOB_TYPES))) {
            console.log("Set job key of creep " + creep_key);
            creep.memory.job = enums.JOB_TYPES.IDLE;
            creep.memory.target = undefined;
        } else {
            console.log("Creep " + creep_key + " job is " + creep.memory.job);
        }
    }
};

module.exports.clean_vars = function () {
    for (let memory_name in Memory.creeps) {
        // TODO: Switch this to search for graves
        if (Game.creeps[memory_name] == undefined) {
            Memory.creeps[memory_name] = undefined;
        } else {
            if (Memory.creeps[memory_name].job != undefined && Memory.creeps[memory_name].target == undefined) {
                Memory.creeps[memory_name].job = enums.JOB_TYPES.IDLE;
            }
        }
    }
}