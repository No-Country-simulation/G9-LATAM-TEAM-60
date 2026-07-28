CREATE TABLE users (
    id bigint not null GENERATED ALWAYS AS IDENTITY,
    nombre_completo varchar(150) not null,
    username varchar(100) not null,
    password varchar(200) not null UNIQUE,

    primary key(id)
)