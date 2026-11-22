// Klikk på en e-postlenke: la megleren velge Gmail, Outlook eller eget e-postprogram, med ferdig utfylt e-post.
// Uten JavaScript virker lenken som vanlig mailto.
(function () {
  const dlg = document.createElement('dialog');
  dlg.className = 'velg-epost';
  dlg.innerHTML = '<h2>Send e-post med</h2><div class="valg"></div>'
    + '<p class="adresse">Eller skriv til <b>magnus@lettvisning.no</b> <button type="button" class="kopier">Kopier adressen</button></p>'
    + '<button type="button" class="lukk" aria-label="Lukk">Lukk</button>';
  document.body.appendChild(dlg);
  const valg = dlg.querySelector('.valg'), kopier = dlg.querySelector('.kopier');
  dlg.querySelector('.lukk').onclick = () => dlg.close();
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
  kopier.onclick = async () => {
    try { await navigator.clipboard.writeText('magnus@lettvisning.no'); kopier.textContent = 'Kopiert'; }
    catch (e) { kopier.textContent = 'Kunne ikke kopiere'; }
  };
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="mailto:"]');
    if (!a || dlg.contains(a) || typeof dlg.showModal !== 'function') return;
    e.preventDefault();
    const u = new URL(a.href), to = decodeURIComponent(u.pathname);
    const su = u.searchParams.get('subject') || '', body = u.searchParams.get('body') || '';
    const q = o => new URLSearchParams(o).toString().replace(/\+/g, '%20');
    const lenker = [
      ['Gmail', 'https://mail.google.com/mail/?' + q({ view: 'cm', fs: '1', to, su, body })],
      ['Outlook', 'https://outlook.office.com/mail/deeplink/compose?' + q({ to, subject: su, body })]
    ];
    valg.innerHTML = '';
    for (const [navn, href] of lenker) {
      const l = document.createElement('a');
      l.className = 'knapp';
      l.textContent = navn; l.href = href; l.target = '_blank'; l.rel = 'noopener';
      l.addEventListener('click', () => setTimeout(() => dlg.close(), 0));
      valg.appendChild(l);
    }
    kopier.textContent = 'Kopier adressen';
    dlg.showModal();
  });
})();
