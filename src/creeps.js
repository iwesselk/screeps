/*
 * Handles particular creep jobs
 */
const enums = require("enums");

function number_of_creeps(room_name) {
    return creeps_for_room(room_name).length;
}

function creeps_for_room(room_name) {
    return Game.rooms[room_name].find(FIND_MY_CREEPS);
}

function get_creeps_by_job(room_name, job_type) {
    let creeps_in_room = creeps.creeps_for_room(room_name)
    let creeps_in_job = []
    for (let creep_number in creeps_in_room) {
        let creep = creeps_in_room[creep_number];
        if (creep.memory.job == job_type) {
            creeps_in_job.push(creep);
        }
    }
    return creeps_in_job;
}

function filter_creeps_for_energy(creep_list) {
    let valid_creeps = creep_list.filter(creep => creep.store[RESOURCE_ENERGY] > 0);
    return valid_creeps;
}

function filter_creeps_for_no_energy(creep_list) {
    let valid_creeps = creep_list.filter(creep => creep.store[RESOURCE_ENERGY] == 0);
    return valid_creeps;
}

function filter_out_creep(creep_list, creep) {
    // ID should theoretically be a faster comparison
    let valid_creeps = creep_list.filter(iter_creep => creep.id != iter_creep.id);
    return valid_creeps;
}

function process_creep(creep) {
    // let current_capacity = creep.store[RESOURCE_ENERGY];
    let target = null;
    switch (creep.memory.job) {
        case enums.JOB_TYPES.HARVEST:
            target = Game.getObjectById(creep.memory.target);
            let result_harvest = creep.harvest(target);
            if (result_harvest == ERR_NOT_IN_RANGE) {
                let result_move = creep.moveTo(target);
                if (result_move != 0 && result_move != -11) {
                    console.log("Result of moving creep " + creep.name + " was non zero " + result_move);
                }
            } else if (result_harvest != 0) {
                console.log("Result of harvest for creep " + creep.name + " was non zero " + result_harvest);
            }

            if (creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()) {
                creep.memory.target = null;
                creep.memory.job = enums.JOB_TYPE.IDLE;
            }
            break;

        case enums.JOB_TYPES.DELIVER_LIMITED:
        case enums.JOB_TYPES.DELIVER:
            target = Game.getObjectById(creep.memory.target);
            let result_transfer = creep.transfer(target, RESOURCE_ENERGY);
            if (result_transfer == ERR_NOT_IN_RANGE) {
                let result_move = creep.moveTo(target);
                if (result_move != 0 && result_move != -11) {
                    console.log("Result of moving creep " + creep.name + " was non zero " + result_move);
                }
            } else if (result_transfer == ERR_FULL) {
                creep.memory.job = enums.JOB_TYPES.IDLE;
                creep.memory.target = null;
            } else if (result_transfer == ERR_INVALID_ARGS) {
                console.log("Bad transfer from " + creep.name + " to " + target);
            } else if (result_transfer != OK) {
                console.log("Result of transfer for creep " + creep.name + " was non zero " + result_transfer);
            }

            if (creep.store[RESOURCE_ENERGY] == 0) {
                creep.memory.target = null;
                creep.memory.job = enums.JOB_TYPES.IDLE;
            }
            break;

        case enums.JOB_TYPES.IDLE:
            console.log("Idle creep " + creep.name);
            break;
        default:
            creep.memory.target = null;
            creep.memory.job = enums.JOB_TYPES.IDLE;
    }
}

module.exports = {number_of_creeps, creeps_for_room, process_creep, 
    get_creeps_by_job, filter_creeps_for_energy, filter_creeps_for_no_energy, filter_out_creep};