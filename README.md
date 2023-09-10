# Introduction 
TODO: Give a short introduction of your project. Let this section explain the objectives or the motivation behind this project. 

# Getting Started
TODO: Guide users through getting your code up and running on their own system. In this section you can talk about:
1.	Installation process
2.	Software dependencies
3.	Latest releases
4.	API references

# Build and Test
TODO: Describe and show how to build your code and run the tests. 

# Contribute
TODO: Explain how other users and developers can contribute to make your code better. 

If you want to learn more about creating good readme files then refer the following [guidelines](https://docs.microsoft.com/en-us/azure/devops/repos/git/create-a-readme?view=azure-devops). You can also seek inspiration from the below readme files:
- [ASP.NET Core](https://github.com/aspnet/Home)
- [Visual Studio Code](https://github.com/Microsoft/vscode)
- [Chakra Core](https://github.com/Microsoft/ChakraCore)


CREATE TABLE concierge.kitchen (
	id serial not null primary key,
	name VARCHAR(75) not null ,
	created_at timestamp  not null default now(),
	updated_at timestamp  null
);

CREATE TABLE concierge.rooms (
	id serial not null primary key,
	name VARCHAR(75) not null ,
	kitchen_id int not null,
	ip varchar(255) not null,
	description varchar(255),
	created_at timestamp  not null default now(),
	updated_at timestamp  null
);

CREATE TABLE concierge.products (
	id serial not null primary key,
	name VARCHAR(75) not null ,
	code varchar(255) not null,
	status int not null default 0,
	created_at timestamp  not null default now(),
	updated_at timestamp  null
);

CREATE TABLE concierge.orders (
	id serial not null primary key,
	nome VARCHAR(75) not null ,
	room_id int not null,
	kitchen_id int not null,
	created_at timestamp  not null default now(),
	updated_at timestamp  null,
	status varchar(255)
);