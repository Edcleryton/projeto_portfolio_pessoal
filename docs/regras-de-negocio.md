# Regras de Negócio - Gerir.me

**Projeto:** Gerir.me - Gerenciador de Despesas  
**Versão:** 1.0  
**Data:** Dezembro 2024  
**Autor:** Equipe de Desenvolvimento  

---

## 📋 Visão Geral

Este documento define as regras de negócio essenciais que governam o funcionamento do sistema Gerir.me. Estas regras servem como guia para a equipe de desenvolvimento e testes, garantindo que a lógica do produto atenda aos objetivos estabelecidos.

---

## 🔐 RN-USU: Gerenciamento de Usuários e Acesso

### RN-USU-001: Unicidade de E-mail
**Descrição:** Cada conta de usuário deve ser associada a um endereço de e-mail único.  
**Regra:** Não é permitido o cadastro de duas contas com o mesmo e-mail.  
**Implementação:** Validação no momento do cadastro com verificação na base de dados local.

### RN-USU-002: Política de Senha
**Descrição:** A senha do usuário deve atender critérios mínimos de segurança.  
**Regra:** Senha deve conter no mínimo 8 caracteres, incluindo pelo menos uma letra e um número.  
**Implementação:** Validação client-side com regex e feedback visual ao usuário.

### RN-USU-003: Autenticação Obrigatória
**Descrição:** Controle de acesso às funcionalidades do sistema.  
**Regra:** O acesso a qualquer funcionalidade de gerenciamento de despesas (visualizar, cadastrar, editar, remover) exige que o usuário esteja autenticado (logado) no sistema.  
**Implementação:** Verificação de sessão ativa antes de carregar as telas principais.

### RN-USU-004: Segregação de Dados
**Descrição:** Isolamento de dados por usuário.  
**Regra:** Um usuário só pode visualizar e gerenciar as despesas que ele próprio cadastrou. É proibido o acesso aos dados de outros usuários.  
**Implementação:** Filtro por ID do usuário em todas as operações de dados.

---

## 💰 RN-SUB: Gerenciamento de Despesas

### RN-SUB-001: Campos Obrigatórios para Cadastro
**Descrição:** Definição dos campos essenciais para cadastro de despesas.  
**Regra:** Para cadastrar uma nova despesa, os campos "Nome", "Valor", "Ciclo de Cobrança" e "Próxima Data de Cobrança" são de preenchimento obrigatório.  
**Implementação:** Validação de formulário com mensagens de erro específicas.

### RN-SUB-002: Validade do Valor
**Descrição:** Controle de valores monetários válidos.  
**Regra:** O campo "Valor" da despesa deve ser um número positivo (maior que zero). Não são permitidos valores negativos ou zerados.  
**Implementação:** Validação numérica com input type="number" e min="0.01".

### RN-SUB-003: Validade da Data de Cobrança
**Descrição:** Controle de datas futuras para cobrança.  
**Regra:** A "Próxima Data de Cobrança" informada no momento do cadastro ou edição não pode ser uma data no passado. Deve ser igual ou posterior à data atual.  
**Implementação:** Validação de data com comparação à data atual do sistema.

### RN-SUB-004: Atualização Automática da Data de Cobrança
**Descrição:** Recorrência automática das despesas.  
**Regra:** Após a "Próxima Data de Cobrança" de uma despesa ser atingida, o sistema deve automaticamente atualizar este campo para a data do próximo ciclo:  
- **Mensal:** a data avança em um mês (ex: 15/08 se torna 15/09)  
- **Anual:** a data avança em um ano (ex: 15/08/2025 se torna 15/08/2026)  
**Implementação:** Processo automático executado na inicialização da aplicação.

### RN-SUB-005: Confirmação de Exclusão
**Descrição:** Proteção contra exclusões acidentais.  
**Regra:** A exclusão de uma despesa é uma ação irreversível. O sistema deve sempre solicitar uma confirmação explícita do usuário antes de remover permanentemente o registro.  
**Implementação:** Modal de confirmação com botões "Confirmar" e "Cancelar".

---

## 📊 RN-CAL: Cálculos e Exibição de Dados

### RN-CAL-001: Fórmula do Custo Mensal Total
**Descrição:** Cálculo padronizado do gasto mensal.  
**Regra:** O valor exibido no dashboard como "Custo Mensal Total" deve ser calculado pela seguinte fórmula:  
`Soma de todos os valores de despesas mensais + (Soma de todos os valores de despesas anuais / 12)`  
**Implementação:** Função JavaScript que processa todas as despesas ativas do usuário.

### RN-CAL-002: Padrão Monetário
**Descrição:** Formatação consistente de valores.  
**Regra:** Todos os valores monetários no sistema serão tratados e exibidos na moeda Real (BRL), com o formato R$ XX,XX.  
**Implementação:** Função de formatação usando Intl.NumberFormat com locale 'pt-BR'.

### RN-CAL-003: Exibição no Calendário
**Descrição:** Indicadores visuais de vencimentos.  
**Regra:** O calendário deve exibir um indicador nos dias que correspondem à "Próxima Data de Cobrança" de uma ou mais despesas ativas do usuário.  
**Implementação:** Marcação visual com classes CSS específicas nos dias com vencimentos.

---

## 🔔 RN-NOT: Notificações (Regra de Valor Agregado)

### RN-NOT-001: Lembrete de Cobrança
**Descrição:** Sistema de alertas preventivos.  
**Regra:** O sistema deverá enviar uma notificação (por e-mail, por exemplo) para o usuário 3 (três) dias antes da "Próxima Data de Cobrança" de cada despesa, como um lembrete.  
**Status:** Funcionalidade futura - não implementada na versão atual.  
**Implementação Futura:** Integração com serviço de e-mail ou notificações push.

---

## ⚙️ RN-GER: Regras Gerais do Sistema

### RN-GER-001: Exclusão de Conta de Usuário
**Descrição:** Conformidade com leis de proteção de dados.  
**Regra:** Se um usuário solicitar a exclusão de sua conta, todos os seus dados pessoais e registros de despesas associados devem ser permanentemente removidos do sistema, em conformidade com as leis de proteção de dados.  
**Status:** Funcionalidade futura - não implementada na versão atual.  
**Implementação Futura:** Funcionalidade de exclusão completa de conta nas configurações do usuário.

---

## 📈 Status de Implementação

| Regra | Status | Observações |
|-------|--------|-------------|
| RN-USU-001 | ✅ Implementada | Validação ativa no cadastro |
| RN-USU-002 | ✅ Implementada | Validação de senha funcional |
| RN-USU-003 | ✅ Implementada | Controle de sessão ativo |
| RN-USU-004 | ✅ Implementada | Dados isolados por usuário |
| RN-SUB-001 | ✅ Implementada | Validação de campos obrigatórios |
| RN-SUB-002 | ✅ Implementada | Validação de valores positivos |
| RN-SUB-003 | ✅ Implementada | Validação de datas futuras |
| RN-SUB-004 | ✅ Implementada | Atualização automática de datas |
| RN-SUB-005 | ✅ Implementada | Modal de confirmação |
| RN-CAL-001 | ✅ Implementada | Cálculo no dashboard |
| RN-CAL-002 | ✅ Implementada | Formatação BRL |
| RN-CAL-003 | ✅ Implementada | Indicadores no calendário |
| RN-NOT-001 | ⏳ Futura | Notificações por e-mail |
| RN-GER-001 | ⏳ Futura | Exclusão completa de conta |

---

## 🔄 Versionamento

| Versão | Data | Alterações |
|--------|------|------------|
| 1.0 | Dezembro 2024 | Versão inicial com regras implementadas |

---

## 📝 Notas de Implementação

1. **Persistência de Dados:** Todas as regras são aplicadas considerando o armazenamento local (localStorage) do navegador.

2. **Validações:** As validações são realizadas tanto no frontend (experiência do usuário) quanto na lógica de negócio (integridade dos dados).

3. **Funcionalidades Futuras:** As regras RN-NOT-001 e RN-GER-001 estão documentadas para implementação em versões futuras do sistema.

4. **Conformidade:** Todas as regras implementadas seguem as melhores práticas de desenvolvimento web e experiência do usuário.

---

*Este documento deve ser atualizado sempre que novas regras forem definidas ou regras existentes forem modificadas.*