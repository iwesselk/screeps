const harvester = require('role.harvester');
const memory_magic = require('memory_magic');
let parts_costs_list = {move: 50, work: 100, carry: 50};

function parts_cost(parts_list) {
    let cost = 0;
    for (let x of parts_list) {
        let temp = parts_costs_list[x.toString()];
        if (!temp) {
            console.log("Part " + x + " wasn't found");
            cost += 100000000;
        } else {
        cost += temp;
        }
    }
    return cost;
}

function first_available_name(base) {
    let test =  Object.keys(Game.creeps).length
    while (Game.creeps[base + test]) {
        test += 1;
    }
    return base+test;
}

function do_harvester_thing(creep) {

}

module.exports.loop = function() {
    let myspawn = Game.spawns["Spawn1"];
    let spawn_energy = myspawn.energy;
    let my_parts_list = [WORK, MOVE, MOVE, CARRY, CARRY];
    let newname = first_available_name('harvester')// + Object.keys(Game.creeps).length.toString();
    let my_parts_cost = parts_cost(my_parts_list);
    let limit_creeps = 30;
    let num_creeps = Object.keys(Game.creeps).length;
    memory_magic.init_vars();
    memory_magic.clean_vars();
    if ((num_creeps < limit_creeps+1) && spawn_energy < parts_cost(my_parts_list) && myspawn.Spawning == null) {
        Memory.spawn_needs_energy = true;
    } else {
        Memory.spawn_needs_energy = false;
    }
    console.log("Does spawn need energy? " + Memory.spawn_needs_energy)
    if (!myspawn.Spawning && limit_creeps > num_creeps && spawn_energy >= parts_cost(my_parts_list)) {
        console.log("Spawning new creep " + newname);
        let result = myspawn.spawnCreep(my_parts_list, newname);
        console.log("Result of spawning creep was " + result);
    }
    
    console.log("You have " + num_creeps + " Creeps");
    for (let creep_key in Game.creeps) {
        let creep = Game.creeps[creep_key];
        if (creep.name.startsWith("harvester")) {
            harvester.run(creep);
        }
    }
}