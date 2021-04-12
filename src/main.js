const harvester = require('role_harvest');
const memory_magic = require('memory_magic');
const spawn = require('spawn');
const rooms = require('rooms');
const creeps = require('creeps');
const jobs = require('jobs');



module.exports.loop = function() {
    memory_magic.init_vars();
    memory_magic.clean_vars();

    // Temporarily only process one room at a time
    let room_name = "W5N8";
    spawn.do_spawn_stuff(room_name);
    jobs.process_room(room_name);
    let creeps_list = creeps.creeps_for_room(room_name);
    for (let creep_number in creeps_list) {
        creeps.process_creep(creeps_list[creep_number])
    }
}