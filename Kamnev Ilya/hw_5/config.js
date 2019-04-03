module.exports = {
    rbc: { 
        url: 'https://www.rbc.ru/',
        name: 'РБК',
        selectors: [
            '.main__feed__link',
            '.article__text__overview',
        ],
    },
    ngs: {
        url: 'https://news.ngs.ru/',
        name: 'НГС',
        selectors: [
            '.ribbon-news-carousel__link',
            '.article__subtitle-text',
        ],
    },
}