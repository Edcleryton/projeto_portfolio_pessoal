# Backlog de Histórias de Usuário: Gerir.me

## Épico: Gerenciamento de Contas de Usuário

### HU01: Cadastro de Novo Usuário
**Eu, como** um novo visitante, **quero** me cadastrar na plataforma, **para que** eu possa começar a gerenciar minhas despesas.

**Critérios de Aceite:**
- Dado que eu preenchi o formulário com nome, e-mail válido e senha
- E a senha atende à política de segurança (mínimo 8 caracteres, com letras e números)
- Quando eu clico em "Cadastrar"
- Então, minha conta deve ser criada e eu devo ser direcionado para o dashboard
- O sistema não deve permitir o cadastro de um e-mail já existente

### HU02: Login de Usuário
**Eu, como** um usuário cadastrado, **quero** fazer login na minha conta, **para que** eu possa acessar e controlar minhas finanças.

**Critérios de Aceite:**
- Dado que eu estou na página de login
- Quando eu insiro meu e-mail e senha corretos
- Então, eu devo ser autenticado e levado ao meu dashboard principal
- Se as credenciais estiverem erradas, uma mensagem de erro deve ser exibida

## Épico: Gerenciamento de Despesas

### HU03: Adicionar Nova Despesa (Única ou Recorrente)
**Eu, como** um usuário logado, **quero** registrar tanto despesas únicas quanto recorrentes, atribuindo um nome, valor e categoria, **para que** eu possa ter um controle completo dos meus gastos.

**Critérios de Aceite:**
- Dado que eu iniciei o cadastro de uma nova despesa
- O sistema deve me permitir escolher o tipo: "Única" ou "Recorrente"
- Se eu escolher "Única", o formulário deve solicitar a "Data da Despesa"
- Se eu escolher "Recorrente", o formulário deve solicitar o "Ciclo de Cobrança" e a "Próxima Data de Cobrança"
- Os campos "Nome", "Valor" e "Categoria" são sempre obrigatórios
- Quando eu salvar, a despesa deve ser adicionada à minha lista

### HU04: Visualizar Lista de Despesas
**Eu, como** um usuário logado, **quero** ver uma lista de todas as minhas despesas cadastradas, **para que** eu tenha uma visão geral de para onde meu dinheiro está indo.

**Critérios de Aceite:**
- A lista deve exibir as colunas: Nome, Valor, Categoria e Data (Data da Despesa para as únicas, Próxima Cobrança para as recorrentes)
- Deve haver uma indicação visual clara para diferenciar despesas "Únicas" de "Recorrentes"
- Se a lista estiver vazia, uma mensagem incentivando o primeiro cadastro deve ser exibida

### HU05: Editar uma Despesa Existente
**Eu, como** um usuário logado, **quero** editar os detalhes de uma despesa já lançada, **para que** eu possa corrigir erros ou atualizar informações.

**Critérios de Aceite:**
- Dado que eu selecionei uma despesa para editar
- O formulário deve vir preenchido com todos os dados daquela despesa
- Eu devo poder alterar qualquer campo, inclusive o tipo (de "Única" para "Recorrente" e vice-versa)
- Ao salvar, as informações devem ser atualizadas na lista e nos cálculos do dashboard

### HU06: Remover uma Despesa
**Eu, como** um usuário logado, **quero** remover um lançamento de despesa, **para que** meu relatório financeiro permaneça preciso.

**Critérios de Aceite:**
- Dado que eu cliquei para remover uma despesa
- Uma mensagem de confirmação deve ser exibida para evitar exclusão acidental
- Após confirmar, a despesa deve desaparecer da lista
- O total no dashboard deve ser recalculado imediatamente

## Épico: Visualização de Dados

### HU07: Dashboard de Gasto Mensal
**Eu, como** um usuário logado, **quero** ver um dashboard com o meu gasto total no mês corrente, **para que** eu possa entender rapidamente minha situação financeira.

**Critérios de Aceite:**
- O dashboard deve exibir um valor total de destaque
- O cálculo deve seguir a regra de negócio: (soma das recorrentes mensais) + (soma das recorrentes anuais / 12) + (soma das despesas únicas lançadas no mês atual)
- O valor deve ser atualizado em tempo real após qualquer adição, edição ou remoção de despesas

### HU08: Calendário de Pagamentos Futuros
**Eu, como** um usuário logado, **quero** visualizar um calendário com as datas das minhas próximas despesas recorrentes, **para que** eu possa me planejar para os pagamentos.

**Critérios de Aceite:**
- O calendário deve marcar os dias que correspondem à "Próxima Data de Cobrança" das despesas recorrentes
- Despesas do tipo "Única" não devem aparecer no calendário
- Ao clicar ou passar o mouse sobre um dia marcado, os nomes das despesas correspondentes devem ser exibidos
- Deve ser possível navegar entre os meses

### HU09: Filtrar Despesas por Categoria
**Eu, como** um usuário logado, **quero** filtrar minhas despesas por categoria, **para que** eu possa analisar gastos específicos de cada área.

**Critérios de Aceite:**
- Deve haver um filtro dropdown com todas as categorias disponíveis
- Ao selecionar uma categoria, apenas despesas dessa categoria devem ser exibidas
- Deve haver uma opção "Todas" para remover o filtro
- O filtro deve funcionar tanto para despesas únicas quanto recorrentes

### HU10: Notificações de Vencimento
**Eu, como** um usuário logado, **quero** receber notificações sobre despesas que vencem em breve, **para que** eu não esqueça de realizar os pagamentos.

**Critérios de Aceite:**
- O sistema deve notificar sobre despesas com vencimento em até 3 dias
- As notificações devem aparecer automaticamente quando eu acessar o sistema
- Deve funcionar tanto para despesas únicas quanto recorrentes
- O usuário deve poder permitir ou negar notificações do navegador

### HU11: Alternância entre Modo Claro e Escuro
**Eu, como** um usuário, **quero** alternar entre modo claro e escuro na interface, **para que** eu possa usar o aplicativo confortavelmente em diferentes ambientes de iluminação.

**Critérios de Aceite:**
- Deve haver um botão de alternância visível no cabeçalho da aplicação
- O botão deve mostrar o ícone apropriado (lua para modo escuro, sol para modo claro)
- A mudança deve ser aplicada imediatamente em toda a interface
- A preferência do usuário deve ser salva e mantida entre sessões
- Deve haver feedback visual (notificação) ao trocar de tema

---

## Status de Implementação

- ✅ HU01: Cadastro de Novo Usuário
- ✅ HU02: Login de Usuário
- ✅ HU03: Adicionar Nova Despesa (Única ou Recorrente)
- ✅ HU04: Visualizar Lista de Despesas
- ✅ HU05: Editar uma Despesa Existente
- ✅ HU06: Remover uma Despesa
- ✅ HU07: Dashboard de Gasto Mensal
- ✅ HU08: Calendário de Pagamentos Futuros
- 🔄 HU09: Filtrar Despesas por Categoria
- ✅ HU10: Notificações de Vencimento
- ✅ HU11: Alternância entre Modo Claro e Escuro

**Legenda:**
- ✅ Implementado
- 🔄 Em desenvolvimento
- ❌ Não implementado

---

**Versão:** 3.0  
**Última atualização:** Janeiro 2025  
**Responsável:** Equipe de Desenvolvimento