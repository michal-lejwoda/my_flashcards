(function () {
  const personSets = {
    de_basic: ['ich', 'du', 'er/sie/es', 'wir', 'ihr', 'sie/Sie'],
    en_basic: ['I', 'you', 'he/she/it', 'we', 'you (pl)', 'they'],
  };

  function isInputVisible(input) {

    let element = input;
    while (element && element !== document.body) {
      const style = window.getComputedStyle(element);
      if (style.display === 'none' ||
          style.visibility === 'hidden' ||
          style.opacity === '0' ||
          element.hasAttribute('hidden')) {
        return false;
      }

      if (element.style && element.style.display === 'none') {
        return false;
      }
      element = element.parentElement;
    }
    return input.offsetParent !== null;
  }

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


      const allInputs = streamField.querySelectorAll('input[name$="person_label"]');
      const visibleInputs = Array.from(allInputs).filter(input => isInputVisible(input));

      console.log("Removing", visibleInputs.length, "visible blocks");

      visibleInputs.forEach(input => {
        const blockParent = input.closest('[class*="block"], .sequence-member, [data-streamfield]');
        if (blockParent) {
          const deleteButton = blockParent.querySelector('button[title*="Delete"], button[title*="Remove"], .action-delete');
          if (deleteButton) {
            deleteButton.click();
          }
        }
      });

      setTimeout(() => {
        console.log("Adding", selectedSet.length, "new blocks");
        selectedSet.forEach((personLabel) => {
          addButton.click();
        });

        setTimeout(() => {
          const newInputs = streamField.querySelectorAll('input[name$="person_label"]');
          const newVisibleInputs = Array.from(newInputs).filter(input => isInputVisible(input));

          console.log("Filling", newVisibleInputs.length, "new inputs");

          newVisibleInputs.forEach((input, idx) => {
            if (selectedSet[idx]) {
              console.log(`Setting input ${idx + 1} to: ${selectedSet[idx]}`);
              input.value = selectedSet[idx];
              input.dispatchEvent(new Event('input', { bubbles: true }));
              input.dispatchEvent(new Event('change', { bubbles: true }));
            }
          });

          console.log("All done!");
        }, 300);
      }, 300);
    });
  });
})();
