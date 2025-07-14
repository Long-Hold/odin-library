// Global variable that stores all book objects
const bookArray = [];

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
    /** Catches the form locally
     * Creates a new book object, adds to global book array
     * Resets form, closes dialog
     */
    const newBookForm = document.getElementById('new-book-form');
    const dialog = document.querySelector('dialog');

    newBookForm.addEventListener('submit', (event) => {
        // Stop default form submission to allow local handling
        event.preventDefault();

        const formData = new FormData(event.target);
        
        const book = new Book(
            formData.get('title'),
            formData.get('author'),
            parseInt(formData.get('page-num')),
            formData.get('status') === 'read-true' ? true : false,
        )

        bookArray.push(book);
        newBookForm.reset();
        dialog.close();
    })
}

toggleFormModal();
createNewBook();
