describe('Visit the title page', () => {
    it('loads the page', () => {
        cy.visit('/');
    });
    it('has a title', () => {
        cy.contains('Book Title').should('be.visible');
    });
    it('has a cover image', () => {
        cy.get('img').should('be.visible');
    });
    it('has chapters', () => {
        cy.get('#chapter-page-content').should('have.descendants', 'section');
    });
});
