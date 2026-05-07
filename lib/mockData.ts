import type { Board, User } from "@/types/board";

export const mockMembers: User[] = [
  { id: "1", name: "João Silva", email: "joao@solarsystem.com" },
  { id: "2", name: "Maria Santos", email: "maria@solarsystem.com" },
  { id: "3", name: "Pedro Costa", email: "pedro@solarsystem.com" },
  { id: "4", name: "Ana Oliveira", email: "ana@solarsystem.com" },
  { id: "5", name: "Carlos Souza", email: "carlos@solarsystem.com" },
  { id: "6", name: "Juliana Lima", email: "juliana@solarsystem.com" },
  { id: "7", name: "Roberto Alves", email: "roberto@solarsystem.com" },
];

export const mockLabels = [
  "Residencial",
  "Comercial",
  "Industrial",
  "Urgente",
  "Híbrido",
  "On-Grid",
  "Off-Grid",
  "Aguardando Cliente",
  "Revisão Técnica",
  "Aprovado",
];

export const mockBoard: Board = {
  id: "1",
  title: "Projetos Fotovoltaicos 2026",
  members: mockMembers,
  availableLabels: mockLabels,
  columns: [
    {
      id: "col-1",
      title: "📥 Leads",
      cards: [
        {
          id: "card-1",
          title: "Cliente Residencial - João Silva",
          description:
            "Cliente interessado em sistema de 5kWp para residência. Consumo médio de 350 kWh/mês. Telhado com boa incidência solar.",
          labels: ["Residencial", "Urgente"],
          assignees: ["1", "2"],
          priority: "high",
          dueDate: "2026-05-08",
          createdAt: "2026-05-01T10:00:00Z",
          updatedAt: "2026-05-04T14:30:00Z",
        },
        {
          id: "card-2",
          title: "Empresa ABC Ltda - Sistema Comercial",
          description:
            "Cotação para sistema comercial 50kWp. Empresa do setor de varejo com alto consumo diurno. Interessados em financiamento.",
          labels: ["Comercial", "On-Grid"],
          assignees: ["2"],
          priority: "medium",
          dueDate: "2026-05-15",
          createdAt: "2026-05-02T09:15:00Z",
          updatedAt: "2026-05-03T16:20:00Z",
        },
        {
          id: "card-3",
          title: "Fazenda Solar - Agronegócio",
          description:
            "Proprietário de fazenda interessado em sistema para irrigação. Área rural sem rede elétrica próxima.",
          labels: ["Off-Grid", "Comercial"],
          assignees: ["3"],
          priority: "low",
          createdAt: "2026-05-03T11:00:00Z",
          updatedAt: "2026-05-03T11:00:00Z",
        },
      ],
    },
    {
      id: "col-2",
      title: "📐 Dimensionamento",
      cards: [
        {
          id: "card-4",
          title: "Residência Maria Santos - Sistema Híbrido",
          description:
            "Sistema híbrido 8kWp com banco de baterias. Cliente quer autonomia para quedas de energia. Consumo: 450 kWh/mês.",
          labels: ["Residencial", "Híbrido"],
          assignees: ["3", "4"],
          priority: "medium",
          dueDate: "2026-05-12",
          createdAt: "2026-04-28T08:00:00Z",
          updatedAt: "2026-05-04T10:15:00Z",
        },
        {
          id: "card-5",
          title: "Condomínio Residencial - 20 Unidades",
          description:
            "Projeto de geração compartilhada para condomínio. Sistema de 30kWp para reduzir custos das áreas comuns.",
          labels: ["Residencial", "On-Grid"],
          assignees: ["3"],
          priority: "high",
          dueDate: "2026-05-10",
          createdAt: "2026-04-30T14:00:00Z",
          updatedAt: "2026-05-04T09:00:00Z",
        },
      ],
    },
    {
      id: "col-3",
      title: "📄 Proposta",
      cards: [
        {
          id: "card-6",
          title: "Indústria XYZ - Sistema 100kWp",
          description:
            "Sistema on-grid 100kWp para indústria metalúrgica. Proposta com payback de 4 anos. Incluindo estrutura de solo.",
          labels: ["Industrial", "On-Grid", "Revisão Técnica"],
          assignees: ["4", "5"],
          priority: "high",
          dueDate: "2026-05-09",
          createdAt: "2026-04-25T10:00:00Z",
          updatedAt: "2026-05-04T15:45:00Z",
        },
        {
          id: "card-7",
          title: "Supermercado Regional - 75kWp",
          description:
            "Proposta para rede de supermercados. Sistema de 75kWp com monitoramento remoto. Cliente solicitou 3 cenários de financiamento.",
          labels: ["Comercial", "On-Grid"],
          assignees: ["4"],
          priority: "medium",
          dueDate: "2026-05-14",
          createdAt: "2026-04-27T13:30:00Z",
          updatedAt: "2026-05-02T11:20:00Z",
        },
      ],
    },
    {
      id: "col-4",
      title: "🤝 Negociação",
      cards: [
        {
          id: "card-8",
          title: "Hotel Boutique - Sistema 40kWp",
          description:
            "Negociando condições de pagamento. Cliente quer parcelamento em 24x. Sistema on-grid para hotel com piscina aquecida.",
          labels: ["Comercial", "On-Grid", "Aguardando Cliente"],
          assignees: ["5", "2"],
          priority: "medium",
          dueDate: "2026-05-11",
          createdAt: "2026-04-20T09:00:00Z",
          updatedAt: "2026-05-04T16:00:00Z",
        },
        {
          id: "card-9",
          title: "Residência Premium - Sistema 12kWp",
          description:
            "Cliente de alto padrão. Sistema híbrido com baterias de lítio. Aguardando aprovação do projeto pela prefeitura.",
          labels: ["Residencial", "Híbrido", "Aguardando Cliente"],
          assignees: ["1", "3"],
          priority: "low",
          createdAt: "2026-04-22T15:00:00Z",
          updatedAt: "2026-05-01T10:30:00Z",
        },
      ],
    },
    {
      id: "col-5",
      title: "🔧 Instalação",
      cards: [
        {
          id: "card-10",
          title: "Residência Carlos - 6kWp",
          description:
            "Instalação em andamento. Estrutura montada, aguardando conexão elétrica. Previsão de conclusão em 3 dias.",
          labels: ["Residencial", "On-Grid", "Aprovado"],
          assignees: ["6", "7"],
          priority: "high",
          dueDate: "2026-05-07",
          createdAt: "2026-04-15T08:00:00Z",
          updatedAt: "2026-05-04T17:00:00Z",
        },
        {
          id: "card-11",
          title: "Posto de Gasolina - 25kWp",
          description:
            "Instalação programada para próxima semana. Equipamentos já entregues no local. Equipe de 4 instaladores alocada.",
          labels: ["Comercial", "On-Grid"],
          assignees: ["6", "7"],
          priority: "medium",
          dueDate: "2026-05-13",
          createdAt: "2026-04-18T10:00:00Z",
          updatedAt: "2026-05-03T14:00:00Z",
        },
      ],
    },
    {
      id: "col-6",
      title: "✅ Concluído",
      cards: [
        {
          id: "card-12",
          title: "Clínica Médica - 15kWp",
          description:
            "Projeto concluído com sucesso. Sistema gerando 100% da energia esperada. Cliente muito satisfeito. Solicitou indicação para amigos.",
          labels: ["Comercial", "On-Grid", "Aprovado"],
          assignees: ["1", "6"],
          priority: "low",
          createdAt: "2026-03-10T08:00:00Z",
          updatedAt: "2026-04-30T16:00:00Z",
        },
        {
          id: "card-13",
          title: "Residência Ana - 4kWp",
          description:
            "Sistema instalado e homologado pela concessionária. Cliente recebeu treinamento sobre monitoramento. Garantia ativada.",
          labels: ["Residencial", "On-Grid", "Aprovado"],
          assignees: ["1"],
          priority: "low",
          createdAt: "2026-03-15T09:00:00Z",
          updatedAt: "2026-04-28T12:00:00Z",
        },
      ],
    },
  ],
};
