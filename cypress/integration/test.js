describe('Visit the title page', () => {
    it('loads the page', () => {
        cy.visit('/');
    });

    it('has a title', () => {
        cy.contains('Book Title')
            .should('be.visible')
            .and('have.css', 'font-family')
            .and('match', /Share Tech/);
    });

    it('has a cover image', () => {
        cy.get('img')
            .should('be.visible')
            .and('have.css', 'width');
    });

    it('has the introduction chapter', () => {
        cy.get(':nth-child(3) > .chapter-title')
            .should('be.visible')
            .and('contain', 'Introduction')
            .and('not.contain', '1.')
            .and('have.css', 'font-family')
            .and('match', /Share Tech/);
    });

    it('has the chapter 1 heading', () => {
        cy.get(':nth-child(4) > .chapter-title')
            .should('be.visible')
            .and('contain', 'Chapter 1')
            .and('not.contain', '2.')
            .and('have.css', 'font-family')
            .and('match', /Share Tech/);
    });

    it('has two pages in the introduction', () => {
        cy.get(':nth-child(3) > .chapter-contents')
            .should('be.visible')
            .and('contain', 'Page 1')
            .and('contain', 'Page 2')
            .and('have.css', 'font-family')
            .and('match', /Vollkorn/);
    });
});

describe('Click Introduction::Page 1', () => {
    it('loads the page from click', () => {
        cy.get(':nth-child(3) > .chapter-contents > :nth-child(1) > .page-entry').click();
    });
});
