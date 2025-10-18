import { Then } from "@badeball/cypress-cucumber-preprocessor";

Then("I can see an app header content", () => {
  cy.get(".app-header").should("be.visible");
});

Then("I can see an app sidebar content", () => {
  cy.get(".layout-content-sidebar > .app-sidebar").should("be.visible");
});

Then("I can see an app main content", () => {
  cy.get(".layout-content-main > .home-page").should("be.visible");
});

export {};
