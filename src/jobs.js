/*
 * All the functions related to assigning jobs to creeps
 */
//const rooms = require("rooms");
const spawn = require('spawn');
const creep = require('creep');

function get_creeps_by_job(room_name, job_name) {
    let creeps_in_room = creep.creeps_for_room(room_name)
    let creeps_in_job = []
    for (let creep in creeps_in_room) {
        if (creep.memory.job == job_name) {
            creeps_in_job.push(creep);
        }
    }
    return creeps_in_job;
}

function process_room(room_name) {
    let room = Game.rooms[room_name];
    let idle_creeps = get_creeps_by_job(room_name, "idle");
    for (let creep in idle_creeps) {
        console.log("Creep in jobs " + creep.name + " job is " + creep.memory.job);
        if (creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()) {
            if (spawn.does_need_energy()) {
                creep.memory.job = "delivery";
                creep.memory.target = spawn.id;
            } else {
                let room_id = room.controller.id
                creep.memory.job = "delivery";
                creep.memory.target = room_id;
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