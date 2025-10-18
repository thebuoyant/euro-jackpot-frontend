import { Then, Given } from "@badeball/cypress-cucumber-preprocessor";
import { E2E } from "../../e2e/constants";

beforeEach(() => {
  // 1) Viewport setzen
  cy.viewport(E2E.viewport.width, E2E.viewport.height);

  // 2) Resolution-Guard im localStorage deaktivieren *vor* dem Laden
  cy.visit(E2E.url, {
    onBeforeLoad(win) {
      win.localStorage.setItem(E2E.resolutionGuardStorageKey, "true");
    },
  });
});

Given("I am on application page", () => {
  cy.get("#app.layout-definition").should("be.visible");
});

Then("I can see all base layout wrappers", () => {
  cy.get(".layout-definition > .layout-header").should("be.visible");
  cy.get(".layout-definition > .layout-content").should("be.visible");
});

export {};
