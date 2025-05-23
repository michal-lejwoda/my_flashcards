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
      const inputs_person_label = streamField.querySelectorAll('[data-contentpath="person_label"] input');
       inputs_person_label.forEach((input) => {
  input.setAttribute('data-to-delete', 'true');
  const blockElement = input.closest('[data-contentpath^="conjugation_rows"]');
  if (blockElement) {
    const button_to_delete = blockElement.querySelector('button[title="Delete"][type="button"]');
    if (button_to_delete) {
      button_to_delete.click();
    }
  }
});
setTimeout(() => {
    const addButton = streamField.querySelector('.c-sf-add-button');

    if (!addButton) return;
    selectedSet.forEach((personLabel) => {
        addButton.click();
    });
},300)

      setTimeout(() => {
          const visibleInputs = streamField.querySelectorAll('input[name$="person_label"]:not([data-to-delete])');
          const inputs = streamField.querySelectorAll('input[name$="person_label"]');
        visibleInputs.forEach((input, idx) => {
          if (selectedSet[idx]) {
            input.value = selectedSet[idx];
            input.dispatchEvent(new Event('input', { bubbles: true }));
          }
        });
      }, 300);
    });
  });
})();
