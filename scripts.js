const formBtn = document.querySelector('.display-form-btn');
const dialog = document.querySelector('dialog');
const closeBtn = document.querySelector('#close-dialog')

formBtn.addEventListener('click', () => {
    dialog.showModal();
})

closeBtn.addEventListener('click', () => {
    dialog.close();
})