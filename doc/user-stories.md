# SubsManager - User Stories

## 📋 Visão Geral

Este documento contém todas as user stories do sistema SubsManager, organizadas por épicos e mapeadas com os requisitos funcionais e casos de uso correspondentes.

---

## 🏗️ Estrutura das User Stories

Cada user story segue o formato padrão:
- **Como** [tipo de usuário]
- **Quero** [funcionalidade]
- **Para** [benefício/valor]

---

## 📚 Épicos e User Stories

### 🔐 Épico 1: Autenticação e Segurança

#### US001 - Criar Conta
- **Como** usuário novo
- **Quero** criar uma conta com email e senha
- **Para** gerenciar minhas despesas pessoais de forma segura

**Critérios de Aceitação:**
- ✅ Email deve ser único no sistema
- ✅ Senha deve ter no mínimo 6 caracteres
- ✅ Nome completo é obrigatório
- ✅ Após criação, usuário é logado automaticamente
- ✅ Dados são salvos no localStorage

**Mapeamento:**
- **Requisito**: RF001
- **Caso de Uso**: UC001
- **Prioridade**: Alta

---

#### US002 - Fazer Login
- **Como** usuário registrado
- **Quero** fazer login com email e senha
- **Para** acessar meus dados salvos e continuar gerenciando minhas despesas

**Critérios de Aceitação:**
- ✅ Login apenas com credenciais válidas
- ✅ Sessão persistente entre navegações
- ✅ Redirecionamento automático para dashboard
- ✅ Nome do usuário exibido no header
- ✅ Mensagem de erro para credenciais inválidas

**Mapeamento:**
- **Requisito**: RF002
- **Caso de Uso**: UC002
- **Prioridade**: Alta

---

#### US003 - Fazer Logout
- **Como** usuário logado
- **Quero** fazer logout do sistema
- **Para** proteger minha privacidade e encerrar minha sessão

**Critérios de Aceitação:**
- ✅ Botão de logout visível no header
- ✅ Sessão é limpa completamente
- ✅ Redirecionamento para tela de login
- ✅ Dados temporários são removidos

**Mapeamento:**
- **Requisito**: RF003
- **Caso de Uso**: UC003
- **Prioridade**: Média

---

#### US004 - Recuperar Senha
- **Como** usuário que esqueceu a senha
- **Quero** recuperar minha senha
- **Para** acessar minha conta novamente sem perder meus dados

**Critérios de Aceitação:**
- ✅ Link "Esqueci minha senha" na tela de login
- ✅ Formulário para inserir email cadastrado
- ✅ Simulação de envio de email de recuperação
- ✅ Mensagem de confirmação para o usuário
- ✅ Validação se email existe no sistema

**Mapeamento:**
- **Requisito**: RF004
- **Caso de Uso**: UC004
- **Prioridade**: Baixa

---

### 💰 Épico 2: Gerenciamento de Despesas

#### US005 - Adicionar Despesa
- **Como** usuário
- **Quero** adicionar uma nova despesa recorrente
- **Para** controlar meus gastos mensais e anuais

**Critérios de Aceitação:**
- ✅ Modal com formulário completo
- ✅ Campos obrigatórios: nome, preço, categoria, ciclo, data
- ✅ Categorias predefinidas disponíveis
- ✅ Ciclos: mensal e anual
- ✅ Status ativo por padrão
- ✅ Validação de campos obrigatórios
- ✅ Despesa salva no localStorage
- ✅ Lista atualizada automaticamente
- ✅ Dashboard recalculado
- ✅ Mensagem de sucesso

**Mapeamento:**
- **Requisito**: RF005
- **Caso de Uso**: UC005
- **Prioridade**: Alta

---

#### US006 - Visualizar Despesas
- **Como** usuário
- **Quero** visualizar todas minhas despesas em uma lista
- **Para** ter uma visão geral dos meus gastos recorrentes

**Critérios de Aceitação:**
- ✅ Lista paginada de despesas
- ✅ Informações exibidas: nome, valor, categoria, ciclo, data, status
- ✅ Ícones para cada categoria
- ✅ Valores formatados em moeda brasileira
- ✅ Botões de ação para cada despesa
- ✅ Ordenação por data de criação
- ✅ Mensagem quando não há despesas

**Mapeamento:**
- **Requisito**: RF006
- **Caso de Uso**: UC006
- **Prioridade**: Alta

---

#### US007 - Editar Despesa
- **Como** usuário
- **Quero** editar uma despesa existente
- **Para** manter as informações atualizadas quando houver mudanças

**Critérios de Aceitação:**
- ✅ Botão de edição em cada despesa
- ✅ Modal preenchido com dados atuais
- ✅ Possibilidade de alterar todos os campos
- ✅ Validação dos dados modificados
- ✅ Atualização no localStorage
- ✅ Lista e dashboard atualizados
- ✅ Mensagem de sucesso

**Mapeamento:**
- **Requisito**: RF007
- **Caso de Uso**: UC007
- **Prioridade**: Alta

---

#### US008 - Excluir Despesa
- **Como** usuário
- **Quero** excluir uma despesa
- **Para** remover gastos que não tenho mais

**Critérios de Aceitação:**
- ✅ Botão de exclusão em cada despesa
- ✅ Modal de confirmação com detalhes
- ✅ Opção de cancelar a exclusão
- ✅ Remoção definitiva do localStorage
- ✅ Lista e dashboard atualizados
- ✅ Mensagem de confirmação

**Mapeamento:**
- **Requisito**: RF008
- **Caso de Uso**: UC008
- **Prioridade**: Média

---

#### US009 - Ativar/Desativar Despesa
- **Como** usuário
- **Quero** ativar ou desativar uma despesa
- **Para** controlar quais despesas contam nos cálculos sem excluí-las

**Critérios de Aceitação:**
- ✅ Botão de toggle para status
- ✅ Indicador visual do status atual
- ✅ Despesas inativas não contam nos totais
- ✅ Atualização imediata do dashboard
- ✅ Mensagem de confirmação da ação

**Mapeamento:**
- **Requisito**: RF009
- **Caso de Uso**: UC009
- **Prioridade**: Média

---

#### US010 - Filtrar Despesas
- **Como** usuário
- **Quero** filtrar despesas por categoria e status
- **Para** encontrar gastos específicos mais facilmente

**Critérios de Aceitação:**
- ✅ Filtros por categoria (todas as categorias + "Todas")
- ✅ Filtros por status (Ativas/Inativas/Todas)
- ✅ Aplicação automática dos filtros
- ✅ Lista atualizada dinamicamente
- ✅ Contador de resultados
- ✅ Mensagem quando nenhuma despesa atende aos filtros

**Mapeamento:**
- **Requisito**: RF010
- **Caso de Uso**: UC010
- **Prioridade**: Baixa

---

### 📊 Épico 3: Dashboard e Relatórios

#### US011 - Ver Estatísticas Financeiras
- **Como** usuário
- **Quero** ver o total de gastos mensais e anuais
- **Para** controlar meu orçamento e planejar minhas finanças

**Critérios de Aceitação:**
- ✅ Card com total mensal calculado
- ✅ Card com total anual calculado
- ✅ Card com contador de despesas ativas
- ✅ Valores formatados em moeda brasileira
- ✅ Cálculos automáticos e precisos
- ✅ Atualização em tempo real

**Mapeamento:**
- **Requisito**: RF011
- **Caso de Uso**: UC011
- **Prioridade**: Alta

---

#### US012 - Ver Próximos Pagamentos
- **Como** usuário
- **Quero** ver os próximos pagamentos dos próximos 7 dias
- **Para** me preparar financeiramente e não esquecer de nenhum pagamento

**Critérios de Aceitação:**
- ✅ Lista dos próximos 7 dias
- ✅ Apenas despesas ativas
- ✅ Ordenação por data crescente
- ✅ Exibição de nome e valor
- ✅ Contador no card do dashboard
- ✅ Atualização automática

**Mapeamento:**
- **Requisito**: RF012
- **Caso de Uso**: UC011
- **Prioridade**: Média

---

#### US013 - Visualizar Gastos por Categoria
- **Como** usuário
- **Quero** visualizar um gráfico dos gastos por categoria
- **Para** identificar onde gasto mais e otimizar meu orçamento

**Critérios de Aceitação:**
- ✅ Gráfico de barras por categoria
- ✅ Apenas despesas ativas
- ✅ Valores convertidos para base mensal
- ✅ Cores distintas para cada categoria
- ✅ Atualização automática
- ✅ Mensagem quando não há dados

**Mapeamento:**
- **Requisito**: RF013
- **Caso de Uso**: UC011
- **Prioridade**: Baixa

---

### 📅 Épico 4: Calendário de Pagamentos

#### US014 - Visualizar Calendário Mensal
- **Como** usuário
- **Quero** ver um calendário mensal
- **Para** visualizar quando tenho pagamentos de forma visual e intuitiva

**Critérios de Aceitação:**
- ✅ Grade de calendário do mês atual
- ✅ Dias com pagamentos destacados
- ✅ Apenas despesas ativas consideradas
- ✅ Nome do mês/ano exibido
- ✅ Navegação entre meses funcional

**Mapeamento:**
- **Requisito**: RF014
- **Caso de Uso**: UC012
- **Prioridade**: Média

---

#### US015 - Navegar entre Meses
- **Como** usuário
- **Quero** navegar entre diferentes meses no calendário
- **Para** planejar pagamentos futuros e revisar pagamentos passados

**Critérios de Aceitação:**
- ✅ Setas de navegação (anterior/próximo)
- ✅ Atualização do título do mês/ano
- ✅ Recálculo dos pagamentos para o período
- ✅ Destaques atualizados para o novo mês
- ✅ Navegação fluida e responsiva

**Mapeamento:**
- **Requisito**: RF015
- **Caso de Uso**: UC013
- **Prioridade**: Baixa

---

#### US016 - Identificar Dias de Pagamento
- **Como** usuário
- **Quero** ver dias destacados no calendário
- **Para** identificar rapidamente quando tenho pagamentos agendados

**Critérios de Aceitação:**
- ✅ Destaque visual em dias com pagamentos
- ✅ Diferenciação clara de dias normais
- ✅ Apenas despesas ativas destacadas
- ✅ Consistência visual com o design

**Mapeamento:**
- **Requisito**: RF016
- **Caso de Uso**: UC012
- **Prioridade**: Baixa

---

## 📊 Resumo por Épico

| Épico | User Stories | Prioridade Alta | Prioridade Média | Prioridade Baixa |
|-------|--------------|-----------------|------------------|------------------|
| **🔐 Autenticação** | 4 | 2 | 1 | 1 |
| **💰 Despesas** | 6 | 3 | 2 | 1 |
| **📊 Dashboard** | 3 | 1 | 1 | 1 |
| **📅 Calendário** | 3 | 0 | 1 | 2 |
| **TOTAL** | **16** | **6** | **5** | **5** |

---

## 🎯 Mapeamento com Documentação

### Rastreabilidade Completa
Cada user story está mapeada com:
- **Requisitos Funcionais** (RF001-RF016)
- **Casos de Uso** (UC001-UC013)
- **Critérios de Aceitação** (CA001-CA009)
- **Implementação** (funções JavaScript)

### Documentos Relacionados
- **[Especificações Técnicas](especificacoes-tecnicas.md)**: Detalhamento técnico dos requisitos
- **[Casos de Uso](casos-de-uso.md)**: Fluxos detalhados de cada funcionalidade
- **[Matriz de Rastreabilidade](matriz-rastreabilidade.md)**: Mapeamento completo entre todos os artefatos

---

## 🚀 Roadmap de Implementação

### Sprint 1 - Fundação (Concluído ✅)
- US001: Criar Conta
- US002: Fazer Login
- US003: Fazer Logout
- US005: Adicionar Despesa
- US006: Visualizar Despesas

### Sprint 2 - Funcionalidades Core (Concluído ✅)
- US007: Editar Despesa
- US008: Excluir Despesa
- US009: Ativar/Desativar Despesa
- US011: Ver Estatísticas Financeiras

### Sprint 3 - Recursos Avançados (Concluído ✅)
- US010: Filtrar Despesas
- US012: Ver Próximos Pagamentos
- US013: Visualizar Gastos por Categoria
- US014: Visualizar Calendário Mensal
- US015: Navegar entre Meses
- US016: Identificar Dias de Pagamento

### Sprint 4 - Polimento (Concluído ✅)
- US004: Recuperar Senha
- Melhorias de UX/UI
- Testes e validações
- Documentação

---

## 📝 Notas de Implementação

### Padrões Seguidos
- Todas as user stories seguem o formato padrão
- Critérios de aceitação específicos e testáveis
- Mapeamento completo com artefatos técnicos
- Priorização baseada em valor para o usuário

### Status Atual
- **16/16 user stories implementadas** (100%)
- **Todos os critérios de aceitação atendidos**
- **Cobertura completa de funcionalidades**
- **Projeto finalizado e funcional**

---

**Documento criado em**: " + new Date().toLocaleDateString('pt-BR') + "
**Versão**: 1.0
**Autor**: Sistema SubsManager
**Status**: Todas as User Stories Implementadas ✅