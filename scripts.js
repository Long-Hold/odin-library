// Global variable that stores all book objects
const bookArray = [];

// The Node card template to create new books with
const bookCardNode = document.querySelector('.book-card-template');

// Node for book cards
const bookCardsContainer = document.querySelector('.cards-container');

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

        // Add book to the global array, then update the UI with new bookCard
        addBookToLibrary(book);
        displayNewBookCard(book);

        newBookForm.reset();
        dialog.close();
    })
}

function addBookToLibrary(bookObject) {
    bookArray.push(bookObject);
    console.log(`Book Object: ${bookObject.bookID} added to bookArray Library`);
}

function updateCardDisplay(bookObject) {
    /**Uses a bookObject to create a new DOM element
     * Dom element template is a global variable, the data is modified
     * based on object attrributes
     */

    // Perform deep copy of card (carries over children-structure)
    const newCard = bookCardNode.content.cloneNode(true).querySelector('.book-card');

    newCard.dataset.bookid = bookObject.bookID;
    newCard.querySelector('.title').textContent = bookObject.title;
    newCard.querySelector('.author em').textContent = bookObject.author;
    newCard.querySelector('.page-num').textContent = `${bookObject.numOfPages} pages`;
    newCard.querySelector('.status').textContent = bookObject.readStatus ? 'Read' : 'Not Read';

    bookCardsContainer.appendChild(newCard);

    console.log(`Book Object: ${bookObject.bookID} succesfully added to Card`)
}

function captureBookCardEvents() {
    const cardsContainer = document.querySelector('.cards-container');

    cardsContainer.addEventListener('click', (event) => {
        if (event.target.textContent === 'Delete Book') {
            // Record the unique ID of the selected book card
            deleteBookFromLibrary(event);
        }
    })
}

// TODO:
function deleteBookFromLibrary(bookEvent) {
    /**Deletes a selected book from the array based on dataset.bookID.
     * Calls displayAllBooks() function to redraw the UI after book has been
     * removed from array
     */
    const bookID = bookEvent.target.closest('.book-card').dataset.bookid;
    const bookIndex = bookArray.findIndex(book => book.bookID === bookID);

    bookArray.splice(bookIndex, 1);

    displayAllBooks();
}


function displayAllBooks() {
    /**
     * Clears the UI and then calls the UI update function for each element
     * in array
     */
    bookCardsContainer.textContent = '';
    bookArray.forEach(book => updateCardDisplay(book));
}

toggleFormModal();
createNewBook();

captureBookCardEvents();

// Placeholder books for demonstration purposes
const placeHolderBook = new Book('The Alchemist', 'Paulo Coelho', 205, true);
bookArray.push(placeHolderBook);

displayAllBooks();
