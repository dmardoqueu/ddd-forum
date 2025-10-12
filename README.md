## DDD Fórum

Este projeto é uma implementação de um fórum utilizando os princípios de Domain-Driven Design (DDD) em TypeScript. Ele possui uma arquitetura modular, separando claramente os domínios, casos de uso, entidades, repositórios e eventos de domínio.

### Estrutura do Projeto

```
src/
  core/                # Utilitários, tipos, entidades base, erros e eventos de domínio
  domain/
    forum/
      application/     # Casos de uso e repositórios do domínio de fórum
      enterprise/      # Entidades e eventos do domínio de fórum
    notification/
      application/     # Casos de uso e repositórios do domínio de notificações
      enterprise/      # Entidades do domínio de notificações
test/                  # Fábricas e repositórios em memória para testes
```

### Principais Funcionalidades

- **Perguntas e Respostas:** Criação, edição, exclusão e busca de perguntas e respostas.
- **Comentários:** Adição, edição e remoção de comentários em perguntas e respostas.
- **Anexos:** Gerenciamento de anexos em perguntas e respostas.
- **Notificações:** Envio de notificações para usuários quando eventos importantes ocorrem (ex: resposta criada, melhor resposta escolhida).
- **Eventos de Domínio:** Utilização de eventos para acionar comportamentos assíncronos e desacoplados.

### Como Executar os Testes

```sh
npm install
npm run test
```

### Tecnologias Utilizadas

- TypeScript
- Vitest (testes)
- Vite (configuração)
- Day.js (datas)
- Faker.js (dados fake para testes)

### Convenções

- Os repositórios em memória para testes estão em respositories.
- As fábricas para criação de entidades em testes estão em factories.
- Os casos de uso seguem o padrão de retorno `Either`, facilitando o tratamento de erros.

---
