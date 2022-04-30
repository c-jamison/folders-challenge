module.exports = {
  parse(input) {
    const [command, ...params] = input.split(/\s+/);
    return { command, params };
  },
};
