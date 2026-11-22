// Klikk på eksempelboligen: 3D-visningen lastes rett i bildet på forsiden (ren, &ren=1), med en knapp for fullskjerm.
// Avsluttes fullskjermen, er man tilbake på forsiden med visningen der den var. Uten JavaScript går lenken til /eksempel/.
(function () {
  const boks = document.getElementById('tre-d'), lenke = boks && boks.querySelector('.start-3d');
  if (!lenke) return;
  lenke.addEventListener('click', e => {
    e.preventDefault();
    lenke.querySelector('span').textContent = 'Laster 3D-visningen …';
    lenke.style.pointerEvents = 'none';
    const f = document.createElement('iframe');
    f.title = '3D-visning av eksempelboligen';
    f.allow = 'fullscreen; xr-spatial-tracking; gyroscope; accelerometer';
    f.style.opacity = '0';
    f.src = lenke.dataset.src + '&ren=1';
    f.addEventListener('load', () => {
      f.style.opacity = '1';
      lenke.remove();
      setTimeout(() => { const img = boks.querySelector('img'); if (img) img.remove(); }, 400);
      boks.appendChild(knapp);
    }, { once: true });
    boks.appendChild(f);
  });

  const knapp = document.createElement('button');
  knapp.type = 'button';
  knapp.className = 'fullskjerm-knapp';
  const INN = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>';
  const UT = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/></svg>';
  const settTekst = () => { const f = erFull(); knapp.innerHTML = f ? UT : INN; knapp.setAttribute('aria-label', f ? 'Avslutt fullskjerm' : 'Fullskjerm'); knapp.title = knapp.getAttribute('aria-label'); };
  // Ekte fullskjerm der nettleseren kan (ikke iPhone); ellers dekker boksen hele vinduet.
  const erFull = () => document.fullscreenElement === boks || boks.classList.contains('full');
  function av() {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    boks.classList.remove('full');
    document.documentElement.style.overflow = '';
    settTekst();
  }
  knapp.onclick = () => {
    if (erFull()) return av();
    if (boks.requestFullscreen) boks.requestFullscreen().catch(() => { boks.classList.add('full'); document.documentElement.style.overflow = 'hidden'; settTekst(); });
    else { boks.classList.add('full'); document.documentElement.style.overflow = 'hidden'; }
    settTekst();
  };
  settTekst();
  document.addEventListener('fullscreenchange', settTekst);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && boks.classList.contains('full')) av(); });
})();
