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
        rating: '.book__rating__fill'
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

  const favoriteBooks = new Set();
  const filters = new Set();

  const getRatingGradient = (rating) => {
    if(rating <  6) {
      return settings.style.gradient.min;

    } else if (rating > 6 && rating <= 8) {
      return settings.style.gradient.meduim;

    } else if (rating > 8 <= 9) {
      return settings.style.gradient.max;

    } else {
      return settings.style.gradient.max;
    }
  };

  const setRatingStyle = (domElement, rating) => {
    const ratingElem = domElement.querySelector(settings.select.dom.rating);

    ratingElem.style.background = getRatingGradient(rating);
    ratingElem.style.width = `${rating * 10}%`;

    return domElement;
  };

  const renderBooks = () => {
    const template = Handlebars.compile(
      document.querySelector(settings.select.template.book).innerHTML
    );

    dataSource.books.forEach((book) => {
      const bookData = {
        id: book.id,
        name: book.name,
        price: book.price,
        rating: book.rating,
        image: book.image
      };

      const domElement = utils.createDOMFromHTML(template(bookData));

      document.querySelector(settings.select.dom.booksList).appendChild(setRatingStyle(domElement, book.rating));
    });
  };

  const getParentLink = (element) => {
    while(element.tagName !== 'A') {
      element = element.parentNode;
    }
    return element;
  };

  const favoriteClickHandler = (event) => {
    event.preventDefault();

    const elem = event.target.tagName === 'A' ? event.target : getParentLink(event.target);

    if(favoriteBooks.has(elem.dataset.id)) {
      favoriteBooks.delete(elem.dataset.id);
      elem.classList.remove(settings.class.favorite);
    } else {
      favoriteBooks.add(elem.dataset.id);
      elem.classList.add(settings.class.favorite);
    }

  };

  const filterClickHandler = (event) => {
    if(event.target.tagName === 'INPUT') {
      filters.has(event.target.value) ?
        filters.delete(event.target.value)
        :
        filters.add(event.target.value);
    }

    const renderedBooks = document.querySelectorAll('a.book__image');

    renderedBooks.forEach((book) => {
      if(book.classList.contains(settings.class.hidden)) {
        book.classList.remove(settings.class.hidden);
      }

      if(filters.size > 0) {
        const currentBook = dataSource.books.find(dataBook => dataBook.id == book.dataset.id);

        if(filters.has(settings.filter.adults) && currentBook.details.adults) {
          book.classList.add(settings.class.hidden);
        }

        if(filters.has(settings.filter.nonFiction) && currentBook.details.nonFiction) {
          book.classList.add(settings.class.hidden);
        }
      }
    });
  };

  const initActions = () => {
    document.querySelector(settings.select.dom.booksList).addEventListener('dblclick', favoriteClickHandler);
    document.querySelector(settings.select.dom.filters).addEventListener('click', filterClickHandler);
  };

  renderBooks();
  initActions();
}