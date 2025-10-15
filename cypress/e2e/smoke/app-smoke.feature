Feature: App Shell Smoke

  As a visitor
  I want to load the app
  So that I can see the main wrappers (root, header, sidebar, content)

  Background:
    Given I visit the home page

  Scenario: App base wrappers are present
    Then I should see the app root
    And I should see the app header
    And I should see the app sidebar
    And I should see the app content
