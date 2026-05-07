import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { Proposal } from "@/types/proposal";
import type { Company } from "@/types/auth";

export function generateProposalPDF(proposal: Proposal, company: Company) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  // Cores
  const primaryColor: [number, number, number] = [37, 99, 235]; // primary-600
  const textColor: [number, number, number] = [31, 41, 55]; // gray-800
  const lightGray: [number, number, number] = [243, 244, 246]; // gray-100

  // Helper para formatar moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Helper para formatar data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // ============================================
  // PÁGINA 1: CAPA
  // ============================================
  
  // Fundo gradiente (simulado com retângulo)
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Logo da empresa (se houver)
  if (company.logo) {
    // TODO: Adicionar logo quando disponível
  }

  // Título
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(32);
  doc.setFont("helvetica", "bold");
  doc.text("PROPOSTA COMERCIAL", pageWidth / 2, 80, { align: "center" });

  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text("Sistema de Energia Solar Fotovoltaica", pageWidth / 2, 95, { align: "center" });

  // Linha divisória
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.5);
  doc.line(40, 110, pageWidth - 40, 110);

  // Dados do cliente
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(proposal.client.name, pageWidth / 2, 130, { align: "center" });

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(proposal.client.address || "", pageWidth / 2, 140, { align: "center" });
  doc.text(
    `${proposal.client.city}, ${proposal.client.state}`,
    pageWidth / 2,
    148,
    { align: "center" }
  );

  // Linha divisória
  doc.line(40, 160, pageWidth - 40, 160);

  // Dados da empresa
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(company.name, pageWidth / 2, 175, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  if (company.cnpj) {
    doc.text(`CNPJ: ${company.cnpj}`, pageWidth / 2, 183, { align: "center" });
  }
  if (company.address) {
    doc.text(company.address, pageWidth / 2, 191, { align: "center" });
  }
  if (company.city && company.state) {
    doc.text(`${company.city}, ${company.state}`, pageWidth / 2, 199, { align: "center" });
  }
  if (company.phone) {
    doc.text(`Tel: ${company.phone}`, pageWidth / 2, 207, { align: "center" });
  }
  if (company.email) {
    doc.text(company.email, pageWidth / 2, 215, { align: "center" });
  }
  if (company.website) {
    doc.text(company.website, pageWidth / 2, 223, { align: "center" });
  }

  // Rodapé
  doc.setFontSize(9);
  doc.text(
    `Proposta válida até ${formatDate(proposal.validUntil)}`,
    pageWidth / 2,
    pageHeight - 20,
    { align: "center" }
  );
  doc.text(
    `Gerada em ${formatDate(proposal.createdAt)}`,
    pageWidth / 2,
    pageHeight - 13,
    { align: "center" }
  );

  // ============================================
  // PÁGINA 2: RESUMO EXECUTIVO
  // ============================================
  doc.addPage();
  yPosition = 20;

  // Header
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, pageWidth, 15, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("PROPOSTA COMERCIAL", 15, 10);
  doc.text(`#${proposal.id}`, pageWidth - 15, 10, { align: "right" });

  yPosition = 30;

  // Título da seção
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Resumo Executivo", 15, yPosition);
  yPosition += 10;

  // Descrição
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const resumoText = `Apresentamos proposta para instalação de sistema de energia solar fotovoltaica com potência de ${proposal.system.totalPower} kWp, capaz de gerar aproximadamente ${proposal.system.monthlyGeneration} kWh/mês, proporcionando uma economia anual de ${formatCurrency(proposal.financial.annualSavings)}.`;
  const splitText = doc.splitTextToSize(resumoText, pageWidth - 30);
  doc.text(splitText, 15, yPosition);
  yPosition += splitText.length * 5 + 10;

  // Cards de métricas
  const cardWidth = (pageWidth - 45) / 3;
  const cardHeight = 25;
  const cardY = yPosition;

  // Card 1: Potência
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.roundedRect(15, cardY, cardWidth, cardHeight, 3, 3, "F");
  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128); // gray-500
  doc.text("Potência Total", 15 + cardWidth / 2, cardY + 8, { align: "center" });
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(`${proposal.system.totalPower} kWp`, 15 + cardWidth / 2, cardY + 18, {
    align: "center",
  });

  // Card 2: Geração
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.roundedRect(15 + cardWidth + 7.5, cardY, cardWidth, cardHeight, 3, 3, "F");
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(107, 114, 128);
  doc.text("Geração Mensal", 15 + cardWidth + 7.5 + cardWidth / 2, cardY + 8, {
    align: "center",
  });
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(34, 197, 94); // green-600
  doc.text(
    `${proposal.system.monthlyGeneration} kWh`,
    15 + cardWidth + 7.5 + cardWidth / 2,
    cardY + 18,
    { align: "center" }
  );

  // Card 3: Investimento
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.roundedRect(15 + (cardWidth + 7.5) * 2, cardY, cardWidth, cardHeight, 3, 3, "F");
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(107, 114, 128);
  doc.text("Investimento", 15 + (cardWidth + 7.5) * 2 + cardWidth / 2, cardY + 8, {
    align: "center",
  });
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text(
    formatCurrency(proposal.financial.totalCost),
    15 + (cardWidth + 7.5) * 2 + cardWidth / 2,
    cardY + 18,
    { align: "center" }
  );

  yPosition = cardY + cardHeight + 15;

  // Tabela de informações
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text("Informações do Sistema", 15, yPosition);
  yPosition += 8;

  autoTable(doc, {
    startY: yPosition,
    head: [["Item", "Valor"]],
    body: [
      ["Tipo de Instalação", proposal.client.type],
      ["Geração Anual", `${proposal.system.annualGeneration.toLocaleString()} kWh`],
      ["Payback", `${proposal.financial.paybackYears.toFixed(1)} anos`],
      ["ROI (25 anos)", `${proposal.financial.roi.toFixed(0)}%`],
      ["Economia em 25 anos", formatCurrency(proposal.financial.savings25Years)],
    ],
    theme: "striped",
    headStyles: {
      fillColor: primaryColor,
      fontSize: 10,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 9,
    },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: "auto", fontStyle: "bold" },
    },
  });

  // ============================================
  // PÁGINA 3: EQUIPAMENTOS
  // ============================================
  doc.addPage();
  yPosition = 20;

  // Header
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, pageWidth, 15, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("PROPOSTA COMERCIAL", 15, 10);
  doc.text(`#${proposal.id}`, pageWidth - 15, 10, { align: "right" });

  yPosition = 30;

  // Título
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Equipamentos", 15, yPosition);
  yPosition += 10;

  // Módulos
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Módulos Fotovoltaicos", 15, yPosition);
  yPosition += 8;

  autoTable(doc, {
    startY: yPosition,
    head: [["Especificação", "Valor"]],
    body: [
      ["Fabricante", proposal.system.modules.manufacturer],
      ["Modelo", proposal.system.modules.model],
      ["Potência Unitária", `${proposal.system.modules.power}W`],
      ["Quantidade", `${proposal.system.modules.quantity} unidades`],
      [
        "Potência Total",
        `${((proposal.system.modules.power * proposal.system.modules.quantity) / 1000).toFixed(2)} kWp`,
      ],
    ],
    theme: "plain",
    headStyles: {
      fillColor: lightGray,
      textColor: textColor,
      fontSize: 9,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 9,
    },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: "auto", fontStyle: "bold" },
    },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 10;

  // Inversor
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Inversor", 15, yPosition);
  yPosition += 8;

  autoTable(doc, {
    startY: yPosition,
    head: [["Especificação", "Valor"]],
    body: [
      ["Fabricante", proposal.system.inverter.manufacturer],
      ["Modelo", proposal.system.inverter.model],
      ["Potência Nominal", `${proposal.system.inverter.power}W`],
      ["Quantidade", `${proposal.system.inverter.quantity} unidade(s)`],
    ],
    theme: "plain",
    headStyles: {
      fillColor: lightGray,
      textColor: textColor,
      fontSize: 9,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 9,
    },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: "auto", fontStyle: "bold" },
    },
  });

  // Baterias (se houver)
  if (proposal.system.batteries) {
    yPosition = (doc as any).lastAutoTable.finalY + 10;

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Bateria", 15, yPosition);
    yPosition += 8;

    autoTable(doc, {
      startY: yPosition,
      head: [["Especificação", "Valor"]],
      body: [
        ["Fabricante", proposal.system.batteries.manufacturer],
        ["Modelo", proposal.system.batteries.model],
        ["Capacidade", `${proposal.system.batteries.capacity} kWh`],
        ["Quantidade", `${proposal.system.batteries.quantity} unidade(s)`],
      ],
      theme: "plain",
      headStyles: {
        fillColor: lightGray,
        textColor: textColor,
        fontSize: 9,
        fontStyle: "bold",
      },
      bodyStyles: {
        fontSize: 9,
      },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: "auto", fontStyle: "bold" },
      },
    });
  }

  // ============================================
  // PÁGINA 4: INVESTIMENTO E ECONOMIA
  // ============================================
  doc.addPage();
  yPosition = 20;

  // Header
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, pageWidth, 15, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("PROPOSTA COMERCIAL", 15, 10);
  doc.text(`#${proposal.id}`, pageWidth - 15, 10, { align: "right" });

  yPosition = 30;

  // Título
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Investimento", 15, yPosition);
  yPosition += 10;

  // Tabela de investimento
  autoTable(doc, {
    startY: yPosition,
    head: [["Item", "Valor"]],
    body: [
      ["Equipamentos", formatCurrency(proposal.financial.equipmentCost)],
      ["Instalação", formatCurrency(proposal.financial.installationCost)],
      ["Projeto e Homologação", formatCurrency(proposal.financial.projectCost)],
    ],
    foot: [["TOTAL", formatCurrency(proposal.financial.totalCost)]],
    theme: "striped",
    headStyles: {
      fillColor: primaryColor,
      fontSize: 10,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 10,
    },
    footStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontSize: 11,
      fontStyle: "bold",
    },
    columnStyles: {
      0: { cellWidth: 120 },
      1: { cellWidth: "auto", halign: "right", fontStyle: "bold" },
    },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // Formas de pagamento
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Formas de Pagamento", 15, yPosition);
  yPosition += 8;

  const paymentBody = proposal.financial.paymentOptions.map((option) => {
    const details =
      option.installments > 1
        ? `${option.installments}x de ${formatCurrency(option.installmentValue)}`
        : "Pagamento único";
    const discount = option.discount ? `${option.discount}% desconto` : "-";
    return [option.name, details, discount, formatCurrency(option.totalValue)];
  });

  autoTable(doc, {
    startY: yPosition,
    head: [["Opção", "Parcelas", "Desconto", "Total"]],
    body: paymentBody,
    theme: "striped",
    headStyles: {
      fillColor: primaryColor,
      fontSize: 9,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 9,
    },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 60 },
      2: { cellWidth: 30, halign: "center" },
      3: { cellWidth: "auto", halign: "right", fontStyle: "bold" },
    },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // Economia
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Economia Estimada", 15, yPosition);
  yPosition += 8;

  autoTable(doc, {
    startY: yPosition,
    head: [["Período", "Economia"]],
    body: [
      ["Mensal", formatCurrency(proposal.financial.monthlySavings)],
      ["Anual", formatCurrency(proposal.financial.annualSavings)],
      ["25 anos", formatCurrency(proposal.financial.savings25Years)],
    ],
    theme: "striped",
    headStyles: {
      fillColor: [34, 197, 94], // green-600
      fontSize: 10,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 10,
    },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: "auto", halign: "right", fontStyle: "bold" },
    },
  });

  // ============================================
  // PÁGINA 5: GARANTIAS E TERMOS
  // ============================================
  doc.addPage();
  yPosition = 20;

  // Header
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, pageWidth, 15, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("PROPOSTA COMERCIAL", 15, 10);
  doc.text(`#${proposal.id}`, pageWidth - 15, 10, { align: "right" });

  yPosition = 30;

  // Garantias
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Garantias", 15, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const garantias = [
    "✓ Garantia de 25 anos de desempenho dos módulos fotovoltaicos",
    "✓ Garantia de 10 anos do fabricante para os módulos",
    "✓ Garantia de 5 anos para o inversor",
    "✓ Garantia de 1 ano para instalação e mão de obra",
  ];

  garantias.forEach((garantia) => {
    doc.text(garantia, 15, yPosition);
    yPosition += 7;
  });

  yPosition += 8;

  // Condições Gerais
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Condições Gerais", 15, yPosition);
  yPosition += 10;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const condicoes = [
    "• Proposta válida por 7 dias a partir da data de emissão",
    "• Valores sujeitos a alteração após vistoria técnica",
    "• Prazo de instalação: 30 a 45 dias após aprovação do projeto",
    "• Homologação junto à concessionária inclusa",
    "• Projeto elétrico e estrutural inclusos",
    "• Treinamento para operação do sistema",
    "• Monitoramento remoto do sistema",
    "• Suporte técnico durante toda a vida útil do sistema",
  ];

  condicoes.forEach((condicao) => {
    doc.text(condicao, 15, yPosition);
    yPosition += 6;
  });

  // Observações
  if (proposal.notes) {
    yPosition += 8;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Observações", 15, yPosition);
    yPosition += 8;

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const notesText = doc.splitTextToSize(proposal.notes, pageWidth - 30);
    doc.text(notesText, 15, yPosition);
  }

  // Rodapé
  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128);
  doc.text(
    company.proposalFooter || "Energia limpa e renovável para o seu futuro",
    pageWidth / 2,
    pageHeight - 20,
    { align: "center" }
  );
  doc.text(
    `${company.name} • ${company.phone} • ${company.email}`,
    pageWidth / 2,
    pageHeight - 13,
    { align: "center" }
  );

  // Salvar PDF
  doc.save(`Proposta_${proposal.id}_${proposal.client.name.replace(/\s+/g, "_")}.pdf`);
}
