/*
 * All the functions related to assigning jobs to creeps
 */
//const rooms = require("rooms");
//const spawn = require('spawn');
const creeps = require('creeps');
const enums = require('enums');
const job_builders = require('job_builders');
const Job = require("job");

function sort_jobs_function(a, b) {
    if (a.priority == b.priority) {
        if (a.job_type == enums.JOB_TYPES.DELIVER_LIMITED && b.job_type == enums.JOB_TYPES.DELIVER) {
            return -1;
        } else {
            return 1;
        }
    } else {
        if (a.priority > b.priority) {
            return -1;
        } else {
            return 1;
        }
    }
}

function create_jobs(room_name) {
    for (let j in job_builders.job_builder_list) {
        let job_function = job_builders.job_builder_list[j];
        job_function(room_name);
    }
}

function process_room_many_loops(room_name) {
    let job_list = job_builders.get_job_list();
    job_list.sort(sort_jobs_function);
    let room = Game.rooms[room_name];
    let idle_creeps_list = creeps.get_creeps_by_job(room_name, enums.JOB_TYPES.IDLE);

    let filtered_jobs = job_list.filter(x => !x.completed);
    // Needs to be declared for later code... I think
    let creeps_list = null;
    //TODO: At some point allow more settings about how to fill jobs.
    //console.log("jobs & creeps " + filtered_jobs.length + " " + idle_creeps_list.length);
    let stupid = 0
    while (filtered_jobs.length > 0 && idle_creeps_list.length > 0 && stupid < 5) {
        stupid += 1;
        filtered_jobs = job_list.filter(x => !x.completed);
        for (let job_num in filtered_jobs) {
            let job = filtered_jobs[job_num];
            
            switch (job.job_type) {
                case enums.JOB_TYPES.DELIVER_LIMITED:
                    // I want IDLE creeps that have more than 0 energy
                    //TODO: Find closest creep to goal
                    // roomPosition.findClosestByPath
                    creep_list = creeps.filter_creeps_for_energy(idle_creeps_list);
                    console.log("Deliver creeps list " + creep_list);
                    creep = creep_list.pop();
                    console.log("Creep to deliver is " + creep);
                    if (creep == undefined) {
                        break;
                    }
                    idle_creeps_list = idle_creeps_list.filter(x => x.id !== creep.id);

                    job.amount_of_energy -= creep.store[RESOURCE_ENERGY];
                    
                    creep.memory.job = job.job_type;
                    creep.memory.target = job.target;
                    // Job complete!
                    if (job.amount_of_energy <= 0) {
                        job.completed = true;
                    }
                    
                    break;
                case enums.JOB_TYPES.DELIVER:
                    creep_list = creeps.filter_creeps_for_energy(idle_creeps_list);
                    
                    creep = creep_list.pop();
                    if (creep == undefined) {
                        break;
                    }
                    idle_creeps_list = idle_creeps_list.filter(x => x.id != creep.id);

                    creep.memory.job = job.job_type;
                    creep.memory.target = job.target;
                    break;
                case enums.JOB_TYPES.HARVEST:
                    // I want IDLE creeps that have 0 energy
                    //TODO: Find closest creep to goal
                    //TODO: This code has potential to over send creeps to one energy source
                    // Ignoring the rest.
                    creep_list = creeps.filter_creeps_for_no_energy(idle_creeps_list);

                    creep = creep_list.pop();
                    if (creep == undefined) {
                        break;
                    }
                    idle_creeps_list = idle_creeps_list.filter(x => x.id != creep.id);

                    job.amount_of_energy -= creep.store.getCapacity();
                    creep.memory.job = job.job_type;
                    creep.memory.target = job.target;
                    break;
            }
        }
    }

    for (let i in job_list) {
        job = job_list[i];
        if (job.completed != true) {
            console.log("job not completed " + job.target);
        }
    }
}

function process_room_single_loop(room_name) {
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

module.exports = {process_room_single_loop, process_room_single_loop, process_room_many_loops, create_jobs};