import IssueModal from "../../pages/IssueModal";

describe("Issue delete", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        //open issue detail modal with title from below (const issueTitle)
        cy.contains(issueTitle).click();
      });
  });

  //issue title, that we are testing with, saved into variable
  const issueTitle = "This is an issue of type: Task.";

  it("Should delete issue successfully", () => {
    const expectedAmountOfIssuesAfterDelete = 3;

    IssueModal.clickDeleteButton();
    IssueModal.confirmDeletion();
    IssueModal.ensureIssueIsNotVisibleOnBoard(issueTitle);
    IssueModal.validateAmountOfIssuesInBacklog(
      expectedAmountOfIssuesAfterDelete
    );
  });

  it("Should cancel deletion process successfully", () => {
    const expectedAmountOfIssuesAfterCancel = 4;

    IssueModal.clickDeleteButton();
    IssueModal.cancelDeletion();
    IssueModal.closeDetailModal();
    IssueModal.validateIssueVisibilityState(issueTitle, true);
    IssueModal.validateAmountOfIssuesInBacklog(
      expectedAmountOfIssuesAfterCancel
    );
  });
});
