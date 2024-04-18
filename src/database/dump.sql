CREATE TABLE users(
    id serial primary key,
    name VARCHAR(30) not null,
    email varchar(100) not null,
    password varchar(100) not null
);

CREATE TABLE contents(
    id serial primary key,
    title VARCHAR(30) not null,
    url varchar(100) not null,
    notes text,
    "type" VARCHAR(30) not null,
    seen BOOLEAN DEFAULT FALSE,
    consume_date TIMESTAMP,
    favorite BOOLEAN DEFAULT false,
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
    content_id integer references contents(id),
    category_id integer references categories(id)
);