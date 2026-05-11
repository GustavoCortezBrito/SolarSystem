"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, MoreVertical, Trash2, Edit2, Palette, X } from "lucide-react";
import { Card } from "./Card";
import type { Column as ColumnType, Card as CardType, User } from "@/types/board";

interface ColumnProps {
  column: ColumnType;
  onDelete: (columnId: string) => void;
  onUpdate: (columnId: string, title: string, color?: string) => void;
  onCardMove: (
    cardId: string,
    sourceColumnId: string,
    targetColumnId: string,
    targetIndex: number
  ) => void;
  onCardClick: (card: CardType, columnId: string) => void;
  onDeleteCard: (columnId: string, cardId: string) => void;
  onAddCard: (columnId: string, title: string) => void;
  members: User[];
}

export function Column({
  column,
  onDelete,
  onUpdate,
  onCardMove,
  onCardClick,
  onDeleteCard,
  onAddCard,
  members,
}: ColumnProps) {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(column.title);
  const [showMenu, setShowMenu] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  // Cores disponíveis para as colunas
  const columnColors = [
    { name: "Padrão", value: "", bg: "bg-gray-100", header: "bg-gray-100" },
    { name: "Azul", value: "blue", bg: "bg-blue-50", header: "bg-blue-100" },
    { name: "Verde", value: "green", bg: "bg-green-50", header: "bg-green-100" },
    { name: "Amarelo", value: "yellow", bg: "bg-yellow-50", header: "bg-yellow-100" },
    { name: "Laranja", value: "orange", bg: "bg-orange-50", header: "bg-orange-100" },
    { name: "Vermelho", value: "red", bg: "bg-red-50", header: "bg-red-100" },
    { name: "Roxo", value: "purple", bg: "bg-purple-50", header: "bg-purple-100" },
    { name: "Rosa", value: "pink", bg: "bg-pink-50", header: "bg-pink-100" },
    { name: "Índigo", value: "indigo", bg: "bg-indigo-50", header: "bg-indigo-100" },
  ];

  const currentColor = columnColors.find((c) => c.value === column.color) || columnColors[0];

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      onAddCard(column.id, newCardTitle);
      setNewCardTitle("");
      setIsAddingCard(false);
    }
  };

  const handleSaveTitle = () => {
    if (editedTitle.trim()) {
      onUpdate(column.id, editedTitle, column.color);
      setIsEditingTitle(false);
    }
  };

  const handleChangeColor = (color: string) => {
    onUpdate(column.id, column.title, color);
    setShowColorPicker(false);
    setShowMenu(false);
  };

  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("cardId", cardId);
    e.dataTransfer.setData("sourceColumnId", column.id);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData("cardId");
    const sourceColumnId = e.dataTransfer.getData("sourceColumnId");

    if (cardId && sourceColumnId) {
      onCardMove(cardId, sourceColumnId, column.id, targetIndex);
    }
    setDragOverIndex(null);
  };

  const handleColumnDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleColumnDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData("cardId");
    const sourceColumnId = e.dataTransfer.getData("sourceColumnId");

    if (cardId && sourceColumnId) {
      onCardMove(cardId, sourceColumnId, column.id, column.cards.length);
    }
  };

  return (
    <motion.div
      layout
      className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-2 w-72 flex-shrink-0 flex flex-col h-full border border-white/5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onDragOver={handleColumnDragOver}
      onDrop={handleColumnDrop}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between px-2 py-1.5 mb-1">
        {isEditingTitle ? (
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={handleSaveTitle}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSaveTitle();
              if (e.key === "Escape") {
                setEditedTitle(column.title);
                setIsEditingTitle(false);
              }
            }}
            className="flex-1 px-2 py-1 text-sm font-semibold bg-slate-700 text-white border border-primary-500 rounded focus:outline-none"
            autoFocus
          />
        ) : (
          <h3 className="font-semibold text-white text-sm flex items-center space-x-2 flex-1">
            <span>{column.title}</span>
            <span className="text-xs text-white/40 font-normal">
              {column.cards.length}
            </span>
          </h3>
        )}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 hover:bg-white/10 rounded transition-colors text-white/60 hover:text-white"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {showMenu && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10"
            >
              <button
                onClick={() => {
                  setIsEditingTitle(true);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
              >
                <Edit2 className="w-4 h-4" />
                <span>Editar título</span>
              </button>
              <button
                onClick={() => {
                  setShowColorPicker(true);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
              >
                <Palette className="w-4 h-4" />
                <span>Alterar cor</span>
              </button>
              <button
                onClick={() => {
                  onDelete(column.id);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Excluir coluna</span>
              </button>
            </motion.div>
          )}
          
          {/* Color Picker Modal */}
          {showColorPicker && (
            <motion.div
              ref={colorPickerRef}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-10"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-900">Escolher cor</h4>
                <button
                  onClick={() => setShowColorPicker(false)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {columnColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => handleChangeColor(color.value)}
                    className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                      currentColor.value === color.value
                        ? "border-primary-500 ring-2 ring-primary-200"
                        : "border-gray-200 hover:border-gray-300"
                    } ${color.bg}`}
                  >
                    <div className="text-xs font-medium text-gray-700 text-center">
                      {color.name}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-2 flex-1 overflow-y-auto pr-1 px-1" style={{ maxHeight: 'calc(100vh - 200px)' }}>
        {column.cards.map((card, index) => (
          <div key={card.id}>
            {dragOverIndex === index && (
              <div className="h-2 bg-primary-400 rounded mb-2 transition-all" />
            )}
            <div
              draggable
              onDragStart={(e) => handleDragStart(e, card.id)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
            >
              <Card
                card={card}
                onClick={() => onCardClick(card, column.id)}
                onDelete={() => onDeleteCard(column.id, card.id)}
                members={members}
              />
            </div>
          </div>
        ))}
        {dragOverIndex === column.cards.length && (
          <div className="h-2 bg-primary-400 rounded transition-all" />
        )}
      </div>

      {/* Add Card */}
      {isAddingCard ? (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-2 px-1"
        >
          <textarea
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            placeholder="Insira um título para este cartão..."
            className="w-full p-2 text-sm bg-slate-700 text-white border border-white/10 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none placeholder-white/30"
            rows={3}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAddCard();
              }
            }}
          />
          <div className="flex items-center space-x-2 mt-2">
            <button
              onClick={handleAddCard}
              className="px-3 py-1.5 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors text-sm font-medium"
            >
              Adicionar cartão
            </button>
            <button
              onClick={() => {
                setIsAddingCard(false);
                setNewCardTitle("");
              }}
              className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      ) : (
        <button
          onClick={() => setIsAddingCard(true)}
          className="w-full mt-1 px-2 py-1.5 text-left text-sm text-white/60 hover:bg-white/10 hover:text-white rounded transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Adicionar um cartão</span>
        </button>
      )}
    </motion.div>
  );
}
