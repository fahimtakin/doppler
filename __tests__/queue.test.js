import {
  getNextIndex,
  getPreviousIndex,
  nextRepeatMode,
  removeFromQueue,
  shuffleIds,
} from "../utils/queue";

describe("getNextIndex", () => {
  it("advances within the queue", () => {
    expect(getNextIndex(0, 3, "off")).toBe(1);
  });

  it("stops at the end when repeat is off", () => {
    expect(getNextIndex(2, 3, "off")).toBe(-1);
  });

  it("wraps at the end when repeat is all", () => {
    expect(getNextIndex(2, 3, "all")).toBe(0);
  });

  it("stays on the same track for repeat one when a track ends", () => {
    expect(getNextIndex(1, 3, "one")).toBe(1);
  });

  it("lets the user skip forward and wrap even with repeat one/off", () => {
    expect(getNextIndex(1, 3, "one", { fromUser: true })).toBe(2);
    expect(getNextIndex(2, 3, "off", { fromUser: true })).toBe(0);
  });

  it("returns -1 for an empty queue", () => {
    expect(getNextIndex(0, 0, "all")).toBe(-1);
  });
});

describe("getPreviousIndex", () => {
  it("wraps to the last track", () => {
    expect(getPreviousIndex(0, 4)).toBe(3);
    expect(getPreviousIndex(2, 4)).toBe(1);
  });
});

describe("nextRepeatMode", () => {
  it("cycles off -> all -> one -> off", () => {
    expect(nextRepeatMode("off")).toBe("all");
    expect(nextRepeatMode("all")).toBe("one");
    expect(nextRepeatMode("one")).toBe("off");
  });
});

describe("shuffleIds", () => {
  const ids = ["a", "b", "c", "d", "e"];

  it("keeps every id exactly once", () => {
    const out = shuffleIds(ids, "c");
    expect([...out].sort()).toEqual([...ids].sort());
  });

  it("puts the requested song first", () => {
    for (let i = 0; i < 20; i++) expect(shuffleIds(ids, "d")[0]).toBe("d");
  });

  it("does not mutate the input", () => {
    const copy = [...ids];
    shuffleIds(ids, "a");
    expect(ids).toEqual(copy);
  });

  it("is deterministic with an injected random source", () => {
    expect(shuffleIds(ids, null, () => 0)).toEqual(shuffleIds(ids, null, () => 0));
  });
});

describe("removeFromQueue", () => {
  it("keeps pointing at the current song after removing others", () => {
    expect(removeFromQueue(["a", "b", "c"], 2, ["a"])).toEqual({ queue: ["b", "c"], index: 1 });
  });

  it("returns index -1 when the current song is removed", () => {
    expect(removeFromQueue(["a", "b", "c"], 1, ["b"])).toEqual({ queue: ["a", "c"], index: -1 });
  });
});
