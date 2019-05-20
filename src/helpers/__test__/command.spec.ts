import { Command } from "commander";
import "jest-extended";

import { MakeCommand, MakeOption } from "../command";

test("Should add option to commander", function() {
  const program = new Command();

  MakeOption(program, {
    name: "test",
    desc: "test option",
  });

  MakeOption(program, {
    name: "another",
    desc: "",
  });

  MakeOption(program, {
    name: "all",
    desc: "test option",
    fn: jest.fn(),
  });

  const opts = program.opts();

  expect(opts).toContainKey("test");
  expect(opts).toContainKey("another");
  expect(opts).toContainKey("all");
});

test("Should make command", async function() {
  const program = new Command();
  const mockFunction = jest.fn();

  MakeCommand(program, {
    name: "test <arg>",
    desc: "test",
    alias: "T",
    fn: (args: Array<object>, _) => {
      mockFunction();
      expect(args[0]).toEqual("user1");
    },
  });

  await program.parse(["/usr/local/bin/node", "path/test.js", "test", "user1"]);
  // expect(mockFunction).toHaveBeenCalled(); // TODO: make this runable
});
