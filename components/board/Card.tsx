"use client";

import { motion } from "framer-motion";
import { Calendar, MessageSquare, Paperclip, AlertCircle, UserCircle } from "lucide-react";
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
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-all group"
    >
      {/* Labels */}
      {card.labels && card.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {card.labels.map((label, index) => (
            <span
              key={index}
              className={`px-2 py-0.5 text-xs font-medium rounded ${
                labelColors[label] || "bg-gray-100 text-gray-800"
              }`}
            >
              {label}
            </span>
          ))}
        </div>
      )}

      {/* Title */}
      <h4 className="text-sm font-medium text-gray-900 mb-1">{card.title}</h4>

      {/* Description Preview */}
      {card.description && (
        <p className="text-xs text-gray-600 mb-2 line-clamp-2">{card.description}</p>
      )}

      {/* Cliente vinculado */}
      {card.clientName && (
        <div className="flex items-center gap-1.5 mb-2 px-2 py-1 bg-primary-50 border border-primary-100 rounded-md">
          <UserCircle className="w-3.5 h-3.5 text-primary-500 flex-shrink-0" />
          <span className="text-xs font-medium text-primary-700 truncate">{card.clientName}</span>
        </div>
      )}

      {/* Metadata */}
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center space-x-2">
          {card.priority && (
            <div className={priorityColors[card.priority]}>
              <AlertCircle className="w-4 h-4" />
            </div>
          )}
          {card.dueDate && (
            <div
              className={`flex items-center space-x-1 text-xs ${
                isOverdue ? "text-red-600 font-semibold" : "text-gray-600"
              }`}
            >
              <Calendar className="w-3 h-3" />
              <span>
                {new Date(card.dueDate).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "short",
                })}
              </span>
            </div>
          )}
          {card.comments && card.comments.length > 0 && (
            <div className="flex items-center space-x-1 text-xs text-gray-600">
              <MessageSquare className="w-3 h-3" />
              <span>{card.comments.length}</span>
            </div>
          )}
          {card.attachments && card.attachments.length > 0 && (
            <div className="flex items-center space-x-1 text-xs text-gray-600">
              <Paperclip className="w-3 h-3" />
              <span>{card.attachments.length}</span>
            </div>
          )}
        </div>

        {/* Assignees */}
        {card.assignees && card.assignees.length > 0 && (
          <div className="flex items-center -space-x-2">
            {getAssignedMembers().slice(0, 3).map((member) => (
              <div
                key={member.id}
                className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-medium border-2 border-white"
                title={member.name}
              >
                {member.name.charAt(0).toUpperCase()}
              </div>
            ))}
            {card.assignees.length > 3 && (
              <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs font-medium border-2 border-white">
                +{card.assignees.length - 3}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
