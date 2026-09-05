(function () {
  'use strict';
  const trip = window.TRIP;
  let returnFocus;
  function selectedDay() {
    return document.querySelector('[data-now-next]')?.dataset.nowNext || window.ECCV_JOURNEY.automaticDay();
  }
  function stayForDay(key) {
    const date = key.replace('-', '/');
    return trip.stays.find(stay => {
      const dates = stay.date.match(/\d{2}\/\d{2}/g) || [];
      return dates.length === 2 && dates[0] <= date && date < dates[1];
    });
  }
  function content(key) {
    const core = window.ECCV_CORE;
    const { esc } = core;
    const day = trip.days[key];
    const stay = stayForDay(key);
    const tickets = trip.tickets.filter(t => !t.hidden && t.targetDays?.includes(key));
    const mapUrl = stay ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(stay.address)}` : '';
    return `<div class="essentials-date"><label for="essentials-date">查看日期</label><select id="essentials-date">${Object.keys(trip.days).map(k => `<option value="${k}" ${k === key ? 'selected' : ''}>${k.replace('-', '/')} · ${esc(core.cityLabel(trip.days[k].cityKey))}</option>`).join('')}</select></div>
      <section class="essential-section"><h3>當日票券</h3>${tickets.length ? `<div class="essential-tickets">${tickets.map(t => `<button type="button" data-essential-ticket="${esc(t.id)}">${esc(t.title)} <span>出示 →</span></button>`).join('')}</div>` : '<p>這天沒有已加入的票券。</p>'}<a class="place-note-link" href="${core.logisticsLink}#tickets">所有票券與匯入 →</a></section>
      <section class="essential-section"><h3>當晚住宿</h3>${stay ? `<strong>${esc(stay.name)}</strong><p>${esc(stay.address)}</p><div class="journey-actions"><button type="button" class="button button-secondary" data-essential-copy="${esc(stay.address)}">複製地址</button><a class="button button-secondary" href="${esc(mapUrl)}" target="_blank" rel="noreferrer">導航 ↗</a>${stay.phone ? `<a class="button button-secondary" href="tel:${esc(stay.phone.replace(/[^+\d]/g, ''))}">致電住宿</a>` : ''}</div>` : `<p>${esc(day.stay)}。可在交通頁查看住宿日期。</p>`}</section>
      <section class="essential-section"><h3>緊急聯絡</h3><div class="journey-actions"><a class="button button-primary" href="tel:${esc(trip.emergency.universal.number)}">歐洲緊急電話 ${esc(trip.emergency.universal.number)}</a><a class="button button-secondary" href="${core.logisticsLink}#emergency">各國與代表處專線 →</a></div></section>
      <a class="place-note-link" href="${core.toolsLink}#tools-update">查看離線準備與版本 →</a>`;
  }
  function close(fromHistory = false) {
    const dialog = document.getElementById('essentials-dialog');
    if (!dialog) return;
    dialog.close();
    dialog.remove();
    document.body.style.overflow = '';
    returnFocus?.focus();
    if (!fromHistory && history.state?.eccvModal === 'essentials') history.back();
  }
  function open(key = selectedDay()) {
    if (document.getElementById('essentials-dialog')) return;
    const core = window.ECCV_CORE;
    returnFocus = document.activeElement;
    const dialog = document.createElement('dialog');
    dialog.id = 'essentials-dialog';
    dialog.className = 'essentials-dialog';
    dialog.setAttribute('aria-labelledby', 'essentials-title');
    dialog.innerHTML = `<header><h2 id="essentials-title">隨身資訊</h2><button type="button" data-essential-close aria-label="關閉隨身資訊">關閉 ×</button></header><div data-essentials-content>${content(key)}</div>`;
    document.body.append(dialog);
    history.pushState({ ...history.state, eccvModal: 'essentials' }, '');
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
    dialog.addEventListener('change', event => { if (event.target.id === 'essentials-date') { dialog.querySelector('[data-essentials-content]').innerHTML = content(event.target.value); dialog.querySelector('#essentials-date').focus(); } });
    dialog.addEventListener('click', async event => {
      if (event.target === dialog || event.target.closest('[data-essential-close]')) close();
      const copy = event.target.closest('[data-essential-copy]');
      if (copy) { const ok = await core.copyText(copy.dataset.essentialCopy); copy.textContent = ok ? '已複製' : '複製失敗，請長按地址複製'; }
      const ticket = event.target.closest('[data-essential-ticket]');
      if (ticket) {
        // Replace this modal history entry so Back closes the ticket in one step.
        close(true);
        window.ECCV_TICKETS.open(ticket.dataset.essentialTicket, true);
      }
    });
  }
  function setup() {
    const button = document.createElement('button');
    button.className = 'essentials-toggle';
    button.type = 'button';
    button.textContent = '隨身資訊';
    button.setAttribute('aria-haspopup', 'dialog');
    button.addEventListener('click', () => open());
    document.querySelector('.header-tools')?.prepend(button);
    window.addEventListener('popstate', () => close(true));
  }
  window.ECCV_ESSENTIALS = { setup, open, stayForDay };
})();
