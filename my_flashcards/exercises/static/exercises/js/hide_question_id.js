document.addEventListener('DOMContentLoaded', function() {
    function hideQuestionIdFields() {
        document.querySelectorAll('input[name*="question_id"]').forEach(function(input) {
            const field = input.closest('.field') || input.closest('[data-field]');
            if (field) field.style.display = 'none';
        });
    }

    hideQuestionIdFields();
    setInterval(hideQuestionIdFields, 500);
});
