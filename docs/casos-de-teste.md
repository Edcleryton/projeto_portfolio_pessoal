# Casos de Teste - Sistema de Gerenciamento Financeiro

Documento baseado na ISO-29119-3 contendo os casos de teste para validação das funcionalidades do sistema de gerenciamento financeiro pessoal.

---

## Casos de Teste – Gerir.me

### Caso de Teste 1: Cadastro de Utilizador

**ID:** CT-HU01-01  
**Título:** Validar o cadastro de um novo utilizador com dados válidos e únicos.  
**Prioridade:** Alta  
**Rastreabilidade:** HU01, RN-USU-001, RN-USU-002  
**Pré-Condições:**

- O utilizador não está autenticado no sistema.
- O e-mail a ser utilizado para o cadastro não existe na base de dados.

**Passos Detalhados:**

**Passo 1:** Aceder à página inicial da aplicação "Gerir.me".  
**Resultado Esperado:** A tela de login ou uma opção para "Criar nova conta" é apresentada.

**Passo 2:** Clicar na opção "Criar nova conta".  
**Resultado Esperado:** O formulário de cadastro de novo utilizador é exibido.

**Passo 3:** Preencher o campo "Nome" com um nome válido (ex: "Utilizador Teste").  
**Resultado Esperado:** N/A

**Passo 4:** Preencher o campo "E-mail" com um e-mail válido e único (ex: "<teste@gerir.me>").  
**Resultado Esperado:** N/A

**Passo 5:** Preencher o campo "Senha" com uma senha que atenda à política de segurança (ex: "Teste@123").  
**Resultado Esperado:** N/A

**Passo 6:** Clicar no botão "Cadastrar".  
**Resultado Esperado:** O sistema cria a nova conta com sucesso e redireciona o utilizador para o dashboard principal.

**Pós-Condições:**

- Um novo registo de utilizador é criado na base de dados.
- O nome do utilizador é exibido no cabeçalho da aplicação.

---

### Caso de Teste 2: Validação de Despesa

**ID:** CT-US003-04  
**Título:** Validar o bloqueio de cadastro de despesa com valor negativo.  
**Prioridade:** Média  
**Rastreabilidade:** HU03, RN-DES-003  
**Pré-Condições:**

- O utilizador deve estar autenticado no sistema.
- O utilizador está na página do dashboard.

**Passos Detalhados:**

**Passo 1:** Clicar no botão para "Adicionar Nova Despesa".  
**Resultado Esperado:** O formulário de cadastro de despesa é exibido.

**Passo 2:** Preencher o campo "Nome" com um nome válido (ex: "Assinatura Inválida").  
**Resultado Esperado:** N/A

**Passo 3:** Preencher o campo "Valor" com um número negativo (ex: "-50,00").  
**Resultado Esperado:** N/A

**Passo 4:** Preencher os demais campos obrigatórios com dados válidos.  
**Resultado Esperado:** N/A

**Passo 5:** Clicar no botão "Salvar".  
**Resultado Esperado:** O sistema exibe uma mensagem de erro clara: "O valor da despesa deve ser um número positivo". A despesa não é salva.

**Pós-Condições:**

- Nenhum novo registo de despesa é criado na base de dados.
- O utilizador permanece no formulário para poder corrigir os dados.

---

### Caso de Teste 3: Cálculo do Dashboard

**ID:** CT-HU07-01  
**Título:** Validar o cálculo do gasto mensal no dashboard com diferentes tipos de despesas.  
**Prioridade:** Alta  
**Rastreabilidade:** HU07, RN-CAL-001, RN-CAL-002  
**Pré-Condições:**

- O utilizador está autenticado no sistema.
- O utilizador possui as seguintes despesas cadastradas e ativas:
  - Despesa 1 (Recorrente Mensal): R$ 50,00
  - Despesa 2 (Recorrente Anual): R$ 120,00
  - Despesa 3 (Única, no mês corrente): R$ 30,00

**Passos Detalhados:**

**Passo 1:** Aceder à página do dashboard.  
**Resultado Esperado:** O dashboard é carregado com as informações financeiras.

**Passo 2:** Observar o valor exibido no card "Gasto Mensal Total".  
**Resultado Esperado:** O valor exibido é "R$ 90,00" e está formatado no padrão BRL.

**Pós-Condições:**

- Os dados das despesas permanecem inalterados.

---

### Caso de Teste 4: Login e Bloqueio de Conta

**ID:** CT-HU02-02  
**Título:** Validar o bloqueio de conta após 3 tentativas de login falhadas.  
**Prioridade:** Alta  
**Rastreabilidade:** HU02, RN-USU-003  
**Pré-Condições:**

- Existe um utilizador cadastrado com o e-mail "<bloqueio@gerir.me>".

**Passos Detalhados:**

**Passo 1:** Aceder à página de login.  
**Resultado Esperado:** A tela de login é apresentada.

**Passo 2:** Inserir o e-mail "<bloqueio@gerir.me>" e uma senha incorreta. Clicar em "Entrar".  
**Resultado Esperado:** O sistema exibe a mensagem "E-mail ou senha inválidos".

**Passo 3:** Repetir o Passo 2 mais uma vez (segunda tentativa).  
**Resultado Esperado:** O sistema exibe novamente a mensagem "E-mail ou senha inválidos".

**Passo 4:** Repetir o Passo 2 mais uma vez (terceira tentativa).  
**Resultado Esperado:** O sistema exibe uma mensagem informando que a conta foi bloqueada por 15 minutos.

**Passo 5:** Tentar fazer login novamente com as credenciais corretas.  
**Resultado Esperado:** O sistema impede o login e mantém a mensagem de bloqueio.

**Pós-Condições:**

- A conta do utilizador "<bloqueio@gerir.me>" fica com o status "bloqueada" por 15 minutos.

---

### Caso de Teste 5: Exclusão de Despesa

**ID:** CT-HU06-01  
**Título:** Validar o fluxo de exclusão de uma despesa com confirmação.  
**Prioridade:** Média  
**Rastreabilidade:** HU06, RN-DES-007  
**Pré-Condições:**

- O utilizador está autenticado.
- Existe pelo menos uma despesa cadastrada na lista.

**Passos Detalhados:**

**Passo 1:** No dashboard, localizar uma despesa na lista e clicar no ícone de "Excluir".  
**Resultado Esperado:** Um modal de confirmação é exibido com a mensagem "Tem a certeza de que deseja excluir esta despesa?".

**Passo 2:** Clicar no botão "Cancelar" no modal.  
**Resultado Esperado:** O modal é fechado e a despesa permanece na lista.

**Passo 3:** Clicar novamente no ícone de "Excluir" da mesma despesa.  
**Resultado Esperado:** O modal de confirmação é exibido novamente.

**Passo 4:** Clicar no botão "Confirmar".  
**Resultado Esperado:** A despesa é removida permanentemente da lista. O valor no dashboard é recalculado.

**Pós-Condições:**

- O registo da despesa é removido da base de dados.

---

### Caso de Teste 6: Persistência de Tema

**ID:** CT-HU11-01  
**Título:** Validar a alternância de tema e a sua persistência entre sessões.  
**Prioridade:** Baixa  
**Rastreabilidade:** HU11, RN-INT-001, RN-INT-002  
**Pré-Condições:**

- O utilizador está autenticado.
- O tema padrão da aplicação é o "claro".

**Passos Detalhados:**

**Passo 1:** No cabeçalho da aplicação, clicar no botão para alternar o tema.  
**Resultado Esperado:** A interface muda imediatamente para o tema "escuro". Uma notificação "toast" confirma a mudança.

**Passo 2:** Fazer logout da aplicação.  
**Resultado Esperado:** O utilizador é redirecionado para a tela de login.

**Passo 3:** Fazer login novamente com o mesmo utilizador.  
**Resultado Esperado:** O utilizador é autenticado e o dashboard é exibido no tema "escuro", mantendo a preferência anterior.

**Pós-Condições:**

- A preferência de tema do utilizador (escuro) fica salva no localStorage.

---

### Caso de Teste 7: Edição de Despesa

**ID:** CT-HU05-01  
**Título:** Validar a edição dos dados de uma despesa existente.  
**Prioridade:** Alta  
**Rastreabilidade:** HU05  
**Pré-Condições:**

- O utilizador está autenticado.
- Existe uma despesa cadastrada com o nome "Spotify" e valor "R$ 20,00".

**Passos Detalhados:**

**Passo 1:** No dashboard, localizar a despesa "Spotify" e clicar no ícone de "Editar".  
**Resultado Esperado:** O formulário de edição é aberto com todos os dados da despesa "Spotify" preenchidos.

**Passo 2:** Alterar o campo "Valor" para "25,00".  
**Resultado Esperado:** N/A

**Passo 3:** Clicar no botão "Salvar".  
**Resultado Esperado:** O utilizador é redirecionado para o dashboard. A despesa "Spotify" agora exibe o valor "R$ 25,00". O "Gasto Mensal Total" no dashboard é recalculado para refletir a alteração.

**Pós-Condições:**

- O registo da despesa "Spotify" é atualizado na base de dados com o novo valor.

---

### Caso de Teste 8: Visualização do Calendário

**ID:** CT-HU08-01  
**Título:** Validar a exibição de marcadores no calendário apenas para despesas recorrentes.  
**Prioridade:** Média  
**Rastreabilidade:** HU08, RN-CAL-003  
**Pré-Condições:**

- O utilizador está autenticado.
- Existem duas despesas cadastradas para o mês de Setembro de 2025:
  - Despesa 1 (Recorrente): "Ginásio", Próxima Cobrança em 15/09/2025.
  - Despesa 2 (Única): "Jantar", Data da Despesa em 20/09/2025.

**Passos Detalhados:**

**Passo 1:** Aceder ao ecrã do "Calendário".  
**Resultado Esperado:** O calendário do mês corrente é exibido.

**Passo 2:** Navegar para o mês de "Setembro de 2025".  
**Resultado Esperado:** O calendário exibe os dias do mês de Setembro.

**Passo 3:** Observar os dias 15 e 20 do calendário.  
**Resultado Esperado:** O dia 15 deve ter um marcador visual indicando uma cobrança. O dia 20 não deve ter nenhum marcador.

**Pós-Condições:**

- Nenhuma alteração de dados é realizada.

---

### Caso de Teste 9: Segregação de Dados (Segurança)

**ID:** CT-RN-USU-005-01  
**Título:** Validar que um utilizador não pode aceder aos dados de outro utilizador.  
**Prioridade:** Crítica  
**Rastreabilidade:** RN-USU-005  
**Pré-Condições:**

- Existem dois utilizadores: Utilizador A e Utilizador B.
- O Utilizador A possui uma despesa com ID "123".
- O Utilizador B está autenticado no sistema.

**Passos Detalhados:**

**Passo 1:** Tentar aceder diretamente à URL de edição da despesa do Utilizador A (ex: .../despesas/editar/123).  
**Resultado Esperado:** O sistema deve impedir o acesso, exibindo uma mensagem de "Acesso Negado" ou "Despesa não encontrada", e/ou redirecionar o Utilizador B para o seu próprio dashboard.

**Pós-Condições:**

- Os dados do Utilizador A permanecem seguros e não foram visualizados ou alterados pelo Utilizador B.

---

## Casos de Teste Adicionais

### CT-001: Validação de alternância de tema com toast sobrepondo elementos

**ID:** CT-001  
**Título:** Validação de alternância de tema com toast sobrepondo elementos  
**Prioridade:** Média  
**Rastreabilidade:** HU11  
**Pré-Condições:**

- Utilizador autenticado no sistema
- Interface no tema claro

**Passos:**

1. Clicar no botão de alternância de tema - **Resultado Esperado:** Toast de confirmação aparece
2. Verificar se o toast não sobrepõe elementos importantes - **Resultado Esperado:** Toast posicionado adequadamente
3. Aguardar desaparecimento automático do toast - **Resultado Esperado:** Toast desaparece após 3 segundos
4. Verificar mudança de tema - **Resultado Esperado:** Interface alterada para tema escuro

**Defeitos Relacionados:** DEF-001

---

### CT-002: Verificação de estrutura de toast para automação

**ID:** CT-002  
**Título:** Verificação de estrutura de toast para automação  
**Prioridade:** Baixa  
**Rastreabilidade:** HU11  
**Pré-Condições:**

- Sistema carregado
- Ferramentas de desenvolvimento abertas

**Passos:**

1. Executar ação que gera toast - **Resultado Esperado:** Toast aparece na tela
2. Inspecionar elemento toast no DOM - **Resultado Esperado:** Elemento possui classe `.toast`
3. Verificar estrutura interna - **Resultado Esperado:** Contém `.toast-title` e `.toast-message`
4. Verificar botão de fechar - **Resultado Esperado:** Elemento `.toast-close` presente

**Defeitos Relacionados:** Nenhum

---

### CT-003: Persistência de tema após recarregamento

**ID:** CT-003  
**Título:** Persistência de tema após recarregamento da página  
**Prioridade:** Alta  
**Rastreabilidade:** HU11, RN-INT-001  
**Pré-Condições:**

- Utilizador autenticado
- Tema atual: claro

**Passos:**

1. Alternar para tema escuro - **Resultado Esperado:** Interface muda para tema escuro
2. Recarregar a página (F5) - **Resultado Esperado:** Página recarrega
3. Fazer login novamente - **Resultado Esperado:** Acesso ao dashboard
4. Verificar localStorage - **Resultado Esperado:** Tema 'dark' armazenado

**Defeitos Relacionados:** DEF-002

---

### CT-004: Validação de cores CSS em diferentes temas

**ID:** CT-004  
**Título:** Validação de cores CSS aplicadas nos temas claro e escuro  
**Prioridade:** Média  
**Rastreabilidade:** HU11, RN-INT-002  
**Pré-Condições:**

- Sistema carregado
- Acesso às ferramentas de desenvolvimento

**Passos:**

1. Inspecionar elemento no tema claro - **Resultado Esperado:** Background: #ffffff, Text: #333333
2. Alternar para tema escuro - **Resultado Esperado:** Tema muda para escuro
3. Inspecionar mesmo elemento - **Resultado Esperado:** Background: #1a1a1a, Text: #ffffff
4. Verificar contraste de cores - **Resultado Esperado:** Contraste adequado para acessibilidade

**Defeitos Relacionados:** Nenhum

### Caso de Teste 10: Notificações de Vencimento

**ID:** CT-HU10-01  
**Título:** Validar o destaque de despesas com vencimento próximo no dashboard.  
**Prioridade:** Alta  
**Rastreabilidade:** HU10, RN-NOT-001  
**Pré-Condições:**

- O utilizador está autenticado.
- Existem 3 despesas recorrentes:
  - Despesa A: Vencimento em 5 dias.
  - Despesa B: Vencimento em 8 dias.
  - Despesa C: Vencimento em 2 dias.

**Passos:**

1. Aceder ao dashboard.
2. Observar a secção "Próximos Pagamentos".

**Resultados Esperados:**

- Passo 1: O dashboard é carregado.
- Passo 2: A Despesa A e a Despesa C devem estar listadas e destacadas. A Despesa B não deve aparecer na lista.

**Pós-Condições:**

- Nenhuma alteração de dados é realizada.

---

### Caso de Teste 11: Filtro de Despesas

**ID:** CT-HU09-01  
**Título:** Validar a filtragem de despesas por categoria.  
**Prioridade:** Média  
**Rastreabilidade:** HU09  
**Pré-Condições:**

- O utilizador está autenticado.
- Existem despesas cadastradas em diferentes categorias (ex: "Lazer", "Moradia", "Transporte").

**Passos:**

1. No dashboard, localizar o filtro de "Categoria".
2. Selecionar a categoria "Lazer".
3. Selecionar a opção "Todas as Categorias".

**Resultados Esperados:**

- Passo 1: O filtro dropdown é exibido com todas as categorias disponíveis.
- Passo 2: A lista de despesas é atualizada, exibindo apenas as despesas da categoria "Lazer".
- Passo 3: A lista de despesas volta a exibir todas as despesas, sem filtro.

**Pós-Condições:**

- Nenhuma alteração de dados é realizada.

---

### Caso de Teste 12: Validação de Campos Obrigatórios

**ID:** CT-US003-03  
**Título:** Validar o bloqueio de cadastro de despesa com campos obrigatórios em branco.  
**Prioridade:** Média  
**Rastreabilidade:** HU03, RN-DES-002  
**Pré-Condições:**

- O utilizador está autenticado.

**Passos:**

1. Aceder ao formulário de "Adicionar Nova Despesa".
2. Preencher todos os campos, exceto o campo "Nome".
3. Clicar no botão "Salvar".

**Resultados Esperados:**

- Passo 1: O formulário é exibido.
- Passo 2: N/A
- Passo 3: O sistema exibe uma mensagem de erro específica para o campo "Nome" (ex: "Este campo é obrigatório"). A despesa não é salva.

**Pós-Condições:**

- Nenhum novo registo de despesa é criado na base de dados.

---

### Caso de Teste 13: Experiência de Utilizador com Lista Vazia

**ID:** CT-HU04-02  
**Título:** Validar a exibição de mensagem amigável quando não há despesas cadastradas.  
**Prioridade:** Baixa  
**Rastreabilidade:** HU04  
**Pré-Condições:**

- Um novo utilizador acaba de se cadastrar e está autenticado.
- Nenhuma despesa foi adicionada à conta.

**Passos:**

1. Aceder ao dashboard.
2. Observar a área onde a lista de despesas seria exibida.

**Resultados Esperados:**

- Passo 1: O dashboard é carregado.
- Passo 2: Uma mensagem amigável é exibida, incentivando o utilizador a adicionar a sua primeira despesa (ex: "Parece que você ainda não tem despesas. Que tal adicionar a primeira?").

**Pós-Condições:**

- Nenhuma alteração de dados é realizada.

---

### Caso de Teste 14: Atualização Automática de Recorrência

**ID:** CT-RN-DES-006-01  
**Título:** Validar a atualização automática da data de cobrança de uma despesa recorrente.  
**Prioridade:** Alta  
**Rastreabilidade:** RN-DES-006  
**Pré-Condições:**

- O utilizador está autenticado.
- Existe uma despesa recorrente mensal com "Próxima Data de Cobrança" definida para o dia de hoje.

**Passos:**

1. Simular a passagem de um dia no sistema (avançar a data do sistema para o dia seguinte).
2. Fazer login na aplicação e aceder ao dashboard.
3. Localizar a despesa recorrente na lista.

**Resultados Esperados:**

- Passo 1: N/A
- Passo 2: O dashboard é carregado.
- Passo 3: A "Próxima Data de Cobrança" da despesa foi automaticamente atualizada para o mesmo dia do mês seguinte.

**Pós-Condições:**

- O registo da despesa é atualizado na base de dados com a nova data de cobrança.

---

### Caso de Teste 15: Notificações Push

**ID:** CT-HU10-02  
**Título:** Validar a solicitação e o envio de notificações push.  
**Prioridade:** Média  
**Rastreabilidade:** HU10, RN-NOT-002, RN-NOT-003  
**Pré-Condições:**

- O utilizador está autenticado pela primeira vez num navegador.
- Existe uma despesa com vencimento em 2 dias.

**Passos:**

1. Aceder ao dashboard.
2. Clicar em "Permitir".
3. Aguardar ou simular a verificação de notificações.
4. Manter-se na aplicação e simular uma nova verificação no mesmo dia.

**Resultados Esperados:**

- Passo 1: O navegador exibe um pop-up solicitando permissão para enviar notificações.
- Passo 2: A permissão é concedida.
- Passo 3: Uma notificação push do navegador é exibida, alertando sobre a despesa que vence em 2 dias.
- Passo 4: Nenhuma nova notificação para a mesma despesa é enviada.

**Pós-Condições:**

- A permissão de notificação para o site é salva nas configurações do navegador.

---

*Documento atualizado em: Agosto 2025*  
*Versão: 2.1*
