const {
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
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBookHandler,
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getBookByIdHandler,
  },
  {
    method: 'GET',
    path: '/books',
    handler: (request) => {
      const { reading, finished, name } = request.query;
      if (reading === '1') {
        return getAllReadingBooksHandler();
      }
      if (reading === '0') {
        return getAllUreadingBooksHandler();
      }
      if (finished === '1') {
        return getAllFinishedBooksHandler();
      }
      if (finished === '0') {
        return getAllUnfinishedBooksHandler();
      }
      if (name !== undefined) {
        return getAllFilteredBooksByNameHandler(name);
      }
      return getAllBookHandler();
    },
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: editBookByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBookByIdHandler,
  },
];

module.exports = routes;
