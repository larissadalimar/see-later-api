import { CreateContentDto } from "src/content/dto/create-content.dto";

export const cardOnboarding: CreateContentDto = {
    title: 'Bem vindo ao See Later!',
    url: "https://lulugonn.github.io/see_later_app/#/",
    type: "text",
    notes: "Ao salvar um conteúdo no app, essa será a estrutura dele. O link será a url do conteúdo salvo, o tipo significa o tipo de mídia caso seja vídeo, artigo, entre outros",
    categories: [1]
}