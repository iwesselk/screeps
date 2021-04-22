
const Job = require("job");
const enums = require('enums');

let job_list = [];

function reset_jobs() {
    job_list = [];
}

function register_job(job) {
    job_list.push(job);
}

function get_job_list() {
    return job_list
}

function energy_job(room_name) {
    let room_energy_spots = Game.rooms[room_name].find(FIND_SOURCES);
    for (let i in room_energy_spots) {
        let energy_source = room_energy_spots[i];
        let capacity = energy_source.energy;
        let job = new Job(energy_source.id, enums.JOB_TYPES.HARVEST, 0, 0)
        register_job(job);
    }
}

function room_controller_job(room_name) {
    let resource_controller = Game.rooms[room_name].controller;
    let job = new Job(resource_controller.id, enums.JOB_TYPES.DELIVER, 0, 0);
    register_job(job);
}

let job_builder_list = [energy_job, room_controller_job];

module.exports = {get_job_list, reset_jobs, register_job, job_builder_list}