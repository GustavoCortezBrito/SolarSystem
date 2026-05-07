"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, X } from "lucide-react";

interface AddColumnButtonProps {
  onAdd: (title: string) => void;
}

export function AddColumnButton({ onAdd }: AddColumnButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");

  const handleAdd = () => {
    if (title.trim()) {
      onAdd(title);
      setTitle("");
      setIsAdding(false);
    }
  };

  if (isAdding) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-gray-100 rounded-lg p-4 w-80 flex-shrink-0"
      >
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAdd();
            if (e.key === "Escape") {
              setTitle("");
              setIsAdding(false);
            }
          }}
          placeholder="Digite o nome da coluna..."
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 mb-2"
          autoFocus
        />
        <div className="flex items-center space-x-2">
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
          >
            Adicionar
          </button>
          <button
            onClick={() => {
              setTitle("");
              setIsAdding(false);
            }}
            className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <button
      onClick={() => setIsAdding(true)}
      className="bg-white/50 hover:bg-white/80 rounded-lg p-4 w-80 flex-shrink-0 border-2 border-dashed border-gray-300 hover:border-primary-400 transition-all flex items-center justify-center space-x-2 text-gray-600 hover:text-primary-600"
    >
      <Plus className="w-5 h-5" />
      <span className="font-medium">Adicionar coluna</span>
    </button>
  );
}
