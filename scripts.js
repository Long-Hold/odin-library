function Book(title, author, numOfPages, readStatus) {
    if (!new.target) {
        throw Error('Must use New when creating Book Object');
    }

    // Generate a secure and random ID
    this.bookID = self.crypto.randomUUID();

    this.title = title;
    this.author = author;
    this.numOfPages = numOfPages;
    this.readStatus = readStatus;
}

function toggleFormModal() {
    /** Attaches an event listener to the parent container of the modal and form.
     * If the 'add book' button is clicked, the modal is revealed.
     * If the 'cancel' button is clicked, the modal is closed.
     */

    const formContainer = document.querySelector('.add-book-container');
    const dialog = document.querySelector('dialog');

    formContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('display-form-btn')) {
            dialog.showModal();
        }

        else if (event.target.classList.contains('close-dialog')) {
            dialog.close();
        }
    })
}

function createNewBook() {

}

toggleFormModal();