const library = [];

const searchBooks = async () => {
  const query = document.getElementById('search-query').value;
  const genre = document.getElementById('genre-select').value;
  
  try {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}+subject:${genre}`);
    const data = await response.json();
    displayBooks(data.items);
  } catch (error) {
    console.error('Error fetching books:', error);
  }
};

const displayBooks = (books) => {
  const bookList = document.getElementById('book-list');
  bookList.innerHTML = '';
  
  books.forEach((book) => {
    const bookCard = document.createElement('div');
    bookCard.classList.add('book-card');
    
    const img = document.createElement('img');
    img.src = book.volumeInfo.imageLinks?.thumbnail || 'default-thumbnail.jpg';
    bookCard.appendChild(img);
    
    const content = document.createElement('div');
    content.classList.add('book-card-content');
    
    const title = document.createElement('h3');
    title.textContent = book.volumeInfo.title || 'Untitled';
    content.appendChild(title);
    
    const authors = document.createElement('p');
    authors.textContent = book.volumeInfo.authors?.join(', ') || 'Unknown Author';
    content.appendChild(authors);
    
    const description = document.createElement('p');
    description.textContent = (book.volumeInfo.description || 'No description available').substring(0, 100) + '...';
    content.appendChild(description);
    
    const progress = document.createElement('input');
    progress.type = 'range';
    progress.min = 0;
    progress.max = 100;
    progress.value = 0;
    content.appendChild(progress);
    
    const progressText = document.createElement('span');
    progressText.textContent = '0%';
    content.appendChild(progressText);
    
    const addButton = document.createElement('button');
    addButton.textContent = 'Add to Library';
    addButton.onclick = () => addToLibrary(book);
    content.appendChild(addButton);
    
    bookCard.appendChild(content);
    bookList.appendChild(bookCard);
  });
};

const addToLibrary = (book) => {
  library.push({
    id: book.id,
    title: book.volumeInfo.title,
    image: book.volumeInfo.imageLinks?.thumbnail || 'default-thumbnail.jpg',
    shelf: 'toRead'
  });
  renderLibrary();
};

const moveBookToShelf = (bookId, shelf) => {
  const book = library.find((b) => b.id === bookId);
  if (book) {
    book.shelf = shelf;
  }
  renderLibrary();
};

const renderLibrary = () => {
  const toReadList = document.getElementById('toRead');
  const readingList = document.getElementById('reading');
  const finishedList = document.getElementById('finished');
  
  toReadList.innerHTML = '';
  readingList.innerHTML = '';
  finishedList.innerHTML = '';

  library.forEach((book) => {
    const bookCard = document.createElement('div');
    bookCard.classList.add('book-card');
    
    const img = document.createElement('img');
    img.src = book.image;
    bookCard.appendChild(img);
    
    const content = document.createElement('div');
    content.classList.add('book-card-content');
    
    const title = document.createElement('h3');
    title.textContent = book.title;
    content.appendChild(title);
    
    const button = document.createElement('button');
    if (book.shelf === 'toRead') {
      button.textContent = 'Start Reading';
      button.onclick = () => moveBookToShelf(book.id, 'reading');
    } else if (book.shelf === 'reading') {
      button.textContent = 'Finish Reading';
      button.onclick = () => moveBookToShelf(book.id, 'finished');
    }
    content.appendChild(button);
    
    bookCard.appendChild(content);
    
    if (book.shelf === 'toRead') {
      toReadList.appendChild(bookCard);
    } else if (book.shelf === 'reading') {
      readingList.appendChild(bookCard);
    } else if (book.shelf === 'finished') {
      finishedList.appendChild(bookCard);
    }
  });
};

// Event Listener for Search
document.getElementById('search-button').addEventListener('click', searchBooks);


