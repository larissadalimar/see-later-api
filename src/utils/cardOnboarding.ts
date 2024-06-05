import { CreateContentDto } from "src/content/dto/create-content.dto";
import { CreateTagDto } from "src/tag/dto/create-tag.dto";

export const cardOnboarding: CreateContentDto = {
    title: 'Bem vindo ao See Later!',
    url: "https://lulugonn.github.io/see_later_app/#/",
    type: "text",
    notes: "Ao salvar um conteúdo no app, essa será a estrutura dele.",
}

export const tagOnboarding: CreateTagDto = {
    name: "Boas vindas"
};