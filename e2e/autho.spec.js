import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { MainPage } from '../Pages/main.page';
import { RegisterPage } from '../Pages/register.page';
import { SettingsPage } from '../Pages/settings.page';
import { ArticlePage } from '../Pages/article.page';


const url='https://realworld.qa.guru/'
let newUser;
let newArticle;

test.describe("Профиль пользователя",()=>{
 
test.beforeEach('Пользователь может зарегистрироваться с помощью email пароля', async ({ page }) => {
  newUser={
     Name: faker.person.firstName('female'),
     Name2 : faker.person.firstName('female'),
     Email:faker.internet.email(),
     Password:faker.internet.password(),
     Bio:faker.music.genre(),
  }
  const mainPage = new MainPage(page);
  const registerPage = new RegisterPage(page);

     await mainPage.open(url);
     await mainPage.goToRegister();
     await registerPage.register(newUser.Name,newUser.Email,newUser.Password);

 });

test('Пользователь может изменить био', async ({ page }) => {
  const mainPage = new MainPage(page);
  const settingsPage =new SettingsPage(page);
     await mainPage.goToSettings();
     await settingsPage.updateBio(newUser.Bio);
     await expect(settingsPage.bioField).toContainText(newUser.Bio);
})

test('Пользователь может создать статью', async ({ page }) => {
  const articlePage = new ArticlePage(page);
  const mainPage = new MainPage(page);
   newArticle={
      articleTitle: faker.word.words(3),
      articleAbout: faker.word.words(5),
      articleWrigt: faker.word.words(10),
      articleTags: faker.word.words(2),
      }  
      await mainPage.goToNewArticle();
      await articlePage.createArticle(newArticle.articleTitle, newArticle.articleAbout, newArticle.articleWrigt, newArticle.articleTags)
      await expect (page.getByRole('heading', { name: newArticle.articleTitle })).toBeVisible();
});

test('Пользователь может добавить комментарий', async ({ page }) => {
  const mainPage = new MainPage(page);
  const articlePage = new ArticlePage(page);
  newArticle={
    articleTitle: faker.word.words(3),
    articleAbout: faker.word.words(5),
    articleWrigt: faker.word.words(10),
    articleTags: faker.word.words(2),
    }  
  let comment =faker.word.words(10)
      await mainPage.goToNewArticle();
      await articlePage.createArticle(newArticle.articleTitle, newArticle.articleAbout, newArticle.articleWrigt, newArticle.articleTags)
      await articlePage.addComment(comment);
      await expect(page.getByText(comment)).toBeVisible();
});

test('Пользователь может изменить имя', async ({ page }) => {
  const mainPage = new MainPage (page);
  const settingsPage = new SettingsPage(page);
  await mainPage.goToSettings();
  await settingsPage.changeName(newUser.Name2);
  await expect(settingsPage.nameField).toHaveValue(newUser.Name2);
})


 });


