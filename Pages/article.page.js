import {BasePage} from './base.page';
export class ArticlePage extends BasePage {
    constructor (page) {
        super (page);
        this.articleTitleField = this.page.getByPlaceholder('Article Title');
        this.articleAboutField = this.page.getByPlaceholder('What\'s this article about?');
        this.articleWrigteField = this.page.getByPlaceholder('Write your article (in');
        this.articleEnterField = this.page.getByPlaceholder('Enter tags');
        this.publishButton = this.page.getByRole('button', { name: 'Publish Article' });
        this.commentField = this.page.getByPlaceholder('Write a comment...');
        this.postCommentButton = this.page.getByRole('button', { name: 'Post Comment' });
    }

    //Создание статьи
    async createArticle(Title, About, Wrigt, Tags) {
        await this.articleTitleField.click();
        await this.articleTitleField.fill (Title);
        await this.articleAboutField.click();
        await this.articleAboutField.fill (About);
        await this.articleWrigteField.click();
        await this.articleWrigteField.fill (Wrigt);
        await this.articleEnterField.click();
        await this.articleEnterField.fill (Tags);
        await this.publishButton.click();
    }

    //Добавление комментария в статью
    async addComment(comment) {
        await this.commentField.click();
        await this.commentField.fill(comment);
        await this.postCommentButton.click();
     }   

 }