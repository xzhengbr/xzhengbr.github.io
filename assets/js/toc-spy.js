document.addEventListener('DOMContentLoaded', function () {
  var tocNav = document.querySelector('.post-toc-card nav#TableOfContents');
  if (!tocNav) return;

  var links = Array.from(tocNav.querySelectorAll('a[href^="#"]'));
  if (!links.length) return;

  var headings = links.map(function (link) {
    var id = decodeURIComponent(link.getAttribute('href').slice(1));
    return document.getElementById(id);
  }).filter(Boolean);

  if (!headings.length) return;

  function setActive(id) {
    links.forEach(function (link) {
      var li = link.parentElement;
      var active = link.getAttribute('href') === '#' + id;
      if (li) li.classList.toggle('is-active', active);
    });
  }

  function updateActive() {
    var offset = 120;
    var pos = window.scrollY + offset;
    var current = headings[0];

    headings.forEach(function (heading) {
      if (heading.offsetTop <= pos) current = heading;
    });

    setActive(current.id);
  }

  window.addEventListener('scroll', updateActive, { passive: true });
  window.addEventListener('resize', updateActive);
  updateActive();
});
