describe('Test suite for issue deleting', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
        cy.visit(url + '/board');
        cy.contains('This is an issue of type: Task.').click();
      });
    });
    const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');

    it('Test Case 1: Issue Deletion', { timeout: 60000 },() => {
        getIssueDetailsModal().within(() => {
        cy.get('[data-testid="icon:trash"]').click(); 
    });
        //Confirmation window opening assertion
        cy.get('[data-testid="modal:confirm"]').should('be.visible').within(() => {
        cy.contains('Delete issue').click();
    });
    //Assert that the confirmation window closes and issue window closes
        cy.get('[data-testid="modal:confirm"]').should('not.exist')
        cy.get('[data-testid="modal:issue-details"]').should('not.exist')
    //Assert 3 elements left on the Backlog list
        cy.get('[data-testid="board-list:backlog"]')
            .should('be.visible')
            .and('have.length', '1')
            .within(() => {
        cy.get('[data-testid="list-issue"]')
            .should('have.length', '3')
            .first()
            .find('p')
            .contains("Click on an issue to see what's behind it.")
        });   
    });

    it('Test Case 2: Issue Deletion Cancellation', { timeout: 60000 },() => {
        getIssueDetailsModal().within(() => {
        cy.get('[data-testid="icon:trash"]').click(); 
        });
        cy.get('[data-testid="modal:confirm"]').should('be.visible').within(() => {
        //Click Cancel
        cy.contains('Cancel').click();
        });
        cy.get('[data-testid="modal:confirm"]').should('not.exist')
        //Close the issue window by clicking on x
        cy.get('[data-testid="icon:close"]')
            .first()   
            .click()
        cy.get('[data-testid="modal:issue-create"]').should('not.exist')
        //Assert 4 elements are still on the Backlog list
        cy.get('[data-testid="board-list:backlog"]')
            .should('be.visible')
            .and('have.length', '1')
            .within(() => {
        cy.get('[data-testid="list-issue"]')
            .should('have.length', '4')
            .first()
            .find('p')
            .contains('This is an issue of type: Task.')    
        });   
    });
 });
