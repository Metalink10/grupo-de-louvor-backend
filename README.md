🎸 Ministério de Louvor - API Engine
Este projeto é a "engrenagem" que faz o sistema do grupo de louvor da minha igreja funcionar. A ideia não era só criar um banco de dados, mas sim um ambiente onde a gente pudesse organizar o repertório de forma inteligente.

Aqui, eu resolvi um problema que a gente tinha: como separar o que um integrante comum vê do que um músico precisa acessar (como as cifras e os tons das músicas).

*** O que esse projeto resolve no mundo real?
Diferente de uma lista simples, eu criei uma hierarquia de acesso. Por exemplo:

Integrantes (USER): Conseguem ver as letras e buscar os hinos para acompanhar.

Músicos (MUSICIAN): Têm acesso às cifras, tons das músicas, editar a letra do louvor também e podem subir arquivos de partituras ou PDF.

Administradores (ADMIN): Têm o controle total, inclusive para remover músicas que não fazem mais parte do repertório.

*** O que eu coloquei de "mão na massa" aqui:
Upload de Arquivos (Multer): Eu não queria que o sistema aceitasse só texto. Configurei o Multer para que os músicos consigam fazer o upload de arquivos de cifras reais, que ficam salvos no servidor.

Busca Inteligente: Criei um sistema de filtro que aceita busca por ID, número do hino ou título. E o melhor: a busca por título é "insensitiva" (não importa se você digita maiúsculo ou minúsculo, o sistema acha).

Controle de Numeração Automática: Fiz uma lógica no Prisma que busca o último hino cadastrado e já sugere o próximo número. Parece simples, mas evita uma bagunça gigante no repertório.

Middlewares de Proteção: Sabe aquela segurança de "você não tem permissão para acessar essa rota"? Eu criei um middleware que valida o cargo (Role) do usuário antes de deixar ele chegar no Controller.

*** Etapas que me fizeram "quebrar a cabeça":
Lógica de Filtros Dinâmicos: No buscarHino, eu tive que aprender a montar um objeto de filtro que só adiciona os campos que o usuário realmente preencheu na busca. Se ele não preencher nada, o sistema não quebra.

Organização de Pastas: Como o projeto cresceu, eu tive que separar tudo em controllers, routes, middlewares e config. Foi onde eu realmente entendi por que a gente não coloca todo o código em um arquivo só.
E até  então, eu não tinha conhecimento das pastas " CONTROLLER, MIDLLEWARE e CONFIG que servem para organização das rotas de segurança e autenticação de usuários.

Persistência com Prisma: Manipular o banco de dados para buscar o hino de maior número (orderBy: { numero: "desc" }) e incrementar foi um exercício de lógica muito bom.

*** O que aindda preciso fazer nesse projeto?
Ainda preciso criar a rota de recuperção de senha.
E também pretendo inverter a sequência de salvemento dos louvores
Hoje os hinos novos vão para o final da página, fazendo com que cada ensaio a gente tenha que ir até o final da  página para achar o louvor.
Pretendo inverter isso para ter mais praticidade e agilidade na hora dos ensaios.

*** Tech Stack:
Node.js & Express (O motor de tudo)
Prisma ORM (Conexão com o banco de dados)

Multer (Para lidar com os uploads de arquivos de cifras)

JWT & Bcrypt (Segurança e "crachá" de acesso)
