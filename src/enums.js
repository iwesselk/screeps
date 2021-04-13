const JOB_TYPES = {
    HARVEST: "HARVEST",
    ATTACK: "ATTACK", //Unused yet
    BUILD: "BUILD", //Unused Yet
    HEAL: "HEAL", //Unused yet
    DELIVER: "DELIVER",
    DELIVER_LIMITED: "DELIVER_LIMITED",
    IDLE: "IDLE"
}
Object.freeze(JOB_TYPES);

module.exports = {JOB_TYPES};