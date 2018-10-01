import "jest-extended";

import { MakeOption, MakeCommand } from "../command";
import { Command } from "commander";

test("Should add option to commander", function() {
  const program = new Command();

  MakeOption(program, {
    name: "test",
    desc: "test option"
  });

  MakeOption(program, {
    name: "another",
    desc: ""
  });

  MakeOption(program, {
    name: "all",
    desc: "test option",
    fn: jest.fn()
  });

  const opts = program.opts();

  expect(opts).toContainKey("test");
  expect(opts).toContainKey("another");
  expect(opts).toContainKey("all");
});

test("Should make command", function() {
  const program = new Command();

  const mockFunction = jest.fn();

  MakeCommand(program, {
    name: "test",
    desc: "test",
    alias: "T",
    fn: (..._: any[]) => {
      mockFunction();
    }
  });

  program.parse(["node", "/tmp/name.js", "test"]);
  expect(mockFunction).toHaveBeenCalled();
});

test("Should make command with option", function() {
  const program = new Command();

  const mockFunction = jest.fn();

  MakeCommand(program, {
    name: "hello",
    desc: "hello to world",
    alias: "T",
    options: [
      {
        name: "-A, --all",
        desc: "test option",
        default: false
      }
    ],
    fn: (args: any[]) => {
      let options: { [key: string]: any } = args.filter(v => typeof v === "object")[0];
      mockFunction(options.all);
    }
  });

  program.parse(["node", "/filename.js", "hello", "-A", "param1", "param2"]);

  expect(mockFunction).toHaveBeenCalledWith(true);
});
