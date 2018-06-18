const title = '"Share Tech", sans-serif';
const text = 'Vollkorn, serif';
const url = 'http://localhost:3000';

describe('Visit the title page', () => {
    it('loads the page', () => {
        cy.visit('/');
    });

    it('has a title', () => {
        cy.contains('Book Title')
            .should('be.visible')
            .and('have.css', 'font-family', title);
    });

    it('has a cover image', () => {
        cy.get('img')
            .should('be.visible')
            .and('have.css', 'width');
    });

    it('has the correct metadata', () => {
        cy.get('head title')
            .should('contain', 'Book Title');

        cy.get('head meta[property="og:image"]')
            .should('have.attr', 'content', `${url}/index.jpg`);

    });

    it('is mobile friendly', () => {
        cy.get('head meta[name="viewport"]')
            .should('have.attr', 'content', 'width=device-width, initial-scale=1');
    });

    it('has the introduction chapter', () => {
        cy.get(':nth-child(3) > .chapter-title')
            .should('be.visible')
            .and('contain', 'Introduction')
            .and('not.contain', '1.')
            .and('have.css', 'font-family', title);

        cy.get(':nth-child(3) > .chapter-contents')
            .should('be.visible')
            .and('contain', 'Page 1')
            .and('contain', 'Page 2')
            .and('have.css', 'font-family', text);
    });

    it('has chapter 1', () => {
        cy.get(':nth-child(4) > .chapter-title')
            .should('be.visible')
            .and('contain', 'Chapter 1')
            .and('not.contain', '2.')
            .and('have.css', 'font-family', title);

        cy.get(':nth-child(4) > .chapter-contents > li > .page-entry')
            .should('be.visible')
            .and('contain', 'Title of Chapter 1')
            .and('have.css', 'font-family', text);
    });
});

describe('Click Introduction::Page 1', () => {
    it('loads the page from click', () => {
        cy.get(':nth-child(3) > .chapter-contents > :nth-child(1) > .page-entry').click();

        cy.url()
            .should('contain', '/introduction/page-1');
    });

    it('has the correct metadata', () => {
        cy.get('head meta[name=description]')
            .should('have.attr', 'content', 'summary of page 1');

        cy.get('head meta[property="og:title"]')
            .should('have.attr', 'content', 'Page 1');

        cy.get('head meta[property="og:description"]')
            .should('have.attr', 'content', 'summary of page 1');

        cy.get('head meta[property="og:site_name"]')
            .should('have.attr', 'content', 'Book Title');

        cy.get('head meta[property="og:image"]')
            .should('have.attr', 'content', `${url}/index.jpg`);

        cy.get('head meta[property="og:url"]')
            .should('have.attr', 'content', `${url}/introduction/page-1`);

        cy.get('head meta[property="og:type"]')
            .should('have.attr', 'content', 'book');
    });

    it('has a title from yaml', () => {
        cy.get('h1')
            .should('be.visible')
            .and('contain', 'Page 1')
            .and('have.css', 'font-family', title);
    });

    it('has some content', () => {
        cy.get('article > p').should('be.visible');
    });

    it('has a footer with top/chapter/next', () => {
        cy.get('footer')
            .should('be.visible')
            .and('not.be.empty');

        cy.get('.top-link')
            .should('be.visible')
            .and('contain', 'Top')
            .and('have.attr', 'href', '/');

        cy.get('.chapter-link')
            .should('be.visible')
            .and('contain', 'Chapter')
            .and('have.attr', 'href', './page-1');

        cy.get('.next-link')
            .should('be.visible')
            .and('contain', 'Page 2')
            .and('contain', '→')
            .and('have.attr', 'href', './page-2');
    });
});

describe('Page Movement', () => {
    it('loads page 2', () => {
        cy.get('.next-link').click();

        cy.url()
            .should('contain', '/introduction/page-2');

        cy.get('article > p')
            .should('be.visible')
            .and('contain', 'some content from page two');
    });

    it('has a footer with prev/top/chapter', () => {
        cy.get('footer')
            .should('be.visible')
            .and('not.be.empty');

        cy.get('.previous-link')
            .should('be.visible')
            .and('contain', 'Page 1')
            .and('contain', '←')
            .and('have.attr', 'href', './page-1');

        cy.get('.top-link')
            .should('be.visible')
            .and('contain', 'Top')
            .and('have.attr', 'href', '/');

        cy.get('.chapter-link')
            .should('be.visible')
            .and('contain', 'Chapter')
            .and('have.attr', 'href', './page-1');
    });

    it('goes back to page 1', () => {
        cy.get('.previous-link').click();

        cy.url()
            .should('contain', '/introduction/page-1');
    });

    it('goes to top', () => {
        cy.get('.top-link').click();

        cy.url()
            .should('not.contain', 'introduction');
    });

    it('goes to page 2 from top', () => {
        cy.get(':nth-child(2) > .page-entry').click();
    });

    it('goes to chapter from page 2', () => {
        cy.get('.chapter-link').click();

        cy.url()
            .should('contain', '/introduction/page-1');
    });
});
