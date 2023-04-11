const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  if (!newBook.name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (newBook.readPage > newBook.pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  books.push(newBook);
  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBookHandler = () => {
  const buku = books.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));
  return {
    status: 'success',
    data: {
      books: buku,
    },
  };
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((n) => n.id === bookId)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();

  const index = books.findIndex((book) => book.id === bookId);

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((book) => book.id === bookId);
  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const getAllReadingBooksHandler = () => {
  const allReadingBooks = [];

  books.forEach((book) => {
    if (book.reading) {
      allReadingBooks.push({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      });
    }
  });

  return {
    status: 'success',
    data: {
      books: allReadingBooks,
    },
  };
};

const getAllUreadingBooksHandler = () => {
  const allUnreadingBooks = [];

  books.forEach((book) => {
    if (!book.reading) {
      allUnreadingBooks.push({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      });
    }
  });

  return {
    status: 'success',
    data: {
      books: allUnreadingBooks,
    },
  };
};

const getAllFinishedBooksHandler = () => {
  const allFinishedBooks = [];

  books.forEach((book) => {
    if (book.finished) {
      allFinishedBooks.push({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      });
    }
  });

  return {
    status: 'success',
    data: {
      books: allFinishedBooks,
    },
  };
};

const getAllUnfinishedBooksHandler = () => {
  const allUnfinishedBooks = [];

  books.forEach((book) => {
    if (!book.finished) {
      allUnfinishedBooks.push({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      });
    }
  });

  return {
    status: 'success',
    data: {
      books: allUnfinishedBooks,
    },
  };
};

const getAllFilteredBooksByNameHandler = (name) => {
  const allFilteredBooksByName = [];

  books.forEach((book) => {
    if (book.name.toLowerCase().includes(name.toLowerCase())) {
      allFilteredBooksByName.push({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      });
    }
  });

  return {
    status: 'success',
    data: {
      books: allFilteredBooksByName,
    },
  };
};

module.exports = {
  addBookHandler,
  getAllBookHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
  getAllReadingBooksHandler,
  getAllUreadingBooksHandler,
  getAllFinishedBooksHandler,
  getAllUnfinishedBooksHandler,
  getAllFilteredBooksByNameHandler,
};
