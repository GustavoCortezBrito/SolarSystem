"use client";

import { motion } from "framer-motion";
import { Calendar, MessageSquare, Paperclip, AlignLeft } from "lucide-react";
import type { Card as CardType, User } from "@/types/board";

interface CardProps {
  card: CardType;
  onClick: () => void;
  onDelete: () => void;
  members: User[];
}

export function Card({ card, onClick, members }: CardProps) {
  // Cores sólidas estilo Trello
  const labelColors: Record<string, string> = {
    Residencial: "bg-green-600",
    Comercial: "bg-blue-600",
    Industrial: "bg-purple-600",
    Urgente: "bg-red-600",
    Híbrido: "bg-yellow-600",
    "On-Grid": "bg-cyan-600",
    "Off-Grid": "bg-orange-600",
    "Aguardando Cliente": "bg-gray-600",
    "Revisão Técnica": "bg-indigo-600",
    // Tags do Trello importadas
    Lucas: "bg-green-600",
    "PROJ CANCELADO?": "bg-red-900",
    "Atenção - Bucha": "bg-red-700",
    Diogo: "bg-blue-600",
    Leticia: "bg-pink-600",
    PAGOS: "bg-yellow-600",
    Urgencia: "bg-orange-600",
    reprova: "bg-pink-500",
    "2° REPROVA": "bg-green-400",
    INSTALADO: "bg-blue-400",
    "AUMENTO DE CARGA": "bg-black",
    ver: "bg-green-800",
    PRIORIDADEEE: "bg-yellow-800",
    LOCALIZAÇÃO: "bg-sky-800",
    PROCURAÇÃO: "bg-lime-800",
  };

  const priorityColors = {
    low: "text-gray-500",
    medium: "text-yellow-500",
    high: "text-red-500",
  };

  const getAssignedMembers = () => members.filter((m) => card.assignees.includes(m.id));
  const isOverdue = card.dueDate && new Date(card.dueDate) < new Date();

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.01 }}
      onClick={onClick}
      className="bg-slate-700 p-2 rounded-lg shadow-sm border border-white/5 cursor-pointer hover:border-white/20 transition-all group"
    >
      {/* Labels */}
      {card.labels && card.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {card.labels.slice(0, 5).map((label, index) => (
            <span
              key={index}
              className={`h-2 rounded-full ${
                labelColors[label] || "bg-slate-500"
              }`}
              style={{ width: '40px' }}
              title={label}
            ></span>
          ))}
          {card.labels.length > 5 && (
            <span 
              className="h-2 rounded-full bg-white/20" 
              style={{ width: '24px' }}
              title={`+${card.labels.length - 5} mais`}
            ></span>
          )}
        </div>
      )}

      {/* Title */}
      <h4 className="text-sm text-white mb-2 leading-snug">{card.title}</h4>

      {/* Metadata */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {card.dueDate && (
            <div
              className={`flex items-center space-x-1 text-xs px-1.5 py-0.5 rounded ${
                isOverdue ? "bg-red-500/20 text-red-300" : "bg-white/10 text-white/60"
              }`}
            >
              <Calendar className="w-3 h-3" />
              <span>
                {new Date(card.dueDate).toLocaleDateString("pt-BR", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
            </div>
          )}
          {card.description && (
            <div className="text-white/40">
              <AlignLeft className="w-3.5 h-3.5" />
            </div>
          )}
          {card.comments && card.comments.length > 0 && (
            <div className="flex items-center space-x-1 text-xs text-white/60">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{card.comments.length}</span>
            </div>
          )}
          {card.attachments && card.attachments.length > 0 && (
            <div className="flex items-center space-x-1 text-xs text-white/60">
              <Paperclip className="w-3.5 h-3.5" />
              <span>{card.attachments.length}</span>
            </div>
          )}
        </div>

        {/* Assignees */}
        {card.assignees && card.assignees.length > 0 && (
          <div className="flex items-center -space-x-1">
            {getAssignedMembers().slice(0, 2).map((member) => (
              <div
                key={member.id}
                className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-medium border-2 border-slate-700"
                title={member.name}
              >
                {member.name.charAt(0).toUpperCase()}
              </div>
            ))}
            {card.assignees.length > 2 && (
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-medium border-2 border-slate-700">
                +{card.assignees.length - 2}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
