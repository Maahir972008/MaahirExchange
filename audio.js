(function () {
  const audio = new Audio('Exchange sound.mp3');
  audio.loop = true;
  audio.preload = 'auto';

  const savedState = localStorage.getItem('maahir-audio-enabled');
  let enabled = savedState !== 'false';

  const control = document.createElement('button');
  control.type = 'button';
  control.className = 'audio-toggle';
  control.setAttribute('aria-label', 'Turn exchange sound off');
  control.setAttribute('aria-pressed', 'true');
  document.body.appendChild(control);

  function updateControl() {
    const playing = enabled && !audio.paused;
    control.classList.toggle('is-playing', playing);
    control.classList.toggle('is-muted', !enabled);
    control.innerHTML = `<i class="fas ${enabled ? 'fa-volume-high' : 'fa-volume-xmark'}"></i><span>${enabled ? 'Sound on' : 'Sound off'}</span>`;
    control.setAttribute('aria-label', enabled ? 'Turn exchange sound off' : 'Turn exchange sound on');
    control.setAttribute('aria-pressed', String(enabled));
  }

  function startAudio() {
    if (!enabled) return;
    audio.play().then(updateControl).catch(updateControl);
  }

  control.addEventListener('click', function () {
    enabled = !enabled;
    localStorage.setItem('maahir-audio-enabled', String(enabled));
    if (enabled) {
      startAudio();
    } else {
      audio.pause();
      audio.currentTime = 0;
      updateControl();
    }
  });

  ['pointerdown', 'keydown', 'touchstart'].forEach(eventName => {
    document.addEventListener(eventName, startAudio, { once: true, passive: true });
  });

  audio.addEventListener('play', updateControl);
  audio.addEventListener('pause', updateControl);
  updateControl();
  startAudio();
})();
