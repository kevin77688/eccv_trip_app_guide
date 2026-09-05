(function () {
  'use strict';
  const trip = window.TRIP || {};
  const zones = { travel: 'Asia/Taipei', malmo: 'Europe/Stockholm', copenhagen: 'Europe/Copenhagen', paris: 'Europe/Paris' };
  function timezone(day) {
    return zones[day.cityKey] || (/Copenhagen|Malmö|哥本哈根/.test(day.city) ? 'Europe/Copenhagen' : 'Europe/Paris');
  }
  function parts(date, zone) {
    return Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).formatToParts(date).filter(p => p.type !== 'literal').map(p => [p.type, p.value]));
  }
  function localDate(date, zone) {
    const p = parts(date, zone);
    return `${p.year}/${p.month}/${p.day}`;
  }
  function instant(date, time, zone) {
    const [year, month, day] = date.split('/').map(Number);
    const [hour, minute] = time.split(':').map(Number);
    const target = Date.UTC(year, month - 1, day, hour, minute);
    let value = target;
    for (let n = 0; n < 3; n++) {
      const p = parts(new Date(value), zone);
      value += target - Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
    }
    return value;
  }
  function events(key) {
    const day = trip.days[key];
    if (!day) return [];
    return day.schedule.map((item, index) => {
      const timing = trip.scheduleTiming?.[key]?.[index] || {};
      const times = item.time.match(/\d{1,2}:\d{2}/g) || [];
      const zone = timing.timezone || timezone(day);
      const start = timing.start ? Date.parse(timing.start) : times[0] ? instant(day.date, times[0], zone) : null;
      let end = timing.end ? Date.parse(timing.end) : times[1] ? instant(day.date, times[1], zone) : null;
      if (end !== null && end < start) end += 86400000;
      return { item, index, key, start, end, zone };
    }).map((event, index, list) => {
      if (event.start !== null && event.end === null) {
        const next = list.slice(index + 1).find(e => e.start !== null);
        event.end = next?.start ?? (/後/.test(event.item.time) ? instant(day.date, '23:59', event.zone) + 60000 : event.start);
      }
      return event;
    });
  }
  function focus(key, now = new Date()) {
    const list = events(key);
    const stamp = +now;
    const current = list.find(e => e.start !== null && e.start <= stamp && stamp < e.end);
    const next = list.find(e => e.start !== null && e.start > stamp);
    const day = trip.days[key];
    const date = localDate(now, timezone(day));
    const mode = current ? 'current' : next ? (date < day.date ? 'future' : 'next') : 'past';
    return { mode, current, next, list, key, zone: current?.zone || next?.zone || timezone(day) };
  }
  function automaticDay(now = new Date()) {
    const keys = Object.keys(trip.days);
    const active = keys.find(key => focus(key, now).current);
    if (active) return active;
    return keys.find(key => events(key).some(e => e.start !== null && e.start > +now)) || keys.at(-1);
  }
  function placeId(item, day) {
    const title = item.title.toLowerCase();
    return (day.places || []).find(id => [trip.places[id]?.title, trip.places[id]?.local].some(name => name && title.includes(name.toLowerCase()))) || '';
  }
  function actions(item, day, id = placeId(item, day)) {
    const core = window.ECCV_CORE;
    const ticket = trip.tickets?.find(t => t.id === item.ticketId && !t.hidden);
    const place = trip.places[id];
    return `<div class="journey-actions">${place ? `<a class="button button-secondary" href="${core.esc(core.googleMapsLink(id, place))}" target="_blank" rel="noreferrer">導航 ↗</a>` : ''}${ticket ? `<button type="button" class="button button-primary" data-ticket-action="open" data-ticket-id="${core.esc(ticket.id)}">出示票券</button>` : ''}</div>`;
  }
  function statusLabel(item) {
    if (/optional|彈性|備選/i.test(`${item.title} ${item.tag}`)) return '彈性選項';
    if (item.ticketId) return '有憑證';
    if (/預約/.test(item.tag)) return '預約時段';
    return '行程安排';
  }
  function markup(key, now = new Date()) {
    const core = window.ECCV_CORE;
    const { esc, bilingualText } = core;
    const state = focus(key, now);
    const day = trip.days[key];
    const current = state.current || state.next;
    const following = state.current ? state.next : state.list.find(e => current && e.start > current.start);
    const label = { current: '現在的安排', next: '接下來', future: '當日第一站', past: '這天的時間表已結束' }[state.mode];
    const clock = state.mode === 'future' ? '行程預覽' : state.mode === 'past' ? '行程回顧' : '當地 ' + new Intl.DateTimeFormat('zh-TW', { timeZone: state.zone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZoneName: 'short' }).format(now);
    return `<div class="now-next-heading"><strong>${label}</strong><small>${esc(clock)}</small></div>${current ? `<div class="now-next-current"><span class="journey-time">${esc(current.item.time)}</span><h2>${esc(bilingualText(current.item.title))}</h2>${actions(current.item, day)}${following ? `<div class="now-next-following"><span>下一步 · ${esc(following.item.time)}</span><strong>${esc(bilingualText(following.item.title))}</strong></div>` : ''}</div>` : `<p>仍可查看這天的路線與票券。</p>`}<div class="now-next-footer"><small>依行程表顯示，非即時動態。航班時間依各地時區。</small><a href="${core.page === 'day' ? '#day-schedule' : core.dayLink(key) + '#day-schedule'}">完整時間表 ↓</a></div>`;
  }
  function refresh() {
    document.querySelectorAll('[data-now-next]').forEach(node => {
      const html = markup(node.dataset.nowNext);
      if (node.innerHTML !== html && !node.contains(document.activeElement)) node.innerHTML = html;
    });
  }
  function setup() {
    refresh();
    window.setInterval(refresh, 60000);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
  }
  window.ECCV_JOURNEY = { timezone, localDate, instant, events, focus, automaticDay, placeId, actions, statusLabel, markup, refresh, setup };
})();
