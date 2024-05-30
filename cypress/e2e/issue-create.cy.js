import { faker } from "@faker-js/faker";

describe("Issue create", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        // System will already open issue creating modal in beforeEach block
        cy.visit(url + "/board?modal-issue-create=true");
      });
  });

  it(
    "Should create an issue and validate it successfully",
    { timeout: 60000 },
    () => {
      // System finds modal for creating issue and does next steps inside of it
      cy.get('[data-testid="modal:issue-create"]').within(() => {
        // Type value to description input field
        cy.get(".ql-editor").type("TEST_DESCRIPTION");
        cy.get(".ql-editor").should("have.text", "TEST_DESCRIPTION");

        // Type value to title input field
        // Order of filling in the fields is first description, then title on purpose
        // Otherwise filling title first sometimes doesn't work due to web page implementation
        cy.get('input[name="title"]').type("TEST_TITLE");
        cy.get('input[name="title"]').should("have.value", "TEST_TITLE");

        // Open issue type dropdown and choose Story
        cy.get('[data-testid="select:type"]').click();
        cy.get('[data-testid="select-option:Story"]')
          .wait(1000)
          .trigger("mouseover")
          .trigger("click");
        cy.get('[data-testid="icon:story"]').should("be.visible");

        // Select Baby Yoda from reporter dropdown
        cy.get('[data-testid="select:reporterId"]').click();
        cy.get('[data-testid="select-option:Baby Yoda"]').click();

        // Select Baby Yoda from assignee dropdown
        cy.get('[data-testid="form-field:userIds"]').click();
        cy.get('[data-testid="select-option:Pickle Rick"]').click();

        // Click on button "Create issue"
        cy.get('button[type="submit"]').click();
      });

      // Assert that modal window is closed and successful message is visible
      cy.get('[data-testid="modal:issue-create"]').should("not.exist");
      cy.contains("Issue has been successfully created.").should("be.visible");

      // Reload the page to be able to see recently created issue
      // Assert that successful message has dissappeared after the reload
      cy.reload();
      cy.contains("Issue has been successfully created.").should("not.exist");

      // Assert than only one list with name Backlog is visible and do steps inside of it
      cy.get('[data-testid="board-list:backlog"]')
        .should("be.visible")
        .and("have.length", "1")
        .within(() => {
          // Assert that this list contains 5 issues and first element with tag p has specified text
          cy.get('[data-testid="list-issue"]')
            .should("have.length", "5")
            .first()
            .find("p")
            .contains("TEST_TITLE")
            .siblings()
            .within(() => {
              //Assert that correct avatar and type icon are visible
              cy.get('[data-testid="avatar:Pickle Rick"]').should("be.visible");
              cy.get('[data-testid="icon:story"]').should("be.visible");
            });
        });

      cy.get('[data-testid="board-list:backlog"]')
        .contains("TEST_TITLE")
        .within(() => {
          // Assert that correct avatar and type icon are visible
          cy.get('[data-testid="avatar:Pickle Rick"]').should("be.visible");
          cy.get('[data-testid="icon:story"]').should("be.visible");
        });
    }
  );

  it(
    "Should validate title is required field if missing",
    { timeout: 60000 },
    () => {
      // System finds modal for creating issue and does next steps inside of it
      cy.get('[data-testid="modal:issue-create"]').within(() => {
        // Try to click create issue button without filling any data
        cy.get('button[type="submit"]').click();
        // Assert that correct error message is visible
        cy.get('[data-testid="form-field:title"]').should(
          "contain",
          "This field is required"
        );
      });
    }
  );

  it("Test Case 1: Custom Issue Creation", { timeout: 60000 }, () => {
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="select-option:Bug"]')
        .wait(1000)
        .trigger("mouseover")
        .trigger("click");
      cy.get('[data-testid="icon:bug"]').should("be.visible");
      // Type value to description input field and title field
      cy.get(".ql-editor").type("My bug description");
      cy.get(".ql-editor").should("have.text", "My bug description");
      cy.get('input[name="title"]').type("Bug");
      cy.get('input[name="title"]').should("have.value", "Bug");
      //select Highest priority
      cy.get('[data-testid="select:priority"]').click();
      cy.get('[data-testid="select-option:Highest"]')
        .wait(1000)
        .trigger("mouseover")
        .trigger("click");
      cy.get('[data-testid="icon:arrow-up"]').should("be.visible");
      cy.get('[data-testid="select:reporterId"]').click();
      cy.get('[data-testid="select-option:Pickle Rick"]').click();
      cy.get('[data-testid="form-field:userIds"]').click();
      cy.get('[data-testid="select-option:Lord Gaben"]').click();
      // Click on button "Create issue"
      cy.get('button[type="submit"]').click();
    });
    // Assert that modal window is closed and successful message is visible
    cy.get('[data-testid="modal:issue-create"]').should("not.exist");
    cy.contains("Issue has been successfully created.").should("be.visible");
    // Reload the page to be able to see recently created issue
    // Assert that successful message has dissappeared after the reload
    cy.reload();
    cy.contains("Issue has been successfully created.").should("not.exist");
    // Assert than only one list with name Backlog is visible and do steps inside of it
    cy.get('[data-testid="board-list:backlog"]')
      .should("be.visible")
      .and("have.length", "1")
      .within(() => {
        // Assert that this list contains 5 issues and first element with tag p has specified text
        cy.get('[data-testid="list-issue"]')
          .should("have.length", "5")
          .first()
          .find("p")
          .contains("Bug")
          .siblings()
          .within(() => {
            cy.get('[data-testid="icon:arrow-up"]').should("be.visible");
            cy.get('[data-testid="avatar:Lord Gaben"]').should("be.visible");
            cy.get('[data-testid="icon:bug"]').should("be.visible");
          });
      });
  });

  it(
    "Test Case 2: Random Data Plugin Issue Creation",
    { timeout: 60000 },
    () => {
      const Title = faker.word.noun();
      const Description = faker.lorem.words();

      cy.get('[data-testid="modal:issue-create"]').within(() => {
        //Task is already chosen:
        cy.get('[data-testid="select:type"]').should("have.text", "Task");
        cy.get(".ql-editor").type(Description);
        cy.contains(Description).should("be.visible");
        cy.get('input[name="title"]').type(Title);
        cy.get('input[name="title"]').should("have.value", Title);
        cy.get('[data-testid="select:priority"]').click();
        cy.get('[data-testid="select-option:Low"]')
          .wait(1000)
          .trigger("mouseover")
          .trigger("click");
        cy.get('[data-testid="icon:arrow-down"]').should("be.visible");
        cy.get('[data-testid="select:reporterId"]').click();
        cy.get('[data-testid="select-option:Baby Yoda"]').click();
        cy.get('button[type="submit"]').click();
      });
      cy.get('[data-testid="modal:issue-create"]').should("not.exist");
      cy.contains("Issue has been successfully created.").should("be.visible");
      cy.reload();
      cy.contains("Issue has been successfully created.").should("not.exist");
      //Asserting
      cy.get('[data-testid="board-list:backlog"]')
        .should("be.visible")
        .and("have.length", "1")
        .within(() => {
          // Assert that this list contains 5 issues and first element with tag p has specified text
          cy.get('[data-testid="list-issue"]')
            .should("have.length", "5")
            .first()
            .find("p")
            .contains(Title)
            .siblings()
            .within(() => {
              cy.get('[data-testid="icon:arrow-down"]').should("be.visible");
              cy.get('[data-testid="icon:task"]').should("be.visible");
            });
        });
    }
  );
});
