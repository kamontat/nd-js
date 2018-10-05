import "jest-extended";
import { NormalizeNovelName } from "../novel";

type Case = { actual: string; expected: string };

const names: Case[] = [
  {
    actual: "สวัสดีวันจันทร์",
    expected: "สวัสดีวันจันทร์"
  },
  {
    actual: "สวัสดี วันจันทร์",
    expected: "สวัสดี-วันจันทร์"
  },
  {
    actual: "ผสม 2 language",
    expected: "ผสม-2-language"
  },
  {
    actual: "language nothing",
    expected: "language-nothing"
  },
  {
    actual: "นิยายรุ่นใหม่ $%^@#*&",
    expected: "นิยายรุ่นใหม่-_______"
  },
  {
    actual: "(วันนี้ไม่ต้องการอะไร อีกแล้ว)",
    expected: "_วันนี้ไม่ต้องการอะไร-อีกแล้ว_"
  }
];

names.forEach(name => {
  test(`Should normalize ${name.actual} to ${name.expected}`, function() {
    expect(NormalizeNovelName(name.actual)).toEqual(name.expected);
  });
});
