CREATE TABLE users(
    id serial primary key,
    name VARCHAR(30) not null,
    email varchar(50) not null,
    password varchar(10) not null
);

CREATE TABLE contents(
    id serial primary key,
    title VARCHAR(30) not null,
    url varchar(100) not null,
    notes text,
    "userId" integer references users(id),
    "createdAt" TIMESTAMP DEFAULT now() NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT now() NOT NULL
);

CREATE TABLE categories(
    id serial primary key,
    name VARCHAR(30) not null,
    "userId" integer references users(id),
    "createdAt" TIMESTAMP DEFAULT now() NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT now() NOT NULL
);

CREATE TABLE category_content(
    id serial primary key,
    "contentId" integer references contents(id),
    "categoryId" integer references users(id)
);