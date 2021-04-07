/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.harvester');
 * mod.thing == 'a thing'; // true
 */

module.exports.run = function(creep) {
    let max_capacity = creep.store.getCapacity();
    let current_capacity = creep.store[RESOURCE_ENERGY];
    let energy_spots = creep.room.find(FIND_SOURCES);
    if ((creep.memory.decided_location && current_capacity == 0) ||  (!creep.memory.decided_location && current_capacity < max_capacity)) {
        //console.log("Creep harvesting " + creep.name);
        if (creep.memory.decided_location) {
            creep.memory.decided_location = undefined;
        }
        let energy_source = creep.pos.findClosestByPath(energy_spots)
        let result = creep.harvest(energy_source);
        if (result == ERR_NOT_IN_RANGE) {
            //console.log("Creep moving " + creep.name);
            let result2 = creep.moveTo(energy_source);
            //console.log("Result of moveto energysource is " + result2);
        } else if (result == ERR_INVALID_TARGET) {
            Memory.creeps_waiting_for_harvest = true;
        }
        //console.log("Result of harvest = " + result1);
    } else {
        //console.log("Creep delivering " + creep.name);
        let storage_location = undefined;
        //if (creep.memory.decided_location) {
        //    storage_location = creep.memory.decided_location;
        //} else 
        if ((creep.memory.decided_location == "spawn" && Memory.spawn_needs_energy) || (!creep.memory.decided_location && !Memory.creeps_waiting_for_harvest && Memory.spawn_needs_energy)) {
            storage_location = Game.spawns["Spawn1"];
            creep.memory.decided_location = "spawn";
        } else if (creep.memory.decided_location == "controller" || !Memory.spawn_needs_energy || Memory.creeps_waiting_for_harvest) {
            storage_location = creep.room.controller;
            creep.memory.decided_location = "controller"
        }
        //let storage_location = Game.spawns["Spawn1"];
        //let storage_location = creep.room.controller
        if (storage_location == undefined) {
            console.log("Crap, undefined storage location " + creep.name);
        }
        console.log("Creep " + creep.name + " Latched to " + creep.memory.decided_location + " Storage location is " + storage_location)
        let result = creep.transfer(storage_location, RESOURCE_ENERGY);
        //console.log("Creep " + creep.name + " got result " + result);
        //console.log("For struct ");
        if(result == ERR_NOT_IN_RANGE) {
            //console.log("Creep moving " + creep.name);
            creep.moveTo(storage_location);
        }
    }
};