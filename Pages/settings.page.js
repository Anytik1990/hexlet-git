import { BasePage} from './base.page'
export class SettingsPage extends BasePage{
    constructor(page){
        super(page)
        this.bioField=this.page.getByPlaceholder('Short bio about you');
        this.updateButton = this.page.getByRole('button', 'Update Settings');
        this.nameField = this.page.getByPlaceholder('Your Name');
    }

// Изменение био пользователя
    async updateBio(userBio) {
        await this.bioField.click();
        await this.bioField.fill(userBio);
        await this.updateButton.click();
    }

// Изменение имени пользователя
    async changeName (userName) {
        await this.nameField.click();
        await this.nameField.fill(userName);
        await this.updateButton.click();
    }
}