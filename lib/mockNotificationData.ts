import type { Notification, NotificationType } from "@/types/notification";

// Dados mock de notificações
export const generateMockNotifications = (userId: string, count: number = 50): Notification[] => {
  const notifications: Notification[] = [];
  
  const types: NotificationType[] = [
    "PROPOSTA_ACEITA",
    "PROPOSTA_REJEITADA",
    "NOVO_CLIENTE",
    "CLIENTE_ATUALIZADO",
    "CARD_ATRIBUIDO",
    "CARD_MOVIDO",
    "COMENTARIO",
    "VENCIMENTO_PROXIMO",
    "TAREFA_CONCLUIDA",
    "MEMBRO_ADICIONADO",
    "SISTEMA",
  ];
  
  const titles: Record<NotificationType, string[]> = {
    PROPOSTA_ACEITA: [
      "Proposta aceita!",
      "Cliente aceitou sua proposta",
      "Boa notícia! Proposta aprovada",
    ],
    PROPOSTA_REJEITADA: [
      "Proposta rejeitada",
      "Cliente recusou a proposta",
    ],
    NOVO_CLIENTE: [
      "Novo cliente cadastrado",
      "Cliente adicionado ao sistema",
    ],
    CLIENTE_ATUALIZADO: [
      "Cliente atualizado",
      "Informações do cliente alteradas",
    ],
    CARD_ATRIBUIDO: [
      "Card atribuído a você",
      "Nova tarefa atribuída",
    ],
    CARD_MOVIDO: [
      "Card movido",
      "Status do card alterado",
    ],
    COMENTARIO: [
      "Novo comentário",
      "Alguém comentou em seu card",
    ],
    VENCIMENTO_PROXIMO: [
      "Prazo próximo do vencimento",
      "Atenção: tarefa vence em breve",
    ],
    TAREFA_CONCLUIDA: [
      "Tarefa concluída",
      "Card marcado como concluído",
    ],
    MEMBRO_ADICIONADO: [
      "Novo membro na equipe",
      "Membro adicionado ao projeto",
    ],
    SISTEMA: [
      "Atualização do sistema",
      "Manutenção programada",
    ],
  };
  
  const messages: Record<NotificationType, string[]> = {
    PROPOSTA_ACEITA: [
      "PROPOSTA NUTRI SOLAR - LUIZ ANTONIO foi aceita para o projeto COT.5580 LUIZ ANTONIO DE OLIVEIRA",
      "Cliente aprovou a proposta de R$ 45.000 para instalação de 10kWp",
      "Proposta #1234 foi aceita. Entre em contato com o cliente para próximos passos",
    ],
    PROPOSTA_REJEITADA: [
      "Cliente recusou a proposta. Motivo: Preço acima do orçamento",
      "Proposta #5678 foi rejeitada. Considere revisar os valores",
    ],
    NOVO_CLIENTE: [
      "João Silva foi cadastrado como novo cliente",
      "Maria Santos - Residencial - São Paulo foi adicionada ao sistema",
    ],
    CLIENTE_ATUALIZADO: [
      "Informações de contato de Pedro Costa foram atualizadas",
      "Status do cliente Ana Lima alterado para NEGOCIACAO",
    ],
    CARD_ATRIBUIDO: [
      "Carlos Silva atribuiu o card 'Dimensionamento Residencial' a você",
      "Você foi adicionado ao card 'Instalação Comercial - 50kWp'",
    ],
    CARD_MOVIDO: [
      "Card 'Projeto Solar Tech' foi movido para 'Em Andamento'",
      "Status alterado: 'Vistoria Técnica' → 'Aguardando Aprovação'",
    ],
    COMENTARIO: [
      "Ana Costa comentou: 'Precisamos revisar o dimensionamento'",
      "Carlos Silva mencionou você em um comentário",
    ],
    VENCIMENTO_PROXIMO: [
      "O card 'Instalação Residencial' vence em 2 dias",
      "Atenção: Proposta para cliente João Silva vence amanhã",
    ],
    TAREFA_CONCLUIDA: [
      "Maria Santos concluiu o card 'Vistoria Técnica'",
      "Card 'Dimensionamento' foi marcado como concluído",
    ],
    MEMBRO_ADICIONADO: [
      "Pedro Costa foi adicionado à equipe Solar Tech",
      "Novo instalador: Roberto Lima - Acesso: MEMBER",
    ],
    SISTEMA: [
      "Nova versão disponível: v2.1.0 com melhorias de performance",
      "Manutenção programada para domingo às 02:00",
    ],
  };
  
  const userNames = ["Carlos Silva", "Ana Costa", "Pedro Lima", "Maria Santos", "João Oliveira"];
  
  for (let i = 0; i < count; i++) {
    const type = types[i % types.length];
    const titleOptions = titles[type];
    const messageOptions = messages[type];
    const daysAgo = Math.floor(i / 5); // Agrupa por dias
    const hoursAgo = i % 24;
    
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - daysAgo);
    createdAt.setHours(createdAt.getHours() - hoursAgo);
    
    notifications.push({
      id: `notif-${i + 1}`,
      type,
      title: titleOptions[i % titleOptions.length],
      message: messageOptions[i % messageOptions.length],
      read: i > 5, // Primeiras 5 não lidas
      createdAt: createdAt.toISOString(),
      userId,
      
      // URLs de ação baseadas no tipo
      actionUrl: type === "PROPOSTA_ACEITA" || type === "PROPOSTA_REJEITADA" 
        ? `/clients/client-${(i % 10) + 1}`
        : type === "NOVO_CLIENTE" || type === "CLIENTE_ATUALIZADO"
        ? `/clients/client-${(i % 10) + 1}`
        : type === "CARD_ATRIBUIDO" || type === "CARD_MOVIDO" || type === "COMENTARIO"
        ? `/board`
        : undefined,
      
      actionLabel: type === "PROPOSTA_ACEITA" || type === "PROPOSTA_REJEITADA"
        ? "Ver proposta"
        : type === "NOVO_CLIENTE" || type === "CLIENTE_ATUALIZADO"
        ? "Ver cliente"
        : type === "CARD_ATRIBUIDO" || type === "CARD_MOVIDO" || type === "COMENTARIO"
        ? "Ver card"
        : undefined,
      
      relatedEntityId: `entity-${i + 1}`,
      relatedEntityType: type.includes("PROPOSTA") ? "PROPOSAL" : type.includes("CLIENTE") ? "CLIENT" : type.includes("CARD") ? "CARD" : undefined,
      
      fromUserId: i % 2 === 0 ? `user-${(i % 5) + 1}` : undefined,
      fromUserName: i % 2 === 0 ? userNames[i % userNames.length] : undefined,
    });
  }
  
  return notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

let cachedNotifications: Record<string, Notification[]> = {};

export const getNotifications = (userId: string): Notification[] => {
  if (!cachedNotifications[userId]) {
    cachedNotifications[userId] = generateMockNotifications(userId, 50);
  }
  return cachedNotifications[userId];
};

export const getUnreadCount = (userId: string): number => {
  return getNotifications(userId).filter((n) => !n.read).length;
};

export const markAsRead = (userId: string, notificationId: string): void => {
  const notifications = getNotifications(userId);
  const notification = notifications.find((n) => n.id === notificationId);
  if (notification) {
    notification.read = true;
  }
};

export const markAllAsRead = (userId: string): void => {
  const notifications = getNotifications(userId);
  notifications.forEach((n) => (n.read = true));
};

export const deleteNotification = (userId: string, notificationId: string): void => {
  cachedNotifications[userId] = getNotifications(userId).filter((n) => n.id !== notificationId);
};

export const filterNotifications = (
  userId: string,
  filters: {
    read?: boolean;
    type?: string;
    startDate?: string;
    endDate?: string;
  }
): Notification[] => {
  let filtered = getNotifications(userId);
  
  if (filters.read !== undefined) {
    filtered = filtered.filter((n) => n.read === filters.read);
  }
  
  if (filters.type) {
    filtered = filtered.filter((n) => n.type === filters.type);
  }
  
  if (filters.startDate) {
    filtered = filtered.filter((n) => new Date(n.createdAt) >= new Date(filters.startDate!));
  }
  
  if (filters.endDate) {
    filtered = filtered.filter((n) => new Date(n.createdAt) <= new Date(filters.endDate!));
  }
  
  return filtered;
};
