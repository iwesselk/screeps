/*
 * All the functions related to assigning jobs to creeps
 */
//const rooms = require("rooms");
//const spawn = require('spawn');
const creeps = require('creeps');
const enums = require('enums');

class Job {
    // Target is an id, job type is a "JOB_TYPES", amount_of_energy is how much is needed,
    // priority is how bad its needed. Just an int. 10 is spawn
    constructor (target, job_type, amount_of_energy, priority) {
        this.target = target;
        this.job_type = job_type;
        this.amount_of_energy = amount_of_energy;
        this.priority = priority;
    }
}

let job_list = [];

function reset_jobs() {
    job_list = [];
}

function register_job(job) {
    job_list.push(job);
}

function jobs_list_copy() {
    new_job_list = [];
    for (let i in jobs_list) {
        let job = jobs_list[i];
        new_job_list.push(new Job(job.target, job.job_type, job.amount_of_energy, job.priority));
    }
    return new_job_list;
}

function sort_jobs_function(a, b) {
    if (a.priority == b.priority) {
        return a.job_type == enums.JOB_TYPES.DELIVER_LIMITED && b.job_type == enums.JOB_TYPES.DELIVER
    } else {
        return a.priority > b.priority;
    }
}

function create_jobs(room_name) {
    let room_energy_spots = Game.rooms[room_name].find(FIND_SOURCES);
    for (let i in room_energy_spots) {
        let energy_source = room_energy_spots[i];
        let capacity = energy_source.energy;
        let job = new Job(energy_source.id, enums.JOB_TYPES.HARVEST, 0, 0)
        register_job(job);
    }
    let resource_controller = Game.rooms[room_name].controller;
    let job = new Job(resource_controller.id, enums.JOB_TYPES.DELIVER, 0, 0);
    register_job(job);
    
}

function process_room(room_name) {
    job_list.sort(sort_jobs_function);
    let room = Game.rooms[room_name];
    let idle_creeps = creeps.get_creeps_by_job(room_name, enums.JOB_TYPES.IDLE);
    let creep_list = null;
    for (let i in job_list) {
        job = job_list[i];
        switch (job.job_type) {
            case enums.JOB_TYPES.DELIVER_LIMITED:
                // I want IDLE creeps that have more than 0 energy
                //TODO: Find closest creep to goal
                // roomPosition.findClosestByPath
                creep_list = creeps.filter_creeps_for_energy(idle_creeps);
                for (let c in creep_list) {
                    creep = creep_list[c];
                    job.amount_of_energy -= creep.store[RESOURCE_ENERGY];
                    
                    creep.memory.job = job.job_type;
                    creep.memory.target = job.target;
                    // Job complete!
                    if (job.amount_of_energy <= 0) {
                        break;
                    }
                }
                break;
            case enums.JOB_TYPES.DELIVER:
                creep_list = creeps.filter_creeps_for_energy(idle_creeps);
                for (let c in creep_list) {
                    creep = creep_list[c];

                    creep.memory.job = job.job_type;
                    creep.memory.target = job.target;
                }
                break;
            case enums.JOB_TYPES.HARVEST:
                // I want IDLE creeps that have 0 energy
                //TODO: Find closest creep to goal
                //TODO: This code has potential to over send creeps to one energy source
                // Ignoring the rest.
                creep_list = creeps.filter_creeps_for_no_energy(idle_creeps);
                for (let c in creep_list) {
                    creep = creep_list[c];
                    
                    job.amount_of_energy -= creep.store.getCapacity();
                    creep.memory.job = job.job_type;
                    creep.memory.target = job.target;
                }
                break;

        }
    }
}

function old_process_room(room_name) {
    let room = Game.rooms[room_name];
    let idle_creeps = get_creeps_by_job(room_name, "idle");
    for (let creep_number in idle_creeps) {
        let creep = idle_creeps[creep_number]
        console.log("Creep in jobs " + creep.name + " job is " + creep.memory.job);
        if (creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()) {
            // if (spawn.does_need_energy()) {
            //     console.log("Spawn id " + spawn.get_spawn_for_room(room_name).id);
            //     creep.memory.job = "delivery";
            //     creep.memory.target = spawn.get_spawn_for_room(room_name).id;
            // } else {
                let controller_id = room.controller.id;
                console.log("Controller id " + controller_id);
                creep.memory.job = "delivery";
                creep.memory.target = controller_id;
            // }
        } else {
            let energy_spots = creep.room.find(FIND_SOURCES);
            let nearest_energy = creep.pos.findClosestByPath(energy_spots);
            creep.memory.job = "harvest";
            creep.memory.target = nearest_energy.id;
        }
    }
    
}

module.exports = {create_jobs, process_room, register_job, Job, reset_jobs}