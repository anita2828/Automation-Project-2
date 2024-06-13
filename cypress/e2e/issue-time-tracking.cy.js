import IssueTimeModal from "../pages/IssueTimeModal";
import { faker } from "@faker-js/faker";
describe("Assignment 2: Issue time tracking", () => {
  const title = faker.lorem.word(9);
  const description = faker.lorem.words(10);
  const originalEstimate = "10";
  const expectedAmountOfIssues = 5;
  const newOriginalEstimate = "20";
  const timeSpent = "2";
  const timeRemaining = "5";

  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board?modal-issue-create=true");
      });
  });

  it("Add, Edit, Remove Estimation", () => {
    IssueTimeModal.addIssueAndAssert(
      description,
      title,
      expectedAmountOfIssues
    );

    cy.log("add estimation");
    IssueTimeModal.openCreatedIssue(title);
    IssueTimeModal.AddEstimationToIssuesModalAndClose(originalEstimate);

    cy.log("edit estimation");
    IssueTimeModal.openCreatedIssue(title);
    IssueTimeModal.AddEstimationToIssuesModalAndClose(newOriginalEstimate);

    cy.log("remove estimation");
    IssueTimeModal.openCreatedIssue(title);
    IssueTimeModal.AddEstimationToIssuesModalAndClose("");
  });

  it("Time logging functionality", () => {
    IssueTimeModal.addIssueAndAssert(
      description,
      title,
      expectedAmountOfIssues
    );
    IssueTimeModal.openCreatedIssue(title);
    IssueTimeModal.AddEstimationToIssuesModal(originalEstimate);

    cy.log("Log timeSpent and timeRemaining");
    IssueTimeModal.logTimeSpentAndRemaining(timeSpent, timeRemaining);
    IssueTimeModal.assertTimeSpentAndRemaining(timeSpent, timeRemaining);

    cy.log("Remove time spent and time remaining");
    IssueTimeModal.removeTimeSpentAndRemaining();
    IssueTimeModal.assertOriginalEstimate(originalEstimate);
  });
});
