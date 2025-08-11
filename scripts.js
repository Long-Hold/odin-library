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
    const addBookBtn = document.querySelector('.display-form-btn');
    const dialog = document.querySelector('dialog');
    const form = document.getElementById('new-book-form');

    addBookBtn.addEventListener('click', () => dialog.showModal());

    dialog.addEventListener('click', (event) => {
        if (event.target.classList.contains('close-dialog')) { dialog.close(); }
    })
    
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const book = createNewBook(event);
        library.addBook(book);
        bookCardManager.createNewCard(book);
        
        form.reset();
        dialog.close();
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

const bookCardManager = (function() {
    const cardContainer = document.querySelector('.cards-container');
    const bookCardTemp = document.querySelector('.book-card-template');
    const deleteAllBtn = document.querySelector('.delete-all');

    deleteAllBtn.addEventListener('click', () => {
        library.deleteAllBooks();
        cardContainer.innerHTML = '';
    })

    cardContainer.addEventListener('click', (event) => {
        const bookCard = event.target.closest('.book-card');

        switch (event.target.textContent) {
            case 'Delete Book':
                library.deleteBook();
                bookCard.remove();
                break;
            
            case 'Change Status':
                const bookObj = library.getBookObj(bookCard.dataset.bookid);
                
                bookObj.changeReadStatus();
                changeStatusColor(bookCard, bookObj);
                changeStatusText(bookCard, bookObj);
                break;
            
            default:
                break;
        }
    })

    const createNewCard = (bookObj) => {
        const newCard = bookCardTemp.content.cloneNode(true).querySelector('.book-card');

        newCard.dataset.bookid = bookObj.bookID;
        newCard.querySelector('.title').textContent = bookObj.title;
        newCard.querySelector('.author em').textContent = bookObj.author;
        newCard.querySelector('.page-num').textContent = `${bookObj.numOfPages} pages`;
        newCard.querySelector('.status').textContent = bookObj.readStatus ? 'Read' : 'Not Read';

        changeStatusColor(newCard, bookObj);
        cardContainer.appendChild(newCard);
    }

    const changeStatusColor = (cardNode, bookObj) => {
        const statusContainer = cardNode.querySelector('.status');
        statusContainer.style.backgroundColor = bookObj.readStatus ? 'green' : 'var(--warning-red)';
    }

    const changeStatusText = (cardNode, bookObj) => {
        cardNode.querySelector('.status').textContent = bookObj.readStatus ? 'Read' : 'Not Read';
    }

    return {createNewCard};
})();

function displayAllBooks() {
    /**
     * Clears the UI and then calls the UI update function for each element
     * in array
     */
    bookCardsContainer.textContent = '';
    library.getBookArray().forEach(book => bookCardManager.createNewCard(book));
}

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