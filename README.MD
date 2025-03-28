# Blog

## Descrição

Este é um projeto de API para um `blog` desenvolvido com `node.js`, `express.js` e `mongodb`. A API permite que os usuários criem,leiam, atualizem e excluam post do blog, bem como gerenciem suas contas de usuário. A aplicação também oferece funcionalidades de autentificar e autorização de usuários.

**Obs:** É necessário ter um arquivo .env com todos os parâmetros preenchidos.

## Funcionalidades

- **Criação de posts:** Usuários autentificados podem criar novos posts.
- **Leitura de posts:** Qualquer usuário pode visualizar os posts existentes.
- **Atualização de posts:** Usuários podem editar seus próprios posts.
- **Exclusão de posts:** Usuários podem excluir seus próprios posts.
- **Autentificação:** Usuários podem se registrar e fazer login utilizando JWT (JSON Web Token).
- **Autorização:** Somente os usuários autentificados podem criar, editar e excluir posts.

## Tecnologias

- **Node.js**: Ambiente de execução para JavaScript no lado do servidor.
- **Express**: Framework web para Node.js.
- **MongoDB**: Banco de dados NoSQL para armazenamento de dados.
- **JWT (JSON Web Token)**: Para autenticação de usuários.
- **Mongoose**: ODM para MongoDB, facilita a interação com o banco de dados.

## Requisitos

Antes de rodar o projeto, você precisa ter as seguintes ferramentas instaladas:

- **Node.js:** Baixe e instale o Node.js a partir do [site oficial](https://nodejs.org/).
- **MongoDB:** Você pode instalar o MongoDB localmente ou usar um serviço como o [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
- **Variável de Ambiente:** Crie um arquivo na raiz do projeto com o nome `.env`.

**Ex:**

```bash
PORT=3000
JWT_SECRET=****
MONGO_URL=mongodb://127.0.0.1:27017/
MONGO_NAME=****
USERNAME_ADMIN=Admin
EMAIL_ADMIN=exemplo@gmail.com
PASSWORD_ADMIN=Senha123
```

## Gerenciador de Pacotes

### Yarn

```bash
yarn install
```

## Lista de Pacotes

```bash
    "bcryptjs": "^3.0.2",
    "body-parser": "^2.2.0",
    "compression": "^1.8.0",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "express-rate-limit": "^7.5.0",
    "helmet": "^8.1.0",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.13.0",
    "morgan": "^1.10.0",
    "zod": "^3.24.2"
    "prettier": "3.5.3"
```

## Testando as Rotas

Instruções de como testar as rotas principais da API.

## Usuário

### 1. **Registrar Usuário**

- **Método:** `POST`
- **EndPoint:** `/api/user/register`
- **Corpo de Requisição:**

```json
{
  "username": "teste",
  "email": "teste@gmail.com", // É necessário um texto no estilo email
  "password": "Senha123" //A senha tem que ter no mínimo 6 caracteres e no máximo 16
}
```

### 2. **Autentificar Usuário**

- **Método:** `POST`
- **EndPoint:** `/api/user/login`
- **Corpo de Requisição:**

```json
{
  "email": "teste@gmail.com", // É necessário um texto no estilo email
  "password": "Senha123" //A senha tem que ter no mínimo 6 caracteres e no máximo 16
}
```

### 3. **Alterar Email do Usuário**

- **Método:** `PATCH`
- **EndPoint:** `/api/user/alter/email`
- **Corpo de Requisição:**

```json
{
  "userId": "id_do_usuário", //_id no estilo MongoDB
  "newEmail": "novo@gmail.com" // É necessário um texto no estilo email
}
```

### 4. **Alterar Senha do Usuário**

- **Método:** `PATCH`
- **EndPoint:** `/api/user/alter/password`
- **Corpo de Requisição:**

```json
{
  "userId": "id_do_usuário", //_id no estilo MongoDB
  "newPassword": "Nova123" // //A senha tem que ter no mínimo 6 caracteres e no máximo 16
}
```

### 5. **Deletar o Usuário**

- **Método:** `DELETE`
- **EndPoint:** `/api/user/delete`
- **Corpo de Requisição:**

```json
{
  "userId": "id_do_usuário" //_id no estilo MongoDB
}
```

## Post

### 1. **Detalhes do Post**

- **Método:** `GET`
- **EndPoint:** `/api/post/details`
- **Corpo de Requisição:**

```json
{
  "postId": "id_do_post" //_id no estilo MongoDB
}
```

### 2. **Criar um novo Post**

- **Método:** `POST`
- **EndPoint:** `/api/post/create`
- **Corpo de Requisição:**

```json
{
  "authorId": "id_do_author", // _id no estilo MongoDB
  "title": "titulo", //máximo 150 caracteres
  "content": "conteúdo", //mínimo 150 caracteres e no máximo 500 caracteres
  "categories": ["tecnologia"] //Tem que cadastrar categorias no mínimo 1 categoria no máximo 5 e o nome devem ser iguais na lista do arquivo ./src/utils/enumCategories.js
}
```

### 3. **Alterar titulo do Post**

- **Método:** `PACTH`
- **EndPoint:** `/api/post/alter/title`
- **Corpo de Requisição:**

```json
{
  "authorId": "id_do_author", // _id no estilo MongoDB
  "newTitle": "novo titulo" //máximo 150 caracteres
}
```

### 4. **Alterar titulo do Post**

- **Método:** `PACTH`
- **EndPoint:** `/api/post/alter/content`
- **Corpo de Requisição:**

```json
{
  "authorId": "id_do_author", // _id no estilo MongoDB
  "newContent": "novo conteúdo" //máximo 150 caracteres
}
```

### 5. **Alterar titulo do Post**

- **Método:** `DELETE`
- **EndPoint:** `/api/post/delete`
- **Corpo de Requisição:**

```json
{
  "authorId": "id_do_author", // _id no estilo MongoDB
  "postId": "id_do_post" // _id no estilo MongoDB
}
```

## Usuário - Admin

### 1. **Lista de Usuários**

- **Método:** `GET`
- **EndPoint:** `/api/admin/user/list`
- **Corpo de Requisição:**

```json
{
  "adminId": "id_do_admin" // _id no estilo MongoDB
}
```

### 2. **Bloquear Usuário**

- **Método:** `PATCH`
- **EndPoint:** `/api/admin/user/block`
- **Corpo de Requisição:**

```json
{
  "adminId": "id_do_admin", // _id no estilo MongoDB
  "userId": "id_do_user", // _id no estilo MongoDB
  "reason": "Você foi bloqueador por ..." // Informe o do porque o usuário foi bloqueado
}
```

### 3. **Banir Usuário**

- **Método:** `DELETE`
- **EndPoint:** `/api/admin/user/ban`
- **Corpo de Requisição:**

```json
{
  "adminId": "id_do_admin", // _id no estilo MongoDB
  "userId": "id_do_user" // _id no estilo MongoDB
}
```

## Post - Admin

### 1. **Lista de Posts**

- **Método:** `GET`
- **EndPoint:** `/api/admin/post/list`
- **Corpo de Requisição:**

```json
{
  "adminId": "id_do_admin" // _id no estilo MongoDB
}
```

### 2. **Bloquear Post**

- **Método:** `PATCH`
- **EndPoint:** `/api/admin/post/block`
- **Corpo de Requisição:**

```json
{
  "adminId": "id_do_admin", // _id no estilo MongoDB
  "postId": "id_do_post", // _id no estilo MongoDB
  "reason": "O post foi bloqueador por ..." // Informe o do porque o post foi bloqueado
}
```

### 3. **Banir Post**

- **Método:** `DELETE`
- **EndPoint:** `/api/admin/post/ban`
- **Corpo de Requisição:**

```json
{
  "adminId": "id_do_admin", // _id no estilo MongoDB
  "postId": "id_do_post" // _id no estilo MongoDB
}
```

## Author

[Vittor F. Serra](https://github.com/DevVittor) |
**Desenvolvedor FullStack**

## License MIT

[License]("")
