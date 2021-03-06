//const harvester = require('role_harvest');
const memory_magic = require('memory_magic');
const spawn = require('spawn');
const rooms = require('rooms');
const creeps = require('creeps');
const jobs = require('jobs');
const job_builders = require('job_builders');



module.exports.loop = function() {
    console.log("CPU limit " + Game.cpu.limit + " tick limit " +
        Game.cpu.tickLimit + " CPU Bucket " + Game.cpu.bucket);

    memory_magic.init_vars();
    memory_magic.clean_vars();
    job_builders.reset_jobs();
    
    // Temporarily only process one room at a time
    let room_name = "W5N8";
    spawn.do_spawn_stuff(room_name);
    jobs.create_jobs(room_name);
    jobs.process_room_many_loops(room_name);
    let creeps_list = creeps.creeps_for_room(room_name);
    for (let creep_number in creeps_list) {
        creeps.process_creep(creeps_list[creep_number])
    }
    //console.log("CPU at the end of the loop is: " + Game.getUsedCpu());
}