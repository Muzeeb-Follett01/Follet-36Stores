@mode:serial
Feature: Playwright site

    @title
    Scenario: Check title with tag -3
        Given I open url "https://playwright.dev"
        When I click link "Get started"
        Then I see in title "Playwright"

    @title
    Scenario: Check title with tag-4
        Given I open url "https://www.saucedemo.com/v1/"


    Scenario: Check title - 2
        Given I open url "https://playwright.dev"
        When I click link "Get started"
        Then I see in title "Playwright"