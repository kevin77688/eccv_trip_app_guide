const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');
const path = require('node:path');
const root = path.join(__dirname, '..');
const tracked = execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' }).split('\0');
assert.equal(tracked.some(file => file.startsWith('pdf/') || file.endsWith('.pdf') || /^site\/assets\/tickets\/.*\.enc$/.test(file)), false, 'Private booking files must not be tracked');
const context = { window: {} }; vm.createContext(context);
const source = fs.readFileSync(path.join(root, 'site/js/data.js'), 'utf8');
vm.runInContext(source, context);
for (const flight of context.window.TRIP.flights) for (const passenger of flight.passengers || []) assert.match(passenger.name, /^同行者 \d+$/, 'Passenger names must be masked');
for (const ticket of context.window.TRIP.tickets) {
  assert.match(context.window.TRIP.ticketDigests[ticket.encFile], /^[0-9a-f]{64}$/, 'Every ticket needs an import checksum');
  for (const detail of ticket.details || []) if (/姓名|票號|訂位代號|預訂編號/.test(detail.label)) assert.equal(detail.value, '已遮蔽', 'Booking identifiers must be masked');
}
for (const text of [source, fs.readFileSync(path.join(root, 'trip.md'), 'utf8')]) assert.equal(/\bPIN(?:\s*碼)?\s*[:：]\s*`?\d+/i.test(text), false, 'Booking PIN must be masked');
console.log('Privacy checks passed: private files excluded, identifiers masked, and import checksums present.');
