# 🧪 Testes Cypress - Gerir.me

## 📹 Gravação de Vídeo e Screenshots

### Configurações Ativadas:
- ✅ **Vídeos automáticos** para todos os testes
- ✅ **Screenshots** em pontos importantes
- ✅ **Screenshots automáticos** em falhas
- ✅ **Relatórios visuais** com Mochawesome

### Como Executar:

```bash
# Abrir interface do Cypress
npm test

# Executar testes em modo headless (gera vídeos)
npm run test:run

# Executar com relatório visual completo
npm run test:report
```

### 📁 Arquivos Gerados:

- **Vídeos**: `cypress/videos/`
- **Screenshots**: `cypress/screenshots/`
- **Relatórios**: `cypress/reports/`

### 🎬 Screenshots nos Testes:

Cada teste inclui screenshots em momentos importantes:
- Tela inicial
- Dados preenchidos
- Ações realizadas
- Resultados finais

### 📊 Relatório Visual:

O relatório Mochawesome gera:
- Dashboard com estatísticas
- Screenshots integrados
- Detalhes de cada teste
- Tempo de execução
- Status de aprovação/falha