
class Job {
    // Target is an id, job type is a "JOB_TYPES", amount_of_energy is how much is needed,
    // priority is how bad its needed. Just an int. 10 is spawn
    constructor (target, job_type, amount_of_energy, priority) {
        this.target = target;
        this.job_type = job_type;
        this.amount_of_energy = amount_of_energy;
        this.priority = priority;
        this.complete = false;
    }
}

module.exports = Job;