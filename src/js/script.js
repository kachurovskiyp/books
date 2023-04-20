'use strict';

{
  const settings = {
    select: {
      template: {
        book: '#template-book'
      },
      dom: {
        booksList: '.books-list',
        filters: '.filters',
        rating: '.book__rating__fill',
        bookLink: 'a.book__image'
      }
    },

    class: {
      favorite: 'favorite',
      hidden: 'hidden'
    },

    filter: {
      adults: 'adults',
      nonFiction: 'nonFiction'
    },

    style: {
      gradient: {
        min: 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%)',
        meduim: 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)',
        height: 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)',
        max: 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)'
      }
    }
  };

  class BookList {
    constructor() {
      this.favoriteBooks = new Set();
      this.filters = new Set();
      this.createdBooks = [];
      this.dom = {};

      this.initData();
      this.getElements();
      this.createBooks();
      this.renderBooks();
      this.initActions();
    }

    getElements() {
      this.dom.list = document.querySelector(settings.select.dom.booksList);
      this.dom.filter = document.querySelector(settings.select.dom.filters);
    }

    initData() {
      this.books = dataSource.books;
    }

    createBooks() {
      this.books.forEach((book) => {
        this.createdBooks.push(new Book(book));
      });
    }

    renderBooks() {
      this.createdBooks.forEach((book) => {
        this.dom.list.appendChild(book.getDOMElement());
      });
    }

    initActions() {
      this.dom.list.addEventListener('dblclick', (event) => (this.favoriteClickHandler(event)));
      this.dom.filter.addEventListener('click', (event) => (this.filterClickHandler(event)));
    }

    getParentLink (element) {
      while(element.tagName !== 'A') {
        element = element.parentNode;
      }
      return element;
    }

    favoriteClickHandler (event) {
      event.preventDefault();

      const elem = event.target.tagName === 'A' ? event.target : this.getParentLink(event.target);

      if(this.favoriteBooks.has(elem.dataset.id)) {
        this.favoriteBooks.delete(elem.dataset.id);
        elem.classList.remove(settings.class.favorite);
      } else {
        this.favoriteBooks.add(elem.dataset.id);
        elem.classList.add(settings.class.favorite);
      }
    }

    filterClickHandler (event) {
      if(event.target.tagName === 'INPUT') {
        this.filters.has(event.target.value) ?
          this.filters.delete(event.target.value)
          :
          this.filters.add(event.target.value);
      }

      const renderedBooks = document.querySelectorAll(settings.select.dom.bookLink);

      renderedBooks.forEach((book) => {
        if(book.classList.contains(settings.class.hidden)) {
          book.classList.remove(settings.class.hidden);
        }

        if(this.filters.size > 0) {
          const currentBook = dataSource.books.find(dataBook => dataBook.id == book.dataset.id);

          if(this.filters.has(settings.filter.adults) && currentBook.details.adults) {
            book.classList.add(settings.class.hidden);
          }

          if(this.filters.has(settings.filter.nonFiction) && currentBook.details.nonFiction) {
            book.classList.add(settings.class.hidden);
          }
        }
      });
    }
  }

  class Book {
    constructor(bookData) {
      this.dom = {};
      this.data = bookData;

      this.setTemplate();
      this.createElement(bookData);
      this.setDOMLinks();
      this.setRatingStyle(this.data.rating);
    }

    setTemplate() {
      this.dom.template = Handlebars.compile(document.querySelector(settings.select.template.book).innerHTML);
    }

    createElement(bookData) {
      this.dom.element = utils.createDOMFromHTML(this.dom.template({
        id: bookData.id,
        name: bookData.name,
        price: bookData.price,
        rating: bookData.rating,
        image: bookData.image
      }));
    }

    setDOMLinks() {
      this.dom.ratingElement = this.dom.element.querySelector(settings.select.dom.rating);
    }

    setRatingStyle(rating) {
      this.dom.ratingElement.style.background = this.getRatingGradient(rating);
      this.dom.ratingElement.style.width = `${rating * 10}%`;
    }

    getRatingGradient(rating) {
      if(rating <  6) {
        return settings.style.gradient.min;

      } else if (rating > 6 && rating <= 8) {
        return settings.style.gradient.meduim;

      } else if (rating > 8 <= 9) {
        return settings.style.gradient.max;

      } else {
        return settings.style.gradient.max;
      }
    }

    getDOMElement() {
      return this.dom.element;
    }
  }

  const app = new BookList(); // eslint-disable-line no-unused-vars
}