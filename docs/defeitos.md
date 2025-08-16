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

*Documento gerado automaticamente em 16/08/2025*