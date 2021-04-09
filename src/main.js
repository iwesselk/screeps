const harvester = require('role.harvester');
const memory_magic = require('memory_magic');
const spawn = require('spawn');
const rooms = require('rooms');
const jobs = require('jobs');



module.exports.loop = function() {
    let myspawn = Game.spawns["Spawn1"];
    let spawn_energy = myspawn.energy;
    
    //let newname = spawn.first_available_name('harvester') // + Object.keys(Game.creeps).length.toString();
    //let my_parts_cost = spawn.parts_cost(my_parts_list);
    //let limit_creeps = 30;
    //let num_creeps = spawn.creep_count();
    memory_magic.init_vars();
    memory_magic.clean_vars();

    // Temporarily only process one room at a time
    
    let room_name = "<get_room_name_plz>";
    spawn.do_spawn_stuff(room_name);
    jobs.process_room(room_name);
    let creeps_list = rooms.get_list_of_creep_rooms()[room_name];
    for (let creep_name in creeps_list) {
        creep.process_creep(creep_name)
    }

    //if ((num_creeps < limit_creeps+1) && spawn_energy < parts_cost(my_parts_list) && myspawn.Spawning == null) {
    //    Memory.spawn_needs_energy = true;
    //} else {
    //    Memory.spawn_needs_energy = false;
    //}

    //console.log("Does spawn need energy? " + Memory.spawn_needs_energy)
    //if (!myspawn.Spawning && limit_creeps > num_creeps && spawn_energy >= parts_cost(my_parts_list)) {
    //    console.log("Spawning new creep " + newname);
    //    let result = myspawn.spawnCreep(my_parts_list, newname);
    //    console.log("Result of spawning creep was " + result);
    //}
    //let rooms = {}
    //console.log("You have " + num_creeps + " Creeps");
    //for (let creep_key in Game.creeps) {
        //let creep = Game.creeps[creep_key];
        //if (creep.name.startsWith("harvester")) {
        //    harvester.run(creep);
        //}
        //if (!rooms[creep.room.name]) {
        //    rooms[creep.room.name] = []
        //}
        //rooms[creep.room.name].push(creep_key);
    //}
}