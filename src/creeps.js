/*
 * Handles particular creep jobs
 */

function number_of_creeps(room_name) {
    return creeps_for_room(room_name).length;
}

function creeps_for_room(room_name) {
    return Game.rooms[room_name].find(FIND_MY_CREEPS);
}

function process_creeps_in_room(room_name) {
    for (let creep_name in creeps_for_room(room_name)) {
        
    }
}
function process_creep(creep) {
    // let current_capacity = creep.store[RESOURCE_ENERGY];
    let target = null;
    switch (creep.memory.job) {
        case "harvest":
            target = Game.getObjectById(creep.memory.target);
            let result_harvest = creep.harvest(target);
            if (result_harvest == ERR_NOT_IN_RANGE) {
                let result_move = creep.moveTo(target);
                if (result_move != 0) {
                    console.log("Result of moving creep " + creep.name + " was non zero " + result_move);
                }
            }

            if (creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()) {
                creep.memory.target = null;
                creep.memory.job = "idle";
            }
            break;

        case "delivery":
            target = Game.getObjectById(creep.memory.target);
            let result_transfer = creep.transfer(target);
            if (result_transfer == ERR_NOT_IN_RANGE) {
                let result_move = creep.moveTo(target);
                if (result_move != 0) {
                    console.log("Result of moving creep " + creep.name + " was non zero " + result_move);
                }
            }

            if (creep.store[RESOURCE_ENERGY] == 0) {
                creep.memory.target = null;
                creep.memory.job = "idle";
            }
            break;

        case "idle":
            console.log("Idle creep " + creep.name);
            break;
    }
}

module.exports = {number_of_creeps, creeps_for_room, process_creep};