import pool from "./pool";

pool.on("connect", () => {
    console.log("connected to the db");
});

/**
 * Create User Table
 */
const createUserTable = () => {
    const userCreateQuery = `CREATE TABLE "rifa"."usuario"(
    id bigserial not null primary key,
    nome varchar(250) not null,
    email varchar(250) not null,
    hash text not null,
    telefone varchar(20) not null,
    cpf varchar(14) not null,
    perfil int not null default 0,
    foto varchar(255) null,
    dt_criacao date not null default CURRENT_DATE,
    facebook text null,
    gmail text null
  )`;

    pool
        .query(userCreateQuery)
        .then((res) => {
            console.log(res);
            pool.end();
        })
        .catch((err) => {
            console.log(err);
            pool.end();
        });
};

/**
 * Create Rifa Table
 */
const createRifaTable = () => {
    const rifaCreateQuery = `CREATE TABLE "rifa"."rifa"(
      id bigserial not null primary key,
      usuario_id bigint not null,
      status varchar(15) not null default 'disponivel',
      descricao text not null,
      numeros int null,
      meta int null,
      dt_sorteio date null,
      dt_criacao date not null default current_date,
      FOREIGN KEY (usuario_id) REFERENCES usuario (id)
    );`;

    pool
        .query(rifaCreateQuery)
        .then((res) => {
            console.log(res);
            pool.end();
        })
        .catch((err) => {
            console.log(err);
            pool.end();
        });
};

/**
 * Create Rifa Premio Table
 */
const createRifaPremioTable = () => {
    const rifaPremioCreateQuery = `CREATE TABLE "rifa"."rifa_premio"(
    id bigserial not null primary key,
    rifa_id bigint not null,
    colocacao int not null default 1,
    premio text not null,
    foto varchar(255) null,
    numero_vencedor bigint null,
    dt_criacao date not null default current_date,
    FOREIGN KEY (rifa_id) REFERENCES rifa(id),
    UNIQUE(rifa_id, colocacao)
  );`;

    pool
        .query(rifaPremioCreateQuery)
        .then((res) => {
            console.log(res);
            pool.end();
        })
        .catch((err) => {
            console.log(err);
            pool.end();
        });
};

/**
 * Create Rifa Foto Table
 */
const createRifaFotoTable = () => {
    const rifaFotoCreateQuery = `CREATE TABLE "rifa"."rifa_foto"(
    id bigserial not null primary key,
    rifa_id bigint not null,
    foto varchar(255) not null,
    dt_criacao date not null default current_date,
    FOREIGN KEY (rifa_id) REFERENCES rifa(id)
  );`;

    pool
        .query(rifaFotoCreateQuery)
        .then((res) => {
            console.log(res);
            pool.end();
        })
        .catch((err) => {
            console.log(err);
            pool.end();
        });
};

/**
 * Create Rifa Numero Table
 */
const createRifaNumeroTable = () => {
    const rifaNumeroCreateQuery = `CREATE TABLE "rifa"."rifa_numero" (
    id bigserial not null primary key,
    rifa_id bigint not null,
    usuario_id bigint null,
    numero int not null default 1,
    status varchar(15) not null default 'disponivel',
    foto_comprovante varchar(255) null,
    dt_compra date null,
    dt_criacao date not null default current_date,
    FOREIGN KEY (rifa_id) REFERENCES rifa(id),
    FOREIGN KEY (usuario_id) REFERENCES usuario (id),
    UNIQUE(rifa_id, numero)
  );`;

    pool
        .query(rifaNumeroCreateQuery)
        .then((res) => {
            console.log(res);
            pool.end();
        })
        .catch((err) => {
            console.log(err);
            pool.end();
        });
};

/**
 * Drop User Table
 */
const dropUserTable = () => {
    const usersDropQuery = `DROP TABLE IF EXISTS "rifa"."usuario"`;
    pool
        .query(usersDropQuery)
        .then((res) => {
            console.log(res);
            pool.end();
        })
        .catch((err) => {
            console.log(err);
            pool.end();
        });
};

/**
 * Drop Rifa Table
 */
const dropRifaTable = () => {
    const rifaDropQuery = `DROP TABLE IF EXISTS "rifa"."rifa"`;
    pool
        .query(rifaDropQuery)
        .then((res) => {
            console.log(res);
            pool.end();
        })
        .catch((err) => {
            console.log(err);
            pool.end();
        });
};

/**
 * Drop Rifa Premio Table
 */
const dropRifaPremioTable = () => {
    const rifaPremioDropQuery = `DROP TABLE IF EXISTS "rifa"."rifa_premio"`;
    pool
        .query(rifaPremioDropQuery)
        .then((res) => {
            console.log(res);
            pool.end();
        })
        .catch((err) => {
            console.log(err);
            pool.end();
        });
};

/**
 * Drop Rifa Foto Table
 */
const dropRifaFotoTable = () => {
    const rifaFotoDropQuery = `DROP TABLE IF EXISTS "rifa"."rifa_foto"`;
    pool
        .query(rifaFotoDropQuery)
        .then((res) => {
            console.log(res);
            pool.end();
        })
        .catch((err) => {
            console.log(err);
            pool.end();
        });
};

/**
 * Drop Rifa Numero Table
 */
const dropRifaNumeroTable = () => {
    const rifaNumeroDropQuery = `DROP TABLE IF EXISTS "rifa"."rifa_numero"`;
    pool
        .query(rifaNumeroDropQuery)
        .then((res) => {
            console.log(res);
            pool.end();
        })
        .catch((err) => {
            console.log(err);
            pool.end();
        });
};

/**
 * Create All Tables
 */
const createAllTables = () => {
    createUserTable();
    createRifaTable();
    createRifaPremioTable();
    createRifaFotoTable();
    createRifaNumeroTable();
};

/**
 * Drop All Tables
 */
const dropAllTables = () => {
    dropUserTable();
    dropRifaTable();
    dropRifaPremioTable();
    dropRifaFotoTable();
    dropRifaNumeroTable();
};

pool.on("remove", () => {
    console.log("client removed");
    process.exit(0);
});

export { createAllTables, dropAllTables };

require("make-runnable");
