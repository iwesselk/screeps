/*
 * All the functions related to managing multiple rooms worth of screeps
 */
const jobs = reqiure("jobs");

function get_room_list() {
    let rooms = []
    for (let room_key in Game.rooms) {
        rooms.push(room_key);
    }
    return rooms;
}

module.exports = {get_room_list};