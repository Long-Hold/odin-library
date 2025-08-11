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

    constructor(title, author, numOfPages, readStatus) {
        this.#bookID = self.crypto.randomUUID();
        this.#title = title;
        this.#author = author;
        this.#numOfPages = numOfPages;
        this.#readStatus = readStatus;
    }

    get bookID() { return this.#bookID; }

    get title() { return this.#title; }

    get author() { return this.#author; }

    get numOfPages() { return this.#numOfPages; }

    get readStatus() { return this.#readStatus; }

    changeReadStatus() { this.#readStatus = !this.#readStatus; }
}

const library = (function() {
    const booksArray = [];

    const addBook = (book) => booksArray.push(book);

    const deleteAllBooks = () => booksArray.length = 0;

    const deleteBook = (datasetID) => booksArray.splice(getBookObj(datasetID), 1); 

    const getBookObj = (datasetID) => booksArray.find(book => book.bookID === datasetID);

    const getBookArray = () => [...booksArray];

    return {addBook, deleteAllBooks, deleteBook, getBookObj, getBookArray};
})();

const newBookForm = (function() {
    const form = document.getElementById('new-book-form');
    
    form.addEventListener('click', (event) => {
        event.preventDefault();

        const book = createNewBook(event);
        library.addBook(book);
        updateCardDisplay(book);
        
        form.reset();
        dialogManager.closeDialog();
    })

    const createNewBook = (event) => {
        const formData = new FormData(event.target);

        return new Book(
            formData.get('title'),
            formData.get('author'),
            parseInt(formData.get('page-num')),
            formData.get('status') === 'read-true' ? true : false,
        )
    }
})();

const dialogManager = (function() {
    const dialog = document.querySelector('dialog');

    const showModal = () => dialog.showModal();

    const closeDialog = () => dialog.close();

    // Closes the dialog if the close button is selected
    dialog.addEventListener('click', (event) => {
        if (event.target.classList.contains('close-dialog')) { dialog.close(); }
    });

    return {showModal, closeDialog};
})();

function delegateAddBookEvents() {
    const container = document.querySelector('.add-book-container');

    container.addEventListener('click', (event) => {
        if (event.target.classList.contains('display-form-btn')) {
            dialogManager.showModal();
        }

        else if (event.target.classList.contains('delete-all')) {
            library.deleteAllBooks();
            bookCardsContainer.innerHTML = '';
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

        library.addBook(book);

        updateCardDisplay(book);

        newBookForm.reset();
        dialog.close();
    })
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
            library.deleteBook(bookCard.dataset.bookid);
            deleteBookCardNode(bookCard);
        }

        if (event.target.textContent === 'Change Status') {
            const bookObject = library.getBookObj(bookCard.dataset.bookid);

            bookObject.changeReadStatus();
            changeCardNodeStatus(bookCard, bookObject);
            updateStatusColor(bookCard, bookObject);
        }
    })
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

function displayAllBooks() {
    /**
     * Clears the UI and then calls the UI update function for each element
     * in array
     */
    bookCardsContainer.textContent = '';
    library.getBookArray().forEach(book => updateCardDisplay(book));
}

// Dialog toggle or delete all delegator
delegateAddBookEvents();

// Form submission events
createNewBook();

// Book card event delegation
captureBookCardEvents();

const initializeSampleBooks = (function() {
    const sampleBooks = [
        new Book('The Alchemist', 'Paulo Coelho', 205, true),
        new Book('To Kill a Mockingbird', 'Harper Lee', 376, true),
        new Book('1984', 'George Orwell', 328, false),
        new Book('The Great Gatsby', 'F. Scott Fitzgerald', 180, true),
        new Book('Harry Potter and the Sorcerer\'s Stone', 'J.K. Rowling', 309, true),
        new Book('The Catcher in the Rye', 'J.D. Salinger', 277, false),
        new Book('Pride and Prejudice', 'Jane Austen', 432, true),
        new Book('The Lord of the Rings', 'J.R.R. Tolkien', 1216, false),
        new Book('The Hitchhiker\'s Guide to the Galaxy', 'Douglas Adams', 224, true),
        new Book('Brave New World', 'Aldous Huxley', 268, false),
        new Book('The Hobbit', 'J.R.R. Tolkien', 310, true),
        new Book('Fahrenheit 451', 'Ray Bradbury', 194, false)
    ];

    sampleBooks.forEach(book => library.addBook(book));
    displayAllBooks();
})();