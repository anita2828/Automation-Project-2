class IssueTimeModal {
  constructor() {
    this.issueModal = '[data-testid="modal:issue-create"]';
    this.issueDetailModal = '[data-testid="modal:issue-details"]';
    this.titleField = 'input[name="title"]';
    this.descriptionField = ".ql-editor";
    this.submitButton = 'button[type="submit"]';
    this.backlogList = '[data-testid="board-list:backlog"]';
    this.issuesList = '[data-testid="list-issue"]';
    this.issueSuccess = "Issue has been successfully created.";
    this.closeIssueModalButton = '[data-testid="icon:close"]';
    this.hoursEstimationInput = 'input[placeholder="Number"]';
    this.timeTrackingButton = ".sc-bnXvFD.eorMUq";
    this.timeTrackingPopup = ".sc-fjdhpX.bfaiea";
    this.timeSpentInput = 'input[placeholder="Number"]';
    this.timeRemainingInput = 'input[placeholder="Number"]';
  }

  getIssueModal() {
    return cy.get(this.issueModal);
  }

  getIssueDetailModal() {
    return cy.get(this.issueDetailModal);
  }

  addDescriptionAndAssert(description) {
    cy.get(this.descriptionField).type(description);
    cy.get(this.descriptionField).should("have.text", description);
  }

  addTitleAndAssert(title) {
    cy.get(this.titleField).type(title);
    cy.get(this.titleField).should("have.value", title);
  }

  createIssue(description, title) {
    this.getIssueModal().within(() => {
      // adding and asserting only description and title as mandatory fields
      this.addDescriptionAndAssert(description);
      this.addTitleAndAssert(title);
      // Click on button "Create issue" = save issue
      cy.get(this.submitButton).click();
    });
  }
  ensureIssueIsCreated(expectedAmountOfIssues, title) {
    cy.get(this.issueModal).should("not.exist");
    cy.contains(this.issueSuccess).should("be.visible");
    cy.reload();
    cy.contains(this.issueSuccess).should("not.exist");

    cy.get(this.backlogList)
      .should("be.visible")
      .and("have.length", "1")
      .within(() => {
        cy.get(this.issuesList)
          .should("have.length", expectedAmountOfIssues)
          .first()
          .find("p")
          .contains(title);
      });
  }

  addIssueAndAssert(description, title, expectedAmountOfIssues) {
    this.createIssue(description, title);
    // Assert that modal window is closed and successful message is visible
    this.ensureIssueIsCreated(expectedAmountOfIssues, title);
  }

  openCreatedIssue(title) {
    cy.get(this.backlogList).contains(title).click({ force: true });
  }

  closeIssue() {
    cy.get(this.closeIssueModalButton).first().click({ force: true });
  }

  setOriginalEstimate(value) {
    if (value === "") {
      cy.get(this.hoursEstimationInput)
        .clear()
        .should("have.attr", "placeholder", "Number"); // Ensure the placeholder is visible
    } else {
      cy.get(this.hoursEstimationInput)
        .clear()
        .type(value)
        .should("have.value", value);
    }
  }

  AddEstimationToIssuesModalAndClose(value) {
    this.AddEstimationToIssuesModal(value);
    this.closeIssue();
    cy.get('[data-testid="modal:issue-details"]').should("not.exist");
  }

  AddEstimationToIssuesModal(value) {
    cy.get(this.issueDetailModal)
      .should("be.visible")
      .within(() => {
        this.setOriginalEstimate(value);
        cy.wait(1000);
      });
  }

  logTimeSpentAndRemaining(timeSpent, timeRemaining) {
    cy.get(this.timeTrackingButton).click({ force: true });
    cy.get(this.timeTrackingPopup)
      .should("be.visible")
      .within(() => {
        cy.contains("Time spent (hours)")
          .parent()
          .find(this.timeSpentInput)
          .clear()
          .type(timeSpent, { force: true });
        cy.contains("Time remaining (hours)")
          .parent()
          .find(this.timeRemainingInput)
          .clear()
          .type(timeRemaining, { force: true });
        cy.contains("Done").click({ force: true });
      });
    cy.get(this.timeTrackingPopup).should("not.exist");
  }

  assertTimeSpentAndRemaining(timeSpent, timeRemaining) {
    cy.get(this.issueDetailModal).within(() => {
      cy.contains("No time logged").should("not.exist");
      cy.get(".sc-rBLzX.irwmBe div:first-child").should(
        "have.text",
        `${timeSpent}h logged`
      );
      cy.get(".sc-rBLzX.irwmBe div:last-child").should(
        "have.text",
        `${timeRemaining}h remaining`
      );
    });
  }

  removeTimeSpentAndRemaining() {
    cy.get(this.issueDetailModal)
      .should("be.visible")
      .within(() => {
        cy.get(this.timeTrackingButton).click({ force: true });
      });
    cy.get(this.timeTrackingPopup)
      .should("be.visible")
      .within(() => {
        cy.contains("Time spent (hours)")
          .parent()
          .find(this.timeSpentInput)
          .clear();
        cy.contains("Time remaining (hours)")
          .parent()
          .find(this.timeRemainingInput)
          .clear();
        cy.contains("Done").click({ force: true });
      });
  }

  assertOriginalEstimate(originalEstimate) {
    cy.get(this.issueDetailModal).within(() => {
      cy.get(".sc-rBLzX.irwmBe div:last-child").should(
        "have.text",
        `${originalEstimate}h estimated`
      );
    });
  }
}
export default new IssueTimeModal();
