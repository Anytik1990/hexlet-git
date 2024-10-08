import {BasePage} from './base.page';

export class MainPage extends BasePage {
constructor (page) {
    super(page);
    this.menuButton = this.page.locator('.dropdown-toggle');
    this.settingsButton = this.page.getByRole ('link', { name: 'Settings' });
    this.signupButton = this.page.getByRole ('link', { name: 'Sign up' });
    this.newArticleButton = this.page.getByRole('link', { name: 'New Article' });
    this.logoutButton = this.page.getByRole ('link', { name: 'Logout' });
    
    
}
//Переход на страницу регистрации
async goToRegister () {
    await this.signupButton.click();
}
//Переход на страницу настроек профиля
async goToSettings () {
    await this.menuButton.click();
    await this.settingsButton.click();
}
//Выход из профиля
async goToLogout () {
    await this.menuButton.click();
    await this.logoutButton.click();
}
//Переход на страницу добавления статьи
async goToNewArticle () {
    await this.newArticleButton.click();
}

}