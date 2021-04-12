/*
 * All the functions related to screep spawning
 */
const creep_limit = 30;
let parts_costs_list = {
    move: 50,
    work: 100,
    carry: 50,
    attack: 80,
    ranged_attack: 150,
    heal: 250,
    claim: 600,
    tough: 10
};
let room_spawn_energy_needs = {}
// Todo: Make room aware
let needs_energy = false;

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

function creep_count() {
    return Object.keys(Game.creeps).length;
}

function has_enough_energy(cost) {
    return Game.spawns["Spawn1"].energy >= cost;
}

function does_need_energy() {
    return needs_energy;
}

function get_spawn_for_room(room_name) {
    return Game.rooms[room_name].find(FIND_MY_SPAWNS)[0];
}
function do_spawn_stuff(room_name) {
    let my_parts_list = [WORK, MOVE, MOVE, CARRY, CARRY];
    let total_cost = parts_cost(my_parts_list);
    let myspawn = get_spawn_for_room(room_name);
    let my_energy = myspawn.energy;
    let newname = first_available_name("harvester");

    if (creep_count() < creep_limit && my_energy >= total_cost) {
        let result = myspawn.spawnCreep(my_parts_list, newname)
        if (result != 0) {
            console.log("Spawn result is " + result + " newname " + newname);
        }
    } else if (my_energy < total_cost) {
        needs_energy = true;
    }
}

module.exports = {does_need_energy, parts_cost, first_available_name, creep_count, has_enough_energy, do_spawn_stuff, get_spawn_for_room};