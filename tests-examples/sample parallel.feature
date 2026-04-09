@mode:serial
Feature: Playwright site
    
    @title
    Scenario: Check title with tag-1
        Given I open url "https://google.com"

    @title
    Scenario: Check title with tag-2
        Given I open url "https://cricinfo.com"
        

    Scenario: Check title - 2
        Given I open url "https://playwright.dev"
        When I click link "Get started"
        Then I see in title "Playwright"