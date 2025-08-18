# Regras de Negócio: Gerir.me

## Visão Geral

Este documento define as regras de negócio para o sistema "Gerir.me", uma aplicação web para controle financeiro pessoal que permite o gerenciamento de despesas únicas e recorrentes.

---

## RN-USU: Gerenciamento de Usuários

### RN-USU-001: Unicidade de E-mail
**Descrição:** Cada e-mail pode estar associado a apenas uma conta de usuário no sistema.
**Regra:** O sistema deve validar se o e-mail já existe antes de permitir o cadastro de um novo usuário.
**Implementação:** Verificação no momento do cadastro com mensagem de erro "E-mail já cadastrado".

### RN-USU-002: Política de Senha
**Descrição:** As senhas devem atender aos critérios mínimos de segurança.
**Regra:** A senha deve ter no mínimo 8 caracteres, contendo pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial.
**Implementação:** Validação no frontend e backend com mensagem de erro específica.

### RN-USU-003: Bloqueio por Tentativas de Login
**Descrição:** O sistema deve proteger contra ataques de força bruta.
**Regra:** Após 3 tentativas de login incorretas, a conta deve ser bloqueada por 15 minutos.
**Implementação:** Controle de tentativas com timestamp de bloqueio armazenado localmente.

### RN-USU-004: Autenticação Obrigatória
**Descrição:** Todas as funcionalidades do sistema requerem autenticação.
**Regra:** Usuários não autenticados devem ser redirecionados para a tela de login.
**Implementação:** Verificação de sessão em todas as páginas protegidas.

### RN-USU-005: Segregação de Dados
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

### RN-DES-004A: Validação de Data Passada
**Descrição:** Despesas únicas não podem ser cadastradas com datas no passado.
**Regra:** Para despesas do tipo "Única", a data selecionada deve ser igual ou posterior à data atual.
**Implementação:** Validação de data com mensagem de erro específica para datas passadas.

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

### RN-NOT-002: Notificações Push
**Descrição:** O sistema deve enviar notificações push para despesas próximas ao vencimento.
**Regra:** Despesas com vencimento em até 3 dias devem gerar notificações push no navegador.
**Implementação:** Solicitação de permissão de notificação e verificação automática a cada 30 minutos.

### RN-NOT-003: Controle de Duplicação
**Descrição:** Evitar notificações duplicadas para a mesma despesa.
**Regra:** Cada despesa deve gerar apenas uma notificação por dia.
**Implementação:** Controle de notificações já enviadas com base na data atual.

---

## RN-INT: Interface e Experiência do Usuário

### RN-INT-001: Alternância de Tema
**Descrição:** O sistema deve permitir alternância entre modo claro e escuro.
**Regra:** O usuário deve poder alternar entre os temas através de um botão no cabeçalho.
**Implementação:** Botão de alternância com ícones apropriados e aplicação imediata do tema.

### RN-INT-002: Persistência de Tema
**Descrição:** A preferência de tema deve ser mantida entre sessões.
**Regra:** A escolha do tema deve ser salva localmente e aplicada automaticamente no próximo acesso.
**Implementação:** Armazenamento da preferência no localStorage com inicialização automática.

### RN-INT-003: Feedback Visual de Tema
**Descrição:** O usuário deve receber feedback ao trocar de tema.
**Regra:** Uma notificação toast deve ser exibida confirmando a mudança de tema.
**Implementação:** Notificação temporária com mensagem de confirmação.

---

## Status de Implementação

### Regras de Usuário
- ✅ RN-USU-001: Unicidade de E-mail
- ✅ RN-USU-002: Política de Senha
- ✅ RN-USU-003: Bloqueio por Tentativas de Login
- ✅ RN-USU-004: Autenticação Obrigatória
- ✅ RN-USU-005: Segregação de Dados

### Regras de Despesas
- ✅ RN-DES-001: Classificação de Despesas
- ✅ RN-DES-002: Campos Obrigatórios
- ✅ RN-DES-003: Validação de Valor
- ✅ RN-DES-004: Data para Despesas Únicas
- ✅ RN-DES-004A: Validação de Data Passada
- ✅ RN-DES-005: Ciclo e Data para Despesas Recorrentes
- ✅ RN-DES-006: Atualização de Recorrência
- ✅ RN-DES-007: Confirmação de Exclusão

### Regras de Cálculo
- ✅ RN-CAL-001: Fórmula de Gasto Mensal
- ✅ RN-CAL-002: Padrão Monetário
- ✅ RN-CAL-003: Calendário para Despesas Recorrentes

### Regras de Notificação
- ✅ RN-NOT-001: Lembretes de Vencimento
- ✅ RN-NOT-002: Notificações Push
- ✅ RN-NOT-003: Controle de Duplicação

### Regras de Interface
- ✅ RN-INT-001: Alternância de Tema
- ✅ RN-INT-002: Persistência de Tema
- ✅ RN-INT-003: Feedback Visual de Tema

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

**Versão:** 3.0  
**Última atualização:** Janeiro 2025  
**Responsável:** Equipe de Desenvolvimento  
**Status:** Regras Definidas - Implementação Concluída