const fs = require('fs');
const path = require('path');

// Plugin para geração automática de relatórios de defeitos
class DefectReporter {
  constructor() {
    this.defects = [];
    this.defectCounter = 1;
    this.reportPath = path.join(__dirname, '../../docs/relatorio-defeitos-auto.md');
    this.htmlReportPath = path.join(__dirname, '../../docs/relatorio-defeitos.html');
  }

  // Mapear User Stories baseado no nome do arquivo de teste
  mapUserStory(specName) {
    const mapping = {
      'login.cy.js': 'HU02 - Como usuário, quero fazer login no sistema',
      'register.cy.js': 'HU01 - Como usuário, quero me cadastrar no sistema',
      'dashboard.cy.js': 'HU07 - Como usuário, quero visualizar meu dashboard com estatísticas',
      'lista-assinaturas.cy.js': 'HU04 - Como usuário, quero visualizar minhas assinaturas',
      'adicionar-assinatura.cy.js': 'HU03 - Como usuário, quero adicionar uma nova assinatura',
      'remover-assinatura.cy.js': 'HU06 - Como usuário, quero remover uma assinatura'
    };
    
    const fileName = path.basename(specName);
    return mapping[fileName] || 'User Story não mapeada';
  }

  // Determinar severidade baseada no tipo de teste
  determineSeverity(specName, testTitle) {
    const criticalTests = ['login', 'register', 'adicionar'];
    const fileName = path.basename(specName).toLowerCase();
    
    if (criticalTests.some(critical => fileName.includes(critical))) {
      return 'Alta';
    }
    return 'Média';
  }

  // Determinar prioridade baseada na severidade
  determinePriority(severity) {
    return severity === 'Alta' ? 'Alta' : 'Média';
  }

  // Adicionar defeito à lista
  addDefect(testResult) {
    const defectId = `DEF-${String(this.defectCounter).padStart(3, '0')}`;
    const specName = testResult.spec.name;
    const testTitle = testResult.title.join(' > ');
    const error = testResult.displayError || 'Erro não especificado';
    const severity = this.determineSeverity(specName, testTitle);
    const priority = this.determinePriority(severity);
    const userStory = this.mapUserStory(specName);
    
    const defect = {
      id: defectId,
      title: `Teste falha: ${testTitle}`,
      tester: 'Sistema Automatizado Cypress',
      dateTime: new Date().toLocaleString('pt-BR'),
      expectedResult: 'O teste deveria passar sem erros',
      actualResult: `Teste falhou com erro: ${error.split('\n')[0]}`,
      evidence: {
        video: `cypress/videos/${specName}.mp4`,
        screenshots: `cypress/screenshots/${specName}/`
      },
      priority,
      severity,
      softwareInfo: {
        version: '1.0.0',
        environment: 'Cypress Automatizado',
        url: 'http://localhost:8080'
      },
      traceability: {
        userStory,
        testFile: specName
      },
      status: 'Aberto'
    };

    this.defects.push(defect);
    this.defectCounter++;
  }

  // Gerar relatório em Markdown
  generateMarkdownReport() {
    if (this.defects.length === 0) {
      return;
    }

    let markdown = `# 🐛 Relatório Automático de Defeitos - Gerir.me\n\n`;
    markdown += `**Gerado automaticamente pelo Cypress em ${new Date().toLocaleString('pt-BR')}**\n\n`;
    markdown += `---\n\n`;

    // Gerar cada defeito
    this.defects.forEach(defect => {
      markdown += `## ${defect.id}\n\n`;
      markdown += `| Campo | Valor |\n`;
      markdown += `|-------|-------|\n`;
      markdown += `| **ID** | ${defect.id} |\n`;
      markdown += `| **Título** | ${defect.title} |\n`;
      markdown += `| **Testador** | ${defect.tester} |\n`;
      markdown += `| **Data e Hora** | ${defect.dateTime} |\n`;
      markdown += `| **Resultado Esperado** | ${defect.expectedResult} |\n`;
      markdown += `| **Resultado Atual** | ${defect.actualResult} |\n`;
      markdown += `| **Evidências** | Vídeo: \`${defect.evidence.video}\`<br>Screenshots: \`${defect.evidence.screenshots}\` |\n`;
      markdown += `| **Prioridade** | ${defect.priority} |\n`;
      markdown += `| **Severidade** | ${defect.severity} |\n`;
      markdown += `| **Informações sobre o Software** | Versão: ${defect.softwareInfo.version}<br>Ambiente: ${defect.softwareInfo.environment}<br>URL: ${defect.softwareInfo.url} |\n`;
      markdown += `| **Rastreabilidade** | ${defect.traceability.userStory}<br>Teste: \`${defect.traceability.testFile}\` |\n`;
      markdown += `| **Status** | ${defect.status} |\n\n`;
      markdown += `---\n\n`;
    });

    // Resumo estatístico
    const totalDefects = this.defects.length;
    const highSeverity = this.defects.filter(d => d.severity === 'Alta').length;
    const mediumSeverity = this.defects.filter(d => d.severity === 'Média').length;
    const highPriority = this.defects.filter(d => d.priority === 'Alta').length;
    const mediumPriority = this.defects.filter(d => d.priority === 'Média').length;

    markdown += `## 📊 Resumo dos Defeitos\n\n`;
    markdown += `| Status | Quantidade | Percentual |\n`;
    markdown += `|--------|------------|------------|\n`;
    markdown += `| **Aberto** | ${totalDefects} | 100% |\n`;
    markdown += `| **Total** | ${totalDefects} | 100% |\n\n`;
    
    markdown += `### Por Severidade:\n`;
    markdown += `- **Alta**: ${highSeverity} defeitos (${Math.round(highSeverity/totalDefects*100)}%)\n`;
    markdown += `- **Média**: ${mediumSeverity} defeitos (${Math.round(mediumSeverity/totalDefects*100)}%)\n\n`;
    
    markdown += `### Por Prioridade:\n`;
    markdown += `- **Alta**: ${highPriority} defeitos (${Math.round(highPriority/totalDefects*100)}%)\n`;
    markdown += `- **Média**: ${mediumPriority} defeitos (${Math.round(mediumPriority/totalDefects*100)}%)\n\n`;
    
    markdown += `---\n\n`;
    markdown += `**📅 Gerado em**: ${new Date().toLocaleString('pt-BR')}  \n`;
    markdown += `**🤖 Gerado por**: Sistema Automatizado Cypress  \n`;
    markdown += `**📋 Total de Defeitos**: ${totalDefects}\n`;

    // Salvar arquivo Markdown
    fs.writeFileSync(this.reportPath, markdown, 'utf8');
    console.log(`📋 Relatório de defeitos gerado: ${this.reportPath}`);
  }

  // Gerar relatório em HTML
  generateHtmlReport() {
    if (this.defects.length === 0) {
      return;
    }

    const totalDefects = this.defects.length;
    const highSeverity = this.defects.filter(d => d.severity === 'Alta').length;
    const mediumSeverity = this.defects.filter(d => d.severity === 'Média').length;
    const highPriority = this.defects.filter(d => d.priority === 'Alta').length;
    const mediumPriority = this.defects.filter(d => d.priority === 'Média').length;

    let html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório de Defeitos - Gerir.me</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #e74c3c;
        }
        .header h1 {
            color: #e74c3c;
            margin: 0;
            font-size: 2.5em;
        }
        .header p {
            color: #666;
            margin: 10px 0 0 0;
        }
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .summary-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
        }
        .summary-card h3 {
            margin: 0 0 10px 0;
            font-size: 2em;
        }
        .summary-card p {
            margin: 0;
            opacity: 0.9;
        }
        .defect {
            background: #fff;
            border: 1px solid #ddd;
            border-radius: 8px;
            margin-bottom: 20px;
            overflow: hidden;
        }
        .defect-header {
            background: #f8f9fa;
            padding: 15px 20px;
            border-bottom: 1px solid #ddd;
        }
        .defect-id {
            font-size: 1.2em;
            font-weight: bold;
            color: #e74c3c;
        }
        .defect-title {
            font-size: 1.1em;
            margin: 5px 0;
            color: #333;
        }
        .defect-body {
            padding: 20px;
        }
        .defect-table {
            width: 100%;
            border-collapse: collapse;
        }
        .defect-table th,
        .defect-table td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #eee;
        }
        .defect-table th {
            background: #f8f9fa;
            font-weight: bold;
            width: 200px;
        }
        .severity-high {
            background: #e74c3c;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.9em;
        }
        .severity-medium {
            background: #f39c12;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.9em;
        }
        .priority-high {
            background: #e74c3c;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.9em;
        }
        .priority-medium {
            background: #f39c12;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.9em;
        }
        .status-open {
            background: #e74c3c;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.9em;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🐛 Relatório de Defeitos</h1>
            <p>Gerir.me - Sistema de Gerenciamento de Despesas</p>
            <p>Gerado automaticamente em ${new Date().toLocaleString('pt-BR')}</p>
        </div>

        <div class="summary">
            <div class="summary-card">
                <h3>${totalDefects}</h3>
                <p>Total de Defeitos</p>
            </div>
            <div class="summary-card">
                <h3>${highSeverity}</h3>
                <p>Severidade Alta</p>
            </div>
            <div class="summary-card">
                <h3>${mediumSeverity}</h3>
                <p>Severidade Média</p>
            </div>
            <div class="summary-card">
                <h3>100%</h3>
                <p>Defeitos Abertos</p>
            </div>
        </div>
`;

    // Gerar cada defeito
    this.defects.forEach(defect => {
      html += `
        <div class="defect">
            <div class="defect-header">
                <div class="defect-id">${defect.id}</div>
                <div class="defect-title">${defect.title}</div>
            </div>
            <div class="defect-body">
                <table class="defect-table">
                    <tr>
                        <th>Testador</th>
                        <td>${defect.tester}</td>
                    </tr>
                    <tr>
                        <th>Data e Hora</th>
                        <td>${defect.dateTime}</td>
                    </tr>
                    <tr>
                        <th>Resultado Esperado</th>
                        <td>${defect.expectedResult}</td>
                    </tr>
                    <tr>
                        <th>Resultado Atual</th>
                        <td>${defect.actualResult}</td>
                    </tr>
                    <tr>
                        <th>Evidências</th>
                        <td>
                            <strong>Vídeo:</strong> <code>${defect.evidence.video}</code><br>
                            <strong>Screenshots:</strong> <code>${defect.evidence.screenshots}</code>
                        </td>
                    </tr>
                    <tr>
                        <th>Prioridade</th>
                        <td><span class="priority-${defect.priority.toLowerCase()}">${defect.priority}</span></td>
                    </tr>
                    <tr>
                        <th>Severidade</th>
                        <td><span class="severity-${defect.severity.toLowerCase()}">${defect.severity}</span></td>
                    </tr>
                    <tr>
                        <th>Informações do Software</th>
                        <td>
                            <strong>Versão:</strong> ${defect.softwareInfo.version}<br>
                            <strong>Ambiente:</strong> ${defect.softwareInfo.environment}<br>
                            <strong>URL:</strong> ${defect.softwareInfo.url}
                        </td>
                    </tr>
                    <tr>
                        <th>Rastreabilidade</th>
                        <td>
                            <strong>User Story:</strong> ${defect.traceability.userStory}<br>
                            <strong>Arquivo de Teste:</strong> <code>${defect.traceability.testFile}</code>
                        </td>
                    </tr>
                    <tr>
                        <th>Status</th>
                        <td><span class="status-open">${defect.status}</span></td>
                    </tr>
                </table>
            </div>
        </div>`;
    });

    html += `
        <div class="footer">
            <p>📅 Relatório gerado automaticamente pelo Cypress em ${new Date().toLocaleString('pt-BR')}</p>
            <p>🤖 Sistema Automatizado de Testes - Gerir.me v1.0.0</p>
        </div>
    </div>
</body>
</html>`;

    // Salvar arquivo HTML
    fs.writeFileSync(this.htmlReportPath, html, 'utf8');
    console.log(`🌐 Relatório HTML gerado: ${this.htmlReportPath}`);
  }

  // Gerar ambos os relatórios
  generateReports() {
    this.generateMarkdownReport();
    this.generateHtmlReport();
  }
}

// Instância global do reporter
const defectReporter = new DefectReporter();

// Plugin para Cypress
module.exports = (on, config) => {
  // Hook para capturar falhas de teste
  on('task', {
    // Adicionar defeito quando um teste falha
    addDefect(testResult) {
      defectReporter.addDefect(testResult);
      return null;
    },

    // Gerar relatórios ao final da execução
    generateDefectReports() {
      defectReporter.generateReports();
      return null;
    },

    // Limpar defeitos (para nova execução)
    clearDefects() {
      defectReporter.defects = [];
      defectReporter.defectCounter = 1;
      return null;
    }
  });

  return config;
};

module.exports.DefectReporter = DefectReporter;