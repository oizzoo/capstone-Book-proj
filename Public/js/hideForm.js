const bookForm = document.getElementById('book-form');
const toggleFormButton = document.getElementById('toggle-form-button');

//listen for click on the button
toggleFormButton.addEventListener('click', () => {
    bookForm.classList.toggle('hide');
});

// listen for click on the button to change text
toggleFormButton.addEventListener('click', () => {
    if (bookForm.classList.contains('hide')) {
        toggleFormButton.textContent = 'Add another book';
    } else {
        toggleFormButton.textContent = 'Hide form';
    }
});
