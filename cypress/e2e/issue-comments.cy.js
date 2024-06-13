describe("Issue comments creating, editing and deleting", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.").click();
      });
  });

  const getIssueDetailsModal = () =>
    cy.get('[data-testid="modal:issue-details"]');

  const findAddComment = () => cy.contains("Add a comment...");

  const textareaComment = () =>
    cy.get('textarea[placeholder="Add a comment..."]');

  const saveButtonAndClick = () => cy.contains("button", "Save").click();

  const IssueComment = () => cy.get('[data-testid="issue-comment"]');

  const getConfirmationModal = () => cy.get('[data-testid="modal:confirm"]');

  function addComment(comment) {
    getIssueDetailsModal().within(() => {
      findAddComment().click();
      textareaComment().type(comment);
      saveButtonAndClick().should("not.exist");
      IssueComment().should("contain", comment);
      findAddComment().should("exist");
    });
  }

  function editComment(comment, editedcomment) {
    getIssueDetailsModal().within(() => {
      IssueComment()
        .contains(comment)
        .parent()
        .contains("Edit")
        .click()
        .should("not.exist");

      textareaComment().should("contain", comment).clear().type(editedcomment);

      saveButtonAndClick().should("not.exist");

      IssueComment().should("contain", "Edit").and("contain", editedcomment);
    });
  }

  function deleteComment(editedcomment) {
    getIssueDetailsModal();
    IssueComment().contains(editedcomment).parent().contains("Delete").click();

    getConfirmationModal().within(() => {
      cy.contains("Are you sure you want to delete this comment?").should(
        "be.visible"
      );
      cy.contains("button", "Delete comment").click().should("not.exist");
    });
    getIssueDetailsModal();
    IssueComment().should("not.contain", editedcomment);
  }

  it("Assignment 1: add, edit, delete a comment", () => {
    const comment = "COMMENT 1";
    const editedcomment = "COMMENT 1 EDITED";

    addComment(comment);

    editComment(comment, editedcomment);

    deleteComment(editedcomment);
  });
});
