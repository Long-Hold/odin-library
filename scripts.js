// The Node card template to create new books with
const bookCardNode = document.querySelector('.book-card-template');

// Node for book cards
const bookCardsContainer = document.querySelector('.cards-container');

class Book {
    #bookID;
    #title;
    #author;
    #numOfPages;
    #readStatus;

    static #bookArray = [];

    constructor(title, author, numOfPages, readStatus) {
        this.#bookID = self.crypto.randomUUID();
        this.#title = title;
        this.#author = author;
        this.#numOfPages = numOfPages;
        this.#readStatus = readStatus;

        Book.#bookArray.push(this);
    }

    get bookID() { return this.#bookID; }

    get title() { return this.#title; }

    get author() { return this.#author; }

    get numOfPages() { return this.#numOfPages; }

    get readStatus() { return this.#readStatus; }

    changeReadStatus() { this.#readStatus = !this.#readStatus; }

    static get bookArray() {
        return Book.#bookArray;
    }

    static deleteBook(bookID) {
        Book.#bookArray.splice(getBookObject(bookID), 1);
    }
}

const library = (function() {
    // Stores created Book objects
    const booksArray = [];

    const addBook = (book) => booksArray.append(book);

    const deleteAllBooks = () => bookArray.length = 0;

    const deleteBook = () => {
        /**Finds the book that is to be deleted via it's unique
         * Book ID
         */   
    }

    const getBookObj = (datasetID) => booksArray.find(book => book.bookID === datasetID);
})();

function delegateAddBookEvents() {
    const container = document.querySelector('.add-book-container');

    container.addEventListener('click', (event) => {
        if (event.target.classList.contains('display-form-btn')) {
            toggleFormModal(event);
        }

        else if (event.target.classList.contains('delete-all')) {
            deleteAllBookData();
        }
    })
}

function deleteAllBookData() {
    bookArray.length = 0;
    bookCardsContainer.innerHTML = '';
}

function toggleFormModal(event) {
    // Listens for events related to the dialog open and close functionality

    const dialog = document.querySelector('dialog');

    if (event.target.classList.contains('display-form-btn')) {
        dialog.showModal();
    }

    dialog.addEventListener('click', (event) => {
            if (event.target.classList.contains('close-dialog')) {
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

        updateCardDisplay(book);

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
    updateStatusColor(newCard, bookObject);

    bookCardsContainer.appendChild(newCard);

    console.log(`Book Object: ${bookObject.bookID} succesfully added to Card`)
}

function captureBookCardEvents() {
    const cardsContainer = document.querySelector('.cards-container');

    cardsContainer.addEventListener('click', (event) => {
        const bookCard = event.target.closest('.book-card');

        if (event.target.textContent === 'Delete Book') {
            // Remove the object from the global array
            // Then delete the node that represents this object

            // Record the unique ID of the selected book card
            deleteBookFromLibrary(bookCard.dataset.bookid);
            deleteBookCardNode(bookCard);
        }

        if (event.target.textContent === 'Change Status') {
            const bookObject = getBookObject(bookCard.dataset.bookid);

            bookObject.changeReadStatus();
            changeCardNodeStatus(bookCard, bookObject);
            updateStatusColor(bookCard, bookObject);
        }
    })
}

function deleteBookFromLibrary(bookID) {
    /**Deletes a selected book from the array based on dataset.bookID.
     */
    Book.deleteBook(bookID);
    console.log(`Book ID: ${bookID} deleted from bookArray`);
}

function deleteBookCardNode(bookCard) {
    /**Removes the node from the UI */
    bookCard.remove();
    console.log(`Book Node: ${bookCard.dataset.bookid} Removed`);
}

function changeCardNodeStatus(bookCard, bookObject) {
    bookCard.querySelector('.status').textContent = bookObject.readStatus ? 'Read' : 'Not Read';
    console.log(`Book Node: ${bookCard.dataset.bookid} status changed to ${bookCard.querySelector('.status').textContent}`)
}

function updateStatusColor(bookCard, bookObject) {
    const statusContainer = bookCard.querySelector('.status');

    statusContainer.style.backgroundColor = bookObject.readStatus ? 'green' : 'var(--warning-red)';
    console.log(`Book Card: ${bookCard.dataset.datasetID} status container set to ${statusContainer.style.backgroundColor}`);
}

function getBookObject(datasetID) {
    return Book.bookArray.find(book => book.bookID === datasetID);
}


function displayAllBooks() {
    /**
     * Clears the UI and then calls the UI update function for each element
     * in array
     */
    bookCardsContainer.textContent = '';
    Book.bookArray.forEach(book => updateCardDisplay(book));
}

// Dialog toggle or delete all delegator
delegateAddBookEvents();

// Form submission events
createNewBook();

// Book card event delegation
captureBookCardEvents();

// Create 12 distinct book objects and add them to the array

const book1 = new Book('The Alchemist', 'Paulo Coelho', 205, true);

const book2 = new Book('To Kill a Mockingbird', 'Harper Lee', 376, true);

const book3 = new Book('1984', 'George Orwell', 328, false);

const book4 = new Book('The Great Gatsby', 'F. Scott Fitzgerald', 180, true);

const book5 = new Book('Harry Potter and the Sorcerer\'s Stone', 'J.K. Rowling', 309, true);

const book6 = new Book('The Catcher in the Rye', 'J.D. Salinger', 277, false);

const book7 = new Book('Pride and Prejudice', 'Jane Austen', 432, true);

const book8 = new Book('The Lord of the Rings', 'J.R.R. Tolkien', 1216, false);

const book9 = new Book('The Hitchhiker\'s Guide to the Galaxy', 'Douglas Adams', 224, true);

const book10 = new Book('Brave New World', 'Aldous Huxley', 268, false);

const book11 = new Book('The Hobbit', 'J.R.R. Tolkien', 310, true);

const book12 = new Book('Fahrenheit 451', 'Ray Bradbury', 194, false);

displayAllBooks();