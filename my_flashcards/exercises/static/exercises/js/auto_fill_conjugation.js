(function () {
  const personSets = {
    de_basic: ['ich', 'du', 'er/sie/es', 'wir', 'ihr', 'sie/Sie'],
    en_basic: ['I', 'you', 'he/she/it', 'we', 'you (pl)', 'they'],
  };

  document.addEventListener("DOMContentLoaded", function () {
    const select = document.querySelector('select[name="person_set"]');
    if (!select) return;

    select.addEventListener("change", function () {
      const selectedSet = personSets[select.value];
      if (!selectedSet) return;
      const streamField = document.querySelector('[id="panel-child-content-conjugation_rows-content"]');
      if (!streamField) return;
      const addButton = streamField.querySelector('.c-sf-add-button');
      if (!addButton) return;
      selectedSet.forEach((personLabel) => {
        addButton.click();
      });

      setTimeout(() => {
        const inputs = streamField.querySelectorAll('input[name$="person_label"]');
        inputs.forEach((input, idx) => {
          if (selectedSet[idx]) {
            input.value = selectedSet[idx];
            input.dispatchEvent(new Event('input', { bubbles: true }));
          }
        });
      }, 300);
    });
  });
})();
