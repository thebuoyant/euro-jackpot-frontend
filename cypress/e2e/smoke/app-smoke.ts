import { Given, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("I visit the home page", () => {
  cy.visit("/");
});

Then("I should see the app root", () => {
  cy.get('[data-testid="app-root"]').should("exist").and("be.visible");
});

Then("I should see the app header", () => {
  cy.get('[data-testid="app-header"]').should("exist").and("be.visible");
});

Then("I should see the app sidebar", () => {
  cy.get('[data-testid="app-sidebar"]').should("exist").and("be.visible");
});

Then("I should see the app content", () => {
  cy.get('[data-testid="app-content"]').should("exist").and("be.visible");
});
