const STATES = {
  OPEN: "OPEN",
  INVESTIGATING: "INVESTIGATING",
  RESOLVED: "RESOLVED",
  CLOSED: "CLOSED",
};

const transitions = {
  OPEN: ["INVESTIGATING"],
  INVESTIGATING: ["RESOLVED"],
  RESOLVED: ["CLOSED"],
};

function canTransition(current, next) {
  return transitions[current]?.includes(next);
}

module.exports = { STATES, canTransition };
