# Regras de Negócio: Meu Gerenciador de Despesas

## Visão Geral

Este documento define as regras de negócio para o sistema "Meu Gerenciador de Despesas", uma aplicação web para controle financeiro pessoal que permite o gerenciamento de despesas únicas e recorrentes.

---

## RN-USU: Gerenciamento de Usuários

### RN-USU-001: Unicidade de E-mail
**Descrição:** Cada e-mail pode estar associado a apenas uma conta de usuário no sistema.
**Regra:** O sistema deve validar se o e-mail já existe antes de permitir o cadastro de um novo usuário.
**Implementação:** Verificação no momento do cadastro com mensagem de erro "E-mail já cadastrado".

### RN-USU-002: Política de Senha
**Descrição:** As senhas devem atender aos critérios mínimos de segurança.
**Regra:** A senha deve ter no mínimo 8 caracteres, contendo pelo menos uma letra e um número.
**Implementação:** Validação no frontend e backend com mensagem de erro específica.

### RN-USU-003: Autenticação Obrigatória
**Descrição:** Todas as funcionalidades do sistema requerem autenticação.
**Regra:** Usuários não autenticados devem ser redirecionados para a tela de login.
**Implementação:** Verificação de sessão em todas as páginas protegidas.

### RN-USU-004: Segregação de Dados
**Descrição:** Cada usuário só pode acessar seus próprios dados.
**Regra:** O sistema deve filtrar todas as consultas pelo ID do usuário logado.
**Implementação:** Filtro automático em todas as operações de dados.

---

## RN-DES: Gerenciamento de Despesas

### RN-DES-001: Classificação de Despesas
**Descrição:** As despesas devem ser classificadas em dois tipos distintos.
**Regra:** Toda despesa deve ser classificada como "Única" ou "Recorrente".
**Implementação:** Campo obrigatório no formulário de cadastro.

### RN-DES-002: Campos Obrigatórios
**Descrição:** Informações essenciais devem ser fornecidas para todas as despesas.
**Regra:** Os campos "Nome", "Valor" e "Categoria" são obrigatórios para qualquer tipo de despesa.
**Implementação:** Validação no frontend com mensagens de erro específicas.

### RN-DES-003: Validação de Valor
**Descrição:** O valor da despesa deve ser um número positivo.
**Regra:** Valores devem ser maiores que zero e aceitar até 2 casas decimais.
**Implementação:** Validação numérica com formatação automática para moeda brasileira.

### RN-DES-004: Data para Despesas Únicas
**Descrição:** Despesas únicas devem ter uma data específica de ocorrência.
**Regra:** Quando o tipo "Única" for selecionado, o campo "Data da Despesa" torna-se obrigatório.
**Implementação:** Validação condicional baseada no tipo selecionado.

### RN-DES-005: Ciclo e Data para Despesas Recorrentes
**Descrição:** Despesas recorrentes devem ter periodicidade e próxima data definidas.
**Regra:** Quando o tipo "Recorrente" for selecionado, os campos "Ciclo de Cobrança" e "Próxima Data de Cobrança" tornam-se obrigatórios.
**Implementação:** Validação condicional com opções de ciclo (Mensal, Anual).

### RN-DES-006: Atualização de Recorrência
**Descrição:** Despesas recorrentes devem ter suas datas atualizadas após cada cobrança.
**Regra:** Após o vencimento, a "Próxima Data de Cobrança" deve ser automaticamente calculada baseada no ciclo.
**Implementação:** Processo automático de atualização de datas.

### RN-DES-007: Confirmação de Exclusão
**Descrição:** A exclusão de despesas deve ser confirmada pelo usuário.
**Regra:** Antes de excluir uma despesa, o sistema deve exibir uma mensagem de confirmação.
**Implementação:** Modal de confirmação com opções "Confirmar" e "Cancelar".

---

## RN-CAL: Cálculos e Exibição de Dados

### RN-CAL-001: Fórmula de Gasto Mensal
**Descrição:** O cálculo do gasto mensal deve considerar todos os tipos de despesas.
**Regra:** Gasto Mensal = (Soma das Recorrentes Mensais) + (Soma das Recorrentes Anuais ÷ 12) + (Soma das Despesas Únicas do Mês Atual)
**Implementação:** Função de cálculo executada em tempo real após qualquer alteração.

### RN-CAL-002: Padrão Monetário
**Descrição:** Todos os valores devem ser exibidos no padrão monetário brasileiro.
**Regra:** Valores devem ser formatados como "R$ 1.234,56" com separador de milhares e vírgula decimal.
**Implementação:** Função de formatação aplicada em todas as exibições de valores.

### RN-CAL-003: Calendário para Despesas Recorrentes
**Descrição:** O calendário deve exibir apenas despesas recorrentes futuras.
**Regra:** Apenas despesas do tipo "Recorrente" devem aparecer no calendário, baseadas na "Próxima Data de Cobrança".
**Implementação:** Filtro por tipo de despesa na geração do calendário.

---

## RN-NOT: Notificações

### RN-NOT-001: Lembretes de Vencimento
**Descrição:** O sistema deve alertar sobre despesas próximas ao vencimento.
**Regra:** Despesas recorrentes com vencimento em até 7 dias devem ser destacadas no dashboard.
**Implementação:** Seção "Próximos Pagamentos" com lista ordenada por data.

---

## Status de Implementação

### Regras de Usuário
- ✅ RN-USU-001: Unicidade de E-mail
- ✅ RN-USU-002: Política de Senha
- ✅ RN-USU-003: Autenticação Obrigatória
- ✅ RN-USU-004: Segregação de Dados

### Regras de Despesas
- 🔄 RN-DES-001: Classificação de Despesas
- 🔄 RN-DES-002: Campos Obrigatórios
- 🔄 RN-DES-003: Validação de Valor
- 🔄 RN-DES-004: Data para Despesas Únicas
- 🔄 RN-DES-005: Ciclo e Data para Despesas Recorrentes
- ❌ RN-DES-006: Atualização de Recorrência
- 🔄 RN-DES-007: Confirmação de Exclusão

### Regras de Cálculo
- 🔄 RN-CAL-001: Fórmula de Gasto Mensal
- ✅ RN-CAL-002: Padrão Monetário
- 🔄 RN-CAL-003: Calendário para Despesas Recorrentes

### Regras de Notificação
- 🔄 RN-NOT-001: Lembretes de Vencimento

**Legenda:**
- ✅ Implementado
- 🔄 Em desenvolvimento
- ❌ Não implementado

---

## Notas de Implementação

### Persistência de Dados
- Utilização do localStorage para armazenamento local
- Estrutura de dados JSON para flexibilidade
- Backup automático a cada alteração

### Validações
- Validação dupla: frontend (UX) e lógica de negócio (integridade)
- Mensagens de erro claras e específicas
- Feedback visual imediato para o usuário

### Funcionalidades Futuras
- Exportação de dados para CSV/PDF
- Categorias personalizáveis
- Metas de gastos mensais
- Histórico de alterações

### Conformidade
- Interface responsiva para dispositivos móveis
- Acessibilidade básica (WCAG 2.1)
- Performance otimizada para carregamento rápido

---

**Versão:** 2.0  
**Última atualização:** Janeiro 2025  
**Responsável:** Equipe de Desenvolvimento  
**Status:** Regras Definidas - Implementação em Andamento