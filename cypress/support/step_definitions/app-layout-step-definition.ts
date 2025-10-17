import { Then, Given } from "@badeball/cypress-cucumber-preprocessor";
import { E2E } from "../../e2e/constants";

beforeEach(() => {
  cy.visit(E2E.url);
});

Given("I can see an app header content", () => {
  cy.get(".app-header").should("have.length", 1).should("be.visible");
});

Given("I can see an app sidebar content", () => {
  cy.get(".layout-content-sidebar > .app-sidebar")
    .should("have.length", 1)
    .should("be.visible");
});
