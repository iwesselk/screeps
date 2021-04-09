/*
 * All the functions related to screep spawning
 */

let parts_costs_list = {move: 50, work: 100, carry: 50};
let room_spawn_energy_needs = {}

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

function do_spawn_stuff(room_name) {
    let my_parts_list = [WORK, MOVE, MOVE, CARRY, CARRY];
    let total_cost = parts_cost(my_parts_list);
    let my_energy = Game.spawns[room_name];
}

module.exports = {parts_cost, first_available_name, creep_count, has_enough_energy, do_spawn_stuff};