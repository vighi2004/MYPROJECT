(() => {
    'use strict';

    console.log("Bootstrap validation script loaded");

    const forms = document.querySelectorAll('.needs-validation');

    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            console.log("Form submitted");

            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
                console.log("Form validation failed");
            } else {
                console.log("Form validation passed, submitting...");
            }

            form.classList.add('was-validated');
        }, false);
    });
})();

