# Homepage - Gerir.me

## Definição da Página Principal

**A homepage da aplicação Gerir.me é o Dashboard.**

### Comportamento após Login

Quando o usuário faz login com sucesso na aplicação, ele é automaticamente direcionado para o **Dashboard**, que serve como a página principal (homepage) do sistema.

### Características do Dashboard (Homepage)

#### 📊 Visão Geral
- **Título**: "Dashboard"
- **Subtítulo**: "Visão geral das suas despesas"
- **Seção ativa por padrão**: `dashboard`
- **Navegação**: Link "Dashboard" ativo na barra de navegação

#### 📈 Componentes Principais

1. **Cartões de Estatísticas (Stats Grid)**:
   - 💰 **Gasto Mensal**: Valor total das despesas mensais
   - 📅 **Gasto Anual**: Valor total das despesas anuais
   - ✅ **Despesas Ativas**: Quantidade de despesas ativas
   - 🔔 **Próximos Pagamentos**: Quantidade de pagamentos próximos

2. **Grade do Dashboard (Dashboard Grid)**:
   - 📋 **Próximos Pagamentos**: Lista dos pagamentos que vencem em breve
   - 📊 **Gastos por Categoria**: Gráfico visual da distribuição de gastos

#### 🔧 Implementação Técnica

**Arquivo**: `script.js`
**Classe**: `SubscriptionManager`
**Método de inicialização**: `init()`

```javascript
init() {
    this.bindEvents();
    this.renderDashboard();
    this.renderSubscriptions();
    this.renderCalendar();
    this.showSection('dashboard'); // Define Dashboard como seção ativa
}
```

**Renderização**: `renderDashboard()`
- Calcula estatísticas em tempo real
- Atualiza cartões de informações
- Renderiza próximos pagamentos
- Gera gráfico de categorias

#### 🎯 Objetivo da Homepage

O Dashboard serve como **centro de controle** da aplicação, oferecendo:
- **Visão consolidada** de todas as despesas
- **Informações críticas** em destaque
- **Acesso rápido** às funcionalidades principais
- **Experiência intuitiva** para o usuário

#### 🚀 Acesso

**URL Local**: `file:///[caminho]/index.html`
**Credenciais Demo**:
- E-mail: `demo@gerir.me`
- Senha: `123456`

---

*Esta definição garante que todos os desenvolvedores e usuários compreendam claramente qual é a página principal da aplicação Gerir.me.*