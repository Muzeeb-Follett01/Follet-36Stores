import { Page } from "playwright";
import { expect } from "@playwright/test";
import { BasePage } from "./basePage";

export class TodoPage extends BasePage {
    
    constructor(public readonly page: Page) {
        super(page);
    }

    // Locators
    get newTodoInput() {
        return this.page.getByPlaceholder('What needs to be done?');
    }

    get todoItems() {
        return this.page.getByTestId('todo-title');
    }

    // Methods
    async addNewTodo(todoitem: string) {
        await this.newTodoInput.fill(todoitem);
        await this.newTodoInput.press('Enter');
        return this;
    }

    async verifyTodoItems(itemlist: string) {
        const TODO_ITEMS = itemlist.split(',').map(item => item.trim());
        await expect(this.todoItems).toHaveText(TODO_ITEMS);
        return this;
    }
}
