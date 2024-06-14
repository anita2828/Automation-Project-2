describe("Issue details editing", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.").click();
      });
  });

  const getCreateIssueModal = () =>
    cy.get('[data-testid="modal:create-issue"]');
  const getIssueDetailsModal = () =>
    cy.get('[data-testid="modal:issue-details"]');
  const selectors = {
    prioritySelect: '[data-testid="select:priority"]',
    priorityOptions: '[data-testid^="select-option:"]',
    reporterName: '[data-testid="select:reporter"]',
  };

  it("Should update type, status, assignees, reporter, priority successfully", () => {
    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="select:type"]').click("bottomRight");
      cy.get('[data-testid="select-option:Story"]')
        .trigger("mouseover")
        .trigger("click");
      cy.get('[data-testid="select:type"]').should("contain", "Story");

      cy.get('[data-testid="select:status"]').click("bottomRight");
      cy.get('[data-testid="select-option:Done"]').click();
      cy.get('[data-testid="select:status"]').should("have.text", "Done");

      cy.get('[data-testid="select:assignees"]').click("bottomRight");
      cy.get('[data-testid="select-option:Lord Gaben"]').click();
      cy.get('[data-testid="select:assignees"]').click("bottomRight");
      cy.get('[data-testid="select-option:Baby Yoda"]').click();
      cy.get('[data-testid="select:assignees"]').should("contain", "Baby Yoda");
      cy.get('[data-testid="select:assignees"]').should(
        "contain",
        "Lord Gaben"
      );

      cy.get('[data-testid="select:reporter"]').click("bottomRight");
      cy.get('[data-testid="select-option:Pickle Rick"]').click();
      cy.get('[data-testid="select:reporter"]').should(
        "have.text",
        "Pickle Rick"
      );

      cy.get('[data-testid="select:priority"]').click("bottomRight");
      cy.get('[data-testid="select-option:Medium"]').click();
      cy.get('[data-testid="select:priority"]').should("have.text", "Medium");
    });
  });

  it("Should update title, description successfully", () => {
    const title = "TEST_TITLE";
    const description = "TEST_DESCRIPTION";

    getIssueDetailsModal().within(() => {
      cy.get('textarea[placeholder="Short summary"]')
        .clear()
        .type(title)
        .blur();

      cy.get(".ql-snow").click().should("not.exist");

      cy.get(".ql-editor").clear().type(description);

      cy.contains("button", "Save").click().should("not.exist");

      cy.get('textarea[placeholder="Short summary"]').should(
        "have.text",
        title
      );
      cy.get(".ql-snow").should("have.text", description);
    });
  });

  it("Bonus assignment: checking the dropdown “Priority”", () => {
    const expectedLength = 5;
    const expectedPriorities = ["Lowest", "Low", "Medium", "High", "Highest"];
    let priorities = [];

    getIssueDetailsModal().within(() => {
      cy.get(selectors.prioritySelect)
        .invoke("text")
        .then((initialPriority) => {
          cy.log(`Initial priority: ${initialPriority.trim()}`);

          cy.get(selectors.prioritySelect).click("bottomRight");

          cy.get(selectors.priorityOptions)
            .each(($option) => {
              cy.wrap($option)
                .invoke("text")
                .then((text) => {
                  text = text.trim();
                  if (!priorities.includes(text)) {
                    priorities.push(text);
                  }
                  cy.log(`Added value: ${text}`);
                  cy.log(`Array length: ${priorities.length}`);
                });
            })
            .then(() => {
              if (!priorities.includes(initialPriority.trim())) {
                priorities.push(initialPriority.trim());
              }
              cy.log(`Final priorities array before sorting: ${priorities}`);

              priorities.sort();
              expectedPriorities.sort(); // Sort expectedPriorities array

              cy.log(`Final priorities array after sorting: ${priorities}`);

              cy.wrap(priorities).should("have.length", expectedLength);
              cy.wrap(priorities).should("deep.equal", expectedPriorities);
            });
        });
    });
  });

  it("Bonus assignment: Validate reporter name format", () => {
    getIssueDetailsModal().within(() => {
      cy.get(selectors.reporterName)
        .invoke("text")
        .then((reporterText) => {
          cy.log(`Reporter's name: ${reporterText}`);

          // Assert using regular expression to check if reporterText contains only alphabetic characters and spaces
          const regex = /^[A-Za-z\s]+$/;
          expect(reporterText.trim()).to.match(regex);
        });
    });
  });

  it("Bonus assignment: Removal of unnecessary spaces in issue title", () => {
    const titleWithSpaces = "  Hello     world!  ";
    const expectedTrimmedTitle = "Hello world!";

    // Edit the issue title within the existing issue details view
    cy.get('[data-testid="modal:issue-details"]').within(() => {
      cy.get('textarea[placeholder="Short summary"]')
        .clear()
        .type(titleWithSpaces)
        .blur(); // Trigger blur event to simulate leaving the field
    });

    // Close the issue details modal (assuming there's a close button)
    cy.get('[data-testid="icon:close"]').first().click();

    // Wait for the board list to be visible
    cy.get('[data-testid="board-list:backlog"]').should("be.visible");

    // Get the title of the first issue on the board (assumed to be the edited one)
    cy.get('[data-testid="board-list:backlog"] a[data-testid="list-issue"] p')
      .first()
      .invoke("text")
      .then((actualTitle) => {
        // Trim the actual title to compare with expectedTrimmedTitle
        //const trimmedActualTitle = actualTitle.trim();
        const trimmedActualTitle = actualTitle.replace(/\s+/g, ' ').trim();
        // Assert that the trimmed actual title matches the expected trimmed title
        expect(trimmedActualTitle).to.equal(expectedTrimmedTitle);
      });
  });
});