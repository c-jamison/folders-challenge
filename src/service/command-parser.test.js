const ParserService = require("./command-parser.service");

describe("Command Parser", () => {
  test("Should parse input string into command and params", () => {
    const inputs = ["CREATE fruit", "CREATE vegetables fruit"];
    const results = [
      {
        command: "CREATE",
        params: ["fruit"],
      },
      {
        command: "CREATE",
        params: ["vegetables", "fruit"],
      },
    ];

    inputs.forEach((i, index) => {
      expect(ParserService.parse(i)).toEqual(results[index]);
    });
  });
});
