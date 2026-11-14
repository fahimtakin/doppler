/**
 * Pure queue helpers. A queue is an array of song ids plus the index of the
 * song currently loaded. Kept free of React so it can be unit tested.
 */

export const REPEAT_MODES = ["off", "all", "one"];

export function nextRepeatMode(mode) {
  const i = REPEAT_MODES.indexOf(mode);
  return REPEAT_MODES[(i + 1) % REPEAT_MODES.length];
}

/** Fisher–Yates shuffle that keeps `firstId` (if given) at the front. */
export function shuffleIds(ids, firstId = null, random = Math.random) {
  const rest = ids.filter((id) => id !== firstId);
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [rest[i], rest[j]] = [rest[j], rest[i]];
  }
  return firstId != null && ids.includes(firstId) ? [firstId, ...rest] : rest;
}

/**
 * Index to move to when the user presses "next", or when a track ends.
 * Returns -1 when playback should stop.
 * `fromUser` lets "next" wrap around even with repeat off, which matches
 * what people expect from a skip button.
 */
export function getNextIndex(index, length, repeat, { fromUser = false } = {}) {
  if (length === 0) return -1;
  if (!fromUser && repeat === "one") return index;
  if (index + 1 < length) return index + 1;
  if (repeat === "all" || fromUser) return 0;
  return -1;
}

export function getPreviousIndex(index, length) {
  if (length === 0) return -1;
  return (index - 1 + length) % length;
}

/** Removes ids from a queue while keeping the current song pointer valid. */
export function removeFromQueue(queue, index, removedIds) {
  const removed = new Set(removedIds);
  const currentId = queue[index];
  const nextQueue = queue.filter((id) => !removed.has(id));
  if (currentId == null || removed.has(currentId)) {
    return { queue: nextQueue, index: -1 };
  }
  return { queue: nextQueue, index: nextQueue.indexOf(currentId) };
}
