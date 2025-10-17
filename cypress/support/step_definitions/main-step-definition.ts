import { Then, Given } from "@badeball/cypress-cucumber-preprocessor";
import { E2E } from "../../e2e/constants";

beforeEach(() => {
  cy.visit(E2E.url);
});

Given("I am on application page", () => {
  cy.get("#app.layout-definition")
    .should("have.length", 1)
    .should("be.visible");
});

Then("I can see all base layout wrappers", () => {
  cy.get(".app-layout > .header").should("have.length", 1).should("be.visible");
  cy.get(".app-layout > .content")
    .should("have.length", 1)
    .should("be.visible");
});
