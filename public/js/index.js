document.addEventListener('DOMContentLoaded', function () {
  const descElements = document.querySelectorAll('.program-desc');
  descElements.forEach(function (el) {
    const fullText = el.getAttribute('data-full');
    const maxLength = 50;
    if (fullText.length > maxLength) {
      const shortText = fullText.substring(0, maxLength) + '...';
      el.textContent = shortText;
      el.style.cursor = 'pointer';
      el.title = 'Click to expand';
      el.addEventListener('click', function () {
        if (el.textContent === shortText) {
          el.textContent = fullText;
        } else {
          el.textContent = shortText;
        }
      });
    } else {
      el.textContent = fullText;
    }
  });
});
