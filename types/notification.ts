// Tipos para o sistema de notificações

export type NotificationType = 
  | "PROPOSTA_ACEITA"
  | "PROPOSTA_REJEITADA"
  | "NOVO_CLIENTE"
  | "CLIENTE_ATUALIZADO"
  | "CARD_ATRIBUIDO"
  | "CARD_MOVIDO"
  | "COMENTARIO"
  | "VENCIMENTO_PROXIMO"
  | "TAREFA_CONCLUIDA"
  | "MEMBRO_ADICIONADO"
  | "SISTEMA";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  
  // Dados opcionais para ações
  actionUrl?: string; // URL para onde a notificação leva
  actionLabel?: string; // Label do botão de ação
  
  // Metadados
  userId: string; // Usuário que recebe a notificação
  relatedEntityId?: string; // ID da entidade relacionada (cliente, card, etc.)
  relatedEntityType?: "CLIENT" | "CARD" | "USER" | "PROPOSAL";
  
  // Informações do remetente (se aplicável)
  fromUserId?: string;
  fromUserName?: string;
  fromUserAvatar?: string;
}

export interface NotificationFilter {
  read?: boolean;
  type?: NotificationType;
  startDate?: string;
  endDate?: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<NotificationType, number>;
}
