# Casos de Teste - Sistema de Gerenciamento Financeiro

Documento baseado na ISO-29119-3 contendo os casos de teste para validação das funcionalidades do sistema de gerenciamento financeiro pessoal.

---

## Casos de Teste – Gerir.me

### Caso de Teste 1: Cadastro de Utilizador

| Campo | Valor |
|-------|-------|
| **ID** | CT-HU01-01 |
| **Título** | Validar o cadastro de um novo utilizador com dados válidos e únicos. |
| **Prioridade** | Alta |
| **Rastreabilidade** | HU01, RN-USU-001, RN-USU-002 |
| **Pré-Condições** | - O utilizador não está autenticado no sistema.<br>- O e-mail a ser utilizado para o cadastro não existe na base de dados. |

#### Passos

| Passo | Ação |
|-------|------|
| Passo 1 | Aceder à página inicial da aplicação "Gerir.me". |
| Passo 2 | Clicar na opção "Criar nova conta". |
| Passo 3 | Preencher o campo "Nome" com um nome válido (ex: "Utilizador Teste"). |
| Passo 4 | Preencher o campo "E-mail" com um e-mail válido e único (ex: "<teste@gerir.me>"). |
| Passo 5 | Preencher o campo "Senha" com uma senha que atenda à política de segurança (ex: "Teste@123"). |
| Passo 6 | Clicar no botão "Cadastrar". |

| **Pós-Condições** |
|-------------------|
| - Um novo registo de utilizador é criado na base de dados.<br>- O nome do utilizador é exibido no cabeçalho da aplicação. |

---

### Caso de Teste 2: Validação de Despesa

| Campo | Valor |
|-------|-------|
| **ID** | CT-US003-04 |
| **Título** | Validar o bloqueio de cadastro de despesa com valor negativo. |
| **Prioridade** | Média |
| **Rastreabilidade** | HU03, RN-DES-003 |
| **Pré-Condições** | - O utilizador deve estar autenticado no sistema.<br>- O utilizador está na página do dashboard. |

#### Passos

| Passo | Ação |
|-------|------|
| Passo 1 | Clicar no botão para "Adicionar Nova Despesa". |
| Passo 2 | Preencher o campo "Nome" com um nome válido (ex: "Assinatura Inválida"). |
| Passo 3 | Preencher o campo "Valor" com um número negativo (ex: "-50,00"). |
| Passo 4 | Preencher os demais campos obrigatórios com dados válidos. |
| Passo 5 | Clicar no botão "Salvar". |

| **Pós-Condições** |
|-------------------|
| - Nenhum novo registo de despesa é criado na base de dados.<br>- O utilizador permanece no formulário para poder corrigir os dados. |

---

### Caso de Teste 3: Cálculo do Dashboard

| Campo | Valor |
|-------|-------|
| **ID** | CT-HU07-01 |
| **Título** | Validar o cálculo do gasto mensal no dashboard com diferentes tipos de despesas. |
| **Prioridade** | Alta |
| **Rastreabilidade** | HU07, RN-CAL-001, RN-CAL-002 |
| **Pré-Condições** | - O utilizador está autenticado no sistema.<br>- O utilizador possui as seguintes despesas cadastradas e ativas:<br>  - Despesa 1 (Recorrente Mensal): R$ 50,00<br>  - Despesa 2 (Recorrente Anual): R$ 120,00<br>  - Despesa 3 (Única, no mês corrente): R$ 30,00 |

#### Passos

| Passo | Ação |
|-------|------|
| Passo 1 | Aceder à página do dashboard. |
| Passo 2 | Observar o valor exibido no card "Gasto Mensal Total". |

| **Pós-Condições** |
|-------------------|
| - Os dados das despesas permanecem inalterados. |

---

### Caso de Teste 4: Login e Bloqueio de Conta

| Campo | Valor |
|-------|-------|
| **ID** | CT-HU02-02 |
| **Título** | Validar o bloqueio de conta após 3 tentativas de login falhadas. |
| **Prioridade** | Alta |
| **Rastreabilidade** | HU02, RN-USU-003 |
| **Pré-Condições** | - Existe um utilizador cadastrado com o e-mail "<bloqueio@gerir.me>". |

#### Passos

| Passo | Ação |
|-------|------|
| Passo 1 | Aceder à página de login. |
| Passo 2 | Inserir o e-mail "<bloqueio@gerir.me>" e uma senha incorreta. Clicar em "Entrar". |
| Passo 3 | Repetir o Passo 2 mais uma vez (segunda tentativa). |
| Passo 4 | Repetir o Passo 2 mais uma vez (terceira tentativa). |
| Passo 5 | Tentar fazer login novamente com as credenciais corretas. |

| **Pós-Condições** |
|-------------------|
| - A conta do utilizador "<bloqueio@gerir.me>" fica com o status "bloqueada" por 15 minutos. |

---

### Caso de Teste 5: Exclusão de Despesa

| Campo | Valor |
|-------|-------|
| **ID** | CT-HU06-01 |
| **Título** | Validar o fluxo de exclusão de uma despesa com confirmação. |
| **Prioridade** | Média |
| **Rastreabilidade** | HU06, RN-DES-007 |
| **Pré-Condições** | - O utilizador está autenticado.<br>- Existe pelo menos uma despesa cadastrada na lista. |

#### Passos

| Passo | Ação |
|-------|------|
| Passo 1 | No dashboard, localizar uma despesa na lista e clicar no ícone de "Excluir". |
| Passo 2 | Clicar no botão "Cancelar" no modal. |
| Passo 3 | Clicar novamente no ícone de "Excluir" da mesma despesa. |
| Passo 4 | Clicar no botão "Confirmar". |

| **Pós-Condições** |
|-------------------|
| - O registo da despesa é removido da base de dados. |

---

### Caso de Teste 6: Persistência de Tema

| Campo | Valor |
|-------|-------|
| **ID** | CT-HU11-01 |
| **Título** | Validar a alternância de tema e a sua persistência entre sessões. |
| **Prioridade** | Baixa |
| **Rastreabilidade** | HU11, RN-INT-001, RN-INT-002 |
| **Pré-Condições** | - O utilizador está autenticado.<br>- O tema padrão da aplicação é o "claro". |

#### Passos

| Passo | Ação |
|-------|------|
| Passo 1 | No cabeçalho da aplicação, clicar no botão para alternar o tema. |
| Passo 2 | Fazer logout da aplicação. |
| Passo 3 | Fazer login novamente com o mesmo utilizador. |

| **Pós-Condições** |
|-------------------|
| - A preferência de tema do utilizador (escuro) fica salva no localStorage. |

---

## Casos de Teste Detalhados com Resultados Esperados

### Caso de Teste 1: Cadastro de Utilizador

| Campo | Valor |
|-------|-------|
| **ID** | CT-HU01-01 |
| **Título** | Validar o cadastro de um novo utilizador com dados válidos e únicos. |
| **Prioridade** | Alta |
| **Rastreabilidade** | HU01, RN-USU-001, RN-USU-002 |
| **Pré-Condições** | - O utilizador não está autenticado no sistema.<br>- O e-mail a ser utilizado para o cadastro não existe na base de dados. |

#### Passos Detalhados

| Passo | Ação | Resultados Esperados |
|-------|------|---------------------|
| Passo 1 | Aceder à página inicial da aplicação "Gerir.me". | A tela de login ou uma opção para "Criar nova conta" é apresentada. |
| Passo 2 | Clicar na opção "Criar nova conta". | O formulário de cadastro de novo utilizador é exibido. |
| Passo 3 | Preencher o campo "Nome" com um nome válido (ex: "Utilizador Teste"). | N/A |
| Passo 4 | Preencher o campo "E-mail" com um e-mail válido e único (ex: "<teste@gerir.me>"). | N/A |
| Passo 5 | Preencher o campo "Senha" com uma senha que atenda à política de segurança (ex: "Teste@123"). | N/A |
| Passo 6 | Clicar no botão "Cadastrar". | O sistema cria a nova conta com sucesso e redireciona o utilizador para o dashboard principal. |

| **Pós-Condições** |
|-------------------|
| - Um novo registo de utilizador é criado na base de dados.<br>- O nome do utilizador é exibido no cabeçalho da aplicação. |

---

### Caso de Teste 2: Validação de Despesa

| Campo | Valor |
|-------|-------|
| **ID** | CT-US003-04 |
| **Título** | Validar o bloqueio de cadastro de despesa com valor negativo. |
| **Prioridade** | Média |
| **Rastreabilidade** | HU03, RN-DES-003 |
| **Pré-Condições** | - O utilizador deve estar autenticado no sistema.<br>- O utilizador está na página do dashboard. |

#### Passos Detalhados

| Passo | Ação | Resultados Esperados |
|-------|------|---------------------|
| Passo 1 | Clicar no botão para "Adicionar Nova Despesa". | O formulário de cadastro de despesa é exibido. |
| Passo 2 | Preencher o campo "Nome" com um nome válido (ex: "Assinatura Inválida"). | N/A |
| Passo 3 | Preencher o campo "Valor" com um número negativo (ex: "-50,00"). | N/A |
| Passo 4 | Preencher os demais campos obrigatórios com dados válidos. | N/A |
| Passo 5 | Clicar no botão "Salvar". | O sistema exibe uma mensagem de erro clara: "O valor da despesa deve ser um número positivo".<br>A despesa não é salva. |

| **Pós-Condições** |
|-------------------|
| - Nenhum novo registo de despesa é criado na base de dados.<br>- O utilizador permanece no formulário para poder corrigir os dados. |

---

### Caso de Teste 3: Cálculo do Dashboard

| Campo | Valor |
|-------|-------|
| **ID** | CT-HU07-01 |
| **Título** | Validar o cálculo do gasto mensal no dashboard com diferentes tipos de despesas. |
| **Prioridade** | Alta |
| **Rastreabilidade** | HU07, RN-CAL-001, RN-CAL-002 |
| **Pré-Condições** | - O utilizador está autenticado no sistema.<br>- O utilizador possui as seguintes despesas cadastradas e ativas:<br>  - Despesa 1 (Recorrente Mensal): R$ 50,00<br>  - Despesa 2 (Recorrente Anual): R$ 120,00<br>  - Despesa 3 (Única, no mês corrente): R$ 30,00 |

#### Passos Detalhados

| Passo | Ação | Resultados Esperados |
|-------|------|---------------------|
| Passo 1 | Aceder à página do dashboard. | O dashboard é carregado com as informações financeiras. |
| Passo 2 | Observar o valor exibido no card "Gasto Mensal Total". | O valor exibido é "R$ 90,00" e está formatado no padrão BRL. |

| **Pós-Condições** |
|-------------------|
| - Os dados das despesas permanecem inalterados. |

---

### Caso de Teste 4: Login e Bloqueio de Conta

| Campo | Valor |
|-------|-------|
| **ID** | CT-HU02-02 |
| **Título** | Validar o bloqueio de conta após 3 tentativas de login falhadas. |
| **Prioridade** | Alta |
| **Rastreabilidade** | HU02, RN-USU-003 |
| **Pré-Condições** | - Existe um utilizador cadastrado com o e-mail "<bloqueio@gerir.me>". |

#### Passos Detalhados

| Passo | Ação | Resultados Esperados |
|-------|------|---------------------|
| Passo 1 | Aceder à página de login. | A tela de login é apresentada. |
| Passo 2 | Inserir o e-mail "<bloqueio@gerir.me>" e uma senha incorreta. Clicar em "Entrar". | O sistema exibe a mensagem "E-mail ou senha inválidos". |
| Passo 3 | Repetir o Passo 2 mais uma vez (segunda tentativa). | O sistema exibe novamente a mensagem "E-mail ou senha inválidos". |
| Passo 4 | Repetir o Passo 2 mais uma vez (terceira tentativa). | O sistema exibe uma mensagem informando que a conta foi bloqueada por 15 minutos. |
| Passo 5 | Tentar fazer login novamente com as credenciais corretas. | O sistema impede o login e mantém a mensagem de bloqueio. |

| **Pós-Condições** |
|-------------------|
| - A conta do utilizador "<bloqueio@gerir.me>" fica com o status "bloqueada" por 15 minutos. |

---

### Caso de Teste 5: Exclusão de Despesa

| Campo | Valor |
|-------|-------|
| **ID** | CT-HU06-01 |
| **Título** | Validar o fluxo de exclusão de uma despesa com confirmação. |
| **Prioridade** | Média |
| **Rastreabilidade** | HU06, RN-DES-007 |
| **Pré-Condições** | - O utilizador está autenticado.<br>- Existe pelo menos uma despesa cadastrada na lista. |

#### Passos Detalhados

| Passo | Ação | Resultados Esperados |
|-------|------|---------------------|
| Passo 1 | No dashboard, localizar uma despesa na lista e clicar no ícone de "Excluir". | Um modal de confirmação é exibido com a mensagem "Tem a certeza de que deseja excluir esta despesa?". |
| Passo 2 | Clicar no botão "Cancelar" no modal. | O modal é fechado e a despesa permanece na lista. |
| Passo 3 | Clicar novamente no ícone de "Excluir" da mesma despesa. | O modal de confirmação é exibido novamente. |
| Passo 4 | Clicar no botão "Confirmar". | A despesa é removida permanentemente da lista.<br>O valor no dashboard é recalculado. |

| **Pós-Condições** |
|-------------------|
| - O registo da despesa é removido da base de dados. |

---

### Caso de Teste 6: Persistência de Tema

| Campo | Valor |
|-------|-------|
| **ID** | CT-HU11-01 |
| **Título** | Validar a alternância de tema e a sua persistência entre sessões. |
| **Prioridade** | Baixa |
| **Rastreabilidade** | HU11, RN-INT-001, RN-INT-002 |
| **Pré-Condições** | - O utilizador está autenticado.<br>- O tema padrão da aplicação é o "claro". |

#### Passos Detalhados

| Passo | Ação | Resultados Esperados |
|-------|------|---------------------|
| Passo 1 | No cabeçalho da aplicação, clicar no botão para alternar o tema. | A interface muda imediatamente para o tema "escuro".<br>Uma notificação "toast" confirma a mudança. |
| Passo 2 | Fazer logout da aplicação. | O utilizador é redirecionado para a tela de login. |
| Passo 3 | Fazer login novamente com o mesmo utilizador. | O utilizador é autenticado e o dashboard é exibido no tema "escuro", mantendo a preferência anterior. |

| **Pós-Condições** |
|-------------------|
| - A preferência de tema do utilizador (escuro) fica salva no localStorage. |

---

### Caso de Teste 7: Edição de Despesa

| Campo | Valor |
|-------|-------|
| **ID** | CT-HU05-01 |
| **Título** | Validar a edição dos dados de uma despesa existente. |
| **Prioridade** | Alta |
| **Rastreabilidade** | HU05 |
| **Pré-Condições** | - O utilizador está autenticado.<br>- Existe uma despesa cadastrada com o nome "Spotify" e valor "R$ 20,00". |

#### Passos Detalhados

| Passo | Ação | Resultados Esperados |
|-------|------|---------------------|
| Passo 1 | No dashboard, localizar a despesa "Spotify" e clicar no ícone de "Editar". | O formulário de edição é aberto com todos os dados da despesa "Spotify" preenchidos. |
| Passo 2 | Alterar o campo "Valor" para "25,00". | N/A |
| Passo 3 | Clicar no botão "Salvar". | O utilizador é redirecionado para o dashboard.<br>A despesa "Spotify" agora exibe o valor "R$ 25,00".<br>O "Gasto Mensal Total" no dashboard é recalculado para refletir a alteração. |

| **Pós-Condições** |
|-------------------|
| - O registo da despesa "Spotify" é atualizado na base de dados com o novo valor. |

---

### Caso de Teste 8: Visualização do Calendário

| Campo | Valor |
|-------|-------|
| **ID** | CT-HU08-01 |
| **Título** | Validar a exibição de marcadores no calendário apenas para despesas recorrentes. |
| **Prioridade** | Média |
| **Rastreabilidade** | HU08, RN-CAL-003 |
| **Pré-Condições** | - O utilizador está autenticado.<br>- Existem duas despesas cadastradas para o mês de Setembro de 2025:<br>  - Despesa 1 (Recorrente): "Ginásio", Próxima Cobrança em 15/09/2025.<br>  - Despesa 2 (Única): "Jantar", Data da Despesa em 20/09/2025. |

#### Passos Detalhados

| Passo | Ação | Resultados Esperados |
|-------|------|---------------------|
| Passo 1 | Aceder ao ecrã do "Calendário". | O calendário do mês corrente é exibido. |
| Passo 2 | Navegar para o mês de "Setembro de 2025". | O calendário exibe os dias do mês de Setembro. |
| Passo 3 | Observar os dias 15 e 20 do calendário. | O dia 15 deve ter um marcador visual indicando uma cobrança.<br>O dia 20 não deve ter nenhum marcador. |

| **Pós-Condições** |
|-------------------|
| - Nenhuma alteração de dados é realizada. |

---

### Caso de Teste 9: Segregação de Dados (Segurança)

| Campo | Valor |
|-------|-------|
| **ID** | CT-RN-USU-005-01 |
| **Título** | Validar que um utilizador não pode aceder aos dados de outro utilizador. |
| **Prioridade** | Crítica |
| **Rastreabilidade** | RN-USU-005 |
| **Pré-Condições** | - Existem dois utilizadores: Utilizador A e Utilizador B.<br>- O Utilizador A possui uma despesa com ID "123".<br>- O Utilizador B está autenticado no sistema. |

#### Passos Detalhados

| Passo | Ação | Resultados Esperados |
|-------|------|---------------------|
| Passo 1 | Tentar aceder diretamente à URL de edição da despesa do Utilizador A (ex: .../despesas/editar/123). | O sistema deve impedir o acesso, exibindo uma mensagem de "Acesso Negado" ou "Despesa não encontrada", e/ou redirecionar o Utilizador B para o seu próprio dashboard. |

| **Pós-Condições** |
|-------------------|
| - Os dados do Utilizador A permanecem seguros e não foram visualizados ou alterados pelo Utilizador B. |

---

## Casos de Teste Adicionais

### CT-001: Validação de alternância de tema com toast sobrepondo elementos

| Campo | Valor |
|-------|-------|
| **ID** | CT-001 |
| **Título** | Validação de alternância de tema com toast sobrepondo elementos |
| **Prioridade** | Média |
| **Rastreabilidade** | HU11 |
| **Pré-Condições** | - Utilizador autenticado no sistema<br>- Interface no tema claro |

#### Passos

| Passo | Ação | Resultado Esperado |
|-------|------|-------------------|
| 1 | Clicar no botão de alternância de tema | Toast de confirmação aparece |
| 2 | Verificar se o toast não sobrepõe elementos importantes | Toast posicionado adequadamente |
| 3 | Aguardar desaparecimento automático do toast | Toast desaparece após 3 segundos |
| 4 | Verificar mudança de tema | Interface alterada para tema escuro |

**Defeitos Relacionados:** DEF-001

---

### CT-002: Verificação de estrutura de toast para automação

| Campo | Valor |
|-------|-------|
| **ID** | CT-002 |
| **Título** | Verificação de estrutura de toast para automação |
| **Prioridade** | Baixa |
| **Rastreabilidade** | HU11 |
| **Pré-Condições** | - Sistema carregado<br>- Ferramentas de desenvolvimento abertas |

#### Passos

| Passo | Ação | Resultado Esperado |
|-------|------|-------------------|
| 1 | Executar ação que gera toast | Toast aparece na tela |
| 2 | Inspecionar elemento toast no DOM | Elemento possui classe `.toast` |
| 3 | Verificar estrutura interna | Contém `.toast-title` e `.toast-message` |
| 4 | Verificar botão de fechar | Elemento `.toast-close` presente |

**Defeitos Relacionados:** Nenhum

---

### CT-003: Persistência de tema após recarregamento

| Campo | Valor |
|-------|-------|
| **ID** | CT-003 |
| **Título** | Persistência de tema após recarregamento da página |
| **Prioridade** | Alta |
| **Rastreabilidade** | HU11, RN-INT-001 |
| **Pré-Condições** | - Utilizador autenticado<br>- Tema atual: claro |

#### Passos

| Passo | Ação | Resultado Esperado |
|-------|------|-------------------|
| 1 | Alternar para tema escuro | Interface muda para tema escuro |
| 2 | Recarregar a página (F5) | Página recarrega |
| 3 | Fazer login novamente | Acesso ao dashboard |
| 4 | Verificar localStorage | Tema 'dark' armazenado |

**Defeitos Relacionados:** DEF-002

---

### CT-004: Validação de cores CSS em diferentes temas

| Campo | Valor |
|-------|-------|
| **ID** | CT-004 |
| **Título** | Validação de cores CSS aplicadas nos temas claro e escuro |
| **Prioridade** | Média |
| **Rastreabilidade** | HU11, RN-INT-002 |
| **Pré-Condições** | - Sistema carregado<br>- Acesso às ferramentas de desenvolvimento |

#### Passos

| Passo | Ação | Resultado Esperado |
|-------|------|-------------------|
| 1 | Inspecionar elemento no tema claro | Background: #ffffff, Text: #333333 |
| 2 | Alternar para tema escuro | Tema muda para escuro |
| 3 | Inspecionar mesmo elemento | Background: #1a1a1a, Text: #ffffff |
| 4 | Verificar contraste de cores | Contraste adequado para acessibilidade |

**Defeitos Relacionados:** Nenhum

---

*Documento atualizado em: Janeiro 2025*
*Versão: 2.0*
