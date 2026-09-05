const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const context = { window: {}, Intl, Date };
vm.createContext(context);
for (const file of ['data.js', 'journey.js']) vm.runInContext(fs.readFileSync(path.join(__dirname, '../site/js', file), 'utf8'), context);
const journey = context.window.ECCV_JOURNEY;
const at = text => new Date(text);
assert.equal(journey.focus('09-12', at('2026-09-12T13:30:00Z')).current.item.ticketId, 'stromma-canal-tour');
assert.equal(journey.focus('09-12', at('2026-09-12T13:59:59Z')).current.index, 8);
assert.equal(journey.focus('09-12', at('2026-09-12T14:00:00Z')).current.index, 9);
assert.equal(journey.focus('09-12', at('2026-09-10T10:00:00Z')).mode, 'future');
assert.equal(journey.focus('09-12', at('2026-09-12T08:20:00Z')).mode, 'next');
assert.equal(journey.focus('09-12', at('2026-09-13T10:00:00Z')).mode, 'past');
assert.equal(journey.automaticDay(at('2026-09-06T21:00:00Z')), '09-06');
assert.equal(journey.automaticDay(at('2026-09-07T00:35:00Z')), '09-07');
assert.equal(journey.focus('09-07', at('2026-09-07T01:00:00Z')).current.index, 0);
assert.equal(journey.focus('09-07', at('2026-09-07T05:00:00Z')).current, undefined);
assert.equal(journey.automaticDay(at('2026-09-18T20:00:00Z')), '09-18');
assert.equal(journey.automaticDay(at('2026-09-18T21:10:00Z')), '09-19');
assert.equal(journey.focus('09-19', at('2026-09-19T08:34:59Z')).current.index, 1);
assert.equal(journey.focus('09-19', at('2026-09-19T08:35:00Z')).mode, 'past');
assert.equal(journey.automaticDay(at('2026-09-01T00:00:00Z')), '09-06');
assert.equal(journey.automaticDay(at('2026-09-20T00:00:00Z')), '09-19');
for (const key of Object.keys(context.window.TRIP.days)) {
  const events = journey.events(key);
  for (const event of events) {
    assert.ok(Number.isFinite(event.start), `${key} ${event.index}: start`);
    assert.ok(Number.isFinite(event.end) && event.end >= event.start, `${key} ${event.index}: end`);
  }
}
console.log('Journey checks passed: local times, gaps, boundaries, overnight flights, previews and all 14 days.');
