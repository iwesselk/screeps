/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('memory_magic');
 * mod.thing == 'a thing'; // true
 */

module.exports.init_vars = function () {
    if (!Memory.goalpaths) {
        Memory.goalpaths = {};
    }
    Memory.creeps_waiting_for_harvest = false;
};

module.exports.clean_vars = function () {
    
}