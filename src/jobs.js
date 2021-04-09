/*
 * All the functions related to assigning jobs to creeps
 */
//const rooms = require("rooms");
const spawn = require('spawn');
const creeps = require('creeps');

function get_creeps_by_job(room_name, job_name) {
    let creeps_in_room = creeps.creeps_for_room(room_name)
    let creeps_in_job = []
    for (let creep_number in creeps_in_room) {
        let creep = creeps_in_room[creep_number];
        if (creep.memory.job == job_name) {
            creeps_in_job.push(creep);
        }
    }
    return creeps_in_job;
}

function process_room(room_name) {
    let room = Game.rooms[room_name];
    let idle_creeps = get_creeps_by_job(room_name, "idle");
    // TODO: Provide the ability to pull creeps off of spawn.
    let transfer_creeps = get_creeps_by_job(room_name, "transfer");
    for (let creep_number in idle_creeps) {
        let creep = idle_creeps[creep_number]
        console.log("Creep in jobs " + creep.name + " job is " + creep.memory.job);
        if (creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()) {
            if (spawn.does_need_energy()) {
                console.log("Spawn id " + spawn.get_spawn_for_room(room_name).id);
                creep.memory.job = "delivery";
                creep.memory.target = spawn.get_spawn_for_room(room_name).id;
            } else {
                let controller_id = room.controller.id;
                console.log("Controller id " + controller_id);
                creep.memory.job = "delivery";
                creep.memory.target = controller_id;
            }
        } else {
            let energy_spots = creep.room.find(FIND_SOURCES);
            let nearest_energy = creep.pos.findClosestByPath(energy_spots);
            creep.memory.job = "harvest";
            creep.memory.target = nearest_energy.id;
        }
    }
    
}

module.exports = {get_creeps_by_job, process_room}