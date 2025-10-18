import { Then } from "@badeball/cypress-cucumber-preprocessor";

Then("I can see an app header title {string}", (title: string) => {
  cy.get(".layout-header").should("be.visible");
  cy.get(".layout-header").contains(title);
});

export {};
