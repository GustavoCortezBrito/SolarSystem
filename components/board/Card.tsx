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
  const labelColors: Record<string, string> = {
    Residencial: "bg-green-100 text-green-800",
    Comercial: "bg-blue-100 text-blue-800",
    Industrial: "bg-purple-100 text-purple-800",
    Urgente: "bg-red-100 text-red-800",
    Híbrido: "bg-yellow-100 text-yellow-800",
    "On-Grid": "bg-cyan-100 text-cyan-800",
    "Off-Grid": "bg-orange-100 text-orange-800",
    "Aguardando Cliente": "bg-gray-100 text-gray-800",
    "Revisão Técnica": "bg-indigo-100 text-indigo-800",
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
          {card.labels.slice(0, 4).map((label, index) => (
            <span
              key={index}
              className={`h-2 w-10 rounded-full ${
                labelColors[label]?.replace('text-', 'bg-').split(' ')[0] || "bg-gray-500"
              }`}
              title={label}
            ></span>
          ))}
          {card.labels.length > 4 && (
            <span className="h-2 w-6 rounded-full bg-white/20" title={`+${card.labels.length - 4} mais`}></span>
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
