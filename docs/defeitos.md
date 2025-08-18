# Registro de Defeitos - Gerir.me

Baseado na ISO-29119-3 e em ferramentas de gestão de defeitos.

---

## Defeito #001

| Campo | Valor |
|-------|-------|
| **ID** | DEF-001 |
| **Título** | Inconsistência nas credenciais padrão impede login do usuário |
| **Testador** | Usuário |
| **Data e Hora** | 16/08/2025 18:30:00 |
| **Resultado Esperado** | O usuário deve conseguir fazer login utilizando as credenciais definidas no arquivo .env (eddie@gerir.me / Eddie123) |
| **Resultado Atual** | O login falha pois o sistema cria um usuário padrão com credenciais diferentes (usuario@gerir.me / usuario123) no script.js |
| **Evidências** | - Arquivo .env linha 4-5: DEFAULT_USER_EMAIL=eddie@gerir.me, DEFAULT_USER_PASSWORD=Eddie123<br>- Arquivo script.js linhas 996-1002: usuário criado com email 'usuario@gerir.me' e senha 'usuario123'<br>- Tentativa de login com credenciais do .env resulta em erro "E-mail ou senha incorretos!" |
| **Prioridade** | Alta |
| **Severidade** | Crítica - Impede o acesso inicial à aplicação |
| **Informações sobre o Software** | - Versão: Desenvolvimento<br>- Ambiente: Local (localhost:5000)<br>- Navegador: Não especificado<br>- Sistema: Windows |
| **Rastreabilidade** | Teste de login inicial com credenciais padrão |
| **Status** | Resolvido |

### Análise Técnica

**Causa Raiz:** Divergência entre as configurações do arquivo `.env` e o código JavaScript que inicializa o usuário padrão.

**Arquivos Afetados:**
- `.env` (linhas 4-6)
- `src/script.js` (linhas 996-1002)
- `docs/credenciais.md` (documentação desatualizada)

**Impacto:** Usuários não conseguem acessar a aplicação na primeira utilização.

### Resolução

**Data de Resolução:** 16/08/2025 18:35:00  
**Responsável:** Sistema  
**Ação Corretiva:** Atualizadas as credenciais do usuário padrão no arquivo `src/script.js` (linhas 996-1002) para corresponder às configurações do arquivo `.env`

**Alterações Realizadas:**
- Alterado email de 'usuario@gerir.me' para 'eddie@gerir.me'
- Alterado senha de 'usuario123' para 'Eddie123'
- Alterado nome de 'Usuário Demo' para 'Edcleryton Silva'
- Atualizada documentação em `docs/credenciais.md`

**Teste de Verificação:** Login realizado com sucesso utilizando as credenciais eddie@gerir.me / Eddie123

---

## Defeito #002

| Campo | Valor |
|-------|-------|
| **ID** | DEF-002 |
| **Título** | Sistema aceita emojis nos campos Nome e Senha durante cadastro de usuário |
| **Testador** | Usuário |
| **Data e Hora** | 16/01/2025 |
| **Resultado Esperado** | O sistema deve validar e rejeitar caracteres especiais como emojis nos campos Nome e Senha, permitindo apenas caracteres alfanuméricos e símbolos válidos |
| **Resultado Atual** | O sistema aceita emojis tanto no campo Nome quanto no campo Senha, permitindo o cadastro com sucesso |
| **Evidências** | - Cadastro realizado com sucesso usando emoji no campo Nome<br>- Cadastro realizado com sucesso usando emoji no campo Senha<br>- Nenhuma validação impede a inserção de emojis |
| **Prioridade** | Média |
| **Severidade** | Baixa - Não impede o funcionamento mas pode causar problemas de compatibilidade e segurança |
| **Informações sobre o Software** | - Versão: 3.0.0<br>- Ambiente: Local (localhost:8080)<br>- Navegador: Não especificado<br>- Sistema: Windows |
| **Rastreabilidade** | Teste de cadastro de usuário com caracteres especiais |
| **Status** | Aberto |

### Análise Técnica

**Causa Raiz:** Ausência de validação específica para caracteres Unicode (emojis) nos campos de entrada do formulário de cadastro.

**Arquivos Afetados:**
- `script.js` (função `handleRegister` - validações de entrada)
- `index.html` (campos de input do formulário de cadastro)

**Impacto:** 
- Possíveis problemas de compatibilidade com sistemas externos
- Dificuldades na exibição de nomes com emojis em relatórios
- Potenciais problemas de segurança com caracteres especiais em senhas
- Inconsistência na base de dados

### Recomendações

**Ações Sugeridas:**
1. Implementar validação regex para campo Nome permitindo apenas letras, números, espaços e acentos
2. Implementar validação regex para campo Senha excluindo emojis mas mantendo símbolos de segurança
3. Adicionar mensagens de erro específicas para caracteres não permitidos
4. Atualizar documentação de regras de negócio

**Prioridade de Correção:** Baixa - pode ser corrigida em próxima versão de manutenção

---

## Defeito #003

| Campo | Valor |
|-------|-------|
| **ID** | DEF-003 |
| **Título** | Login automático após cadastro e persistência de dados no formulário |
| **Testador** | Usuário |
| **Data e Hora** | 16/01/2025 |
| **Resultado Esperado** | Após o cadastro, o usuário deve permanecer na tela de login para inserir suas credenciais manualmente. Os campos do formulário de cadastro devem ser limpos após logout |
| **Resultado Atual** | O usuário é logado automaticamente após o cadastro e ao fazer logout, os dados preenchidos no formulário de cadastro permanecem visíveis |
| **Evidências** | - Após cadastro bem-sucedido, usuário é redirecionado automaticamente para o dashboard<br>- Ao fazer logout e retornar à página de cadastro, todos os campos permanecem preenchidos com os dados anteriores<br>- Não há limpeza dos campos do formulário |
| **Prioridade** | Média |
| **Severidade** | Média - Afeta a experiência do usuário e pode causar problemas de privacidade |
| **Informações sobre o Software** | - Versão: 3.0.0<br>- Ambiente: Local (localhost:8080)<br>- Navegador: Não especificado<br>- Sistema: Windows |
| **Rastreabilidade** | Fluxo de cadastro e logout de usuário |
| **Status** | Aberto |

### Análise Técnica

**Causa Raiz:** 
1. Função `handleRegister` executa login automático após cadastro bem-sucedido
2. Ausência de limpeza dos campos do formulário após logout ou cadastro

**Arquivos Afetados:**
- `script.js` (função `handleRegister` - login automático)
- `script.js` (função `logout` - não limpa formulários)
- `index.html` (formulários de cadastro e login)

**Impacto:** 
- Experiência do usuário inconsistente
- Possível exposição de dados pessoais em computadores compartilhados
- Violação de boas práticas de UX/UI
- Potencial problema de privacidade

### Recomendações

**Ações Sugeridas:**
1. Remover o login automático da função `handleRegister`
2. Implementar limpeza de formulários após cadastro bem-sucedido
3. Implementar limpeza de formulários na função `logout`
4. Adicionar função para limpar todos os campos de input
5. Exibir mensagem orientando o usuário a fazer login após cadastro

**Prioridade de Correção:** Média - deve ser corrigida na próxima versão minor

---

*Documento gerado automaticamente em 16/08/2025*