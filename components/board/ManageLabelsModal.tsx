"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2, Edit2, Check } from "lucide-react";

interface ManageLabelsModalProps {
  currentLabels: string[];
  onClose: () => void;
  onSave: (labels: string[]) => void;
}

export default function ManageLabelsModal({
  currentLabels,
  onClose,
  onSave,
}: ManageLabelsModalProps) {
  const [labels, setLabels] = useState<string[]>(currentLabels);
  const [newLabel, setNewLabel] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");

  const handleAddLabel = () => {
    if (newLabel.trim() && !labels.includes(newLabel.trim())) {
      setLabels([...labels, newLabel.trim()]);
      setNewLabel("");
    }
  };

  const handleDeleteLabel = (index: number) => {
    setLabels(labels.filter((_, i) => i !== index));
  };

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditingValue(labels[index]);
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null && editingValue.trim()) {
      const newLabels = [...labels];
      newLabels[editingIndex] = editingValue.trim();
      setLabels(newLabels);
      setEditingIndex(null);
      setEditingValue("");
    }
  };

  const handleSave = () => {
    onSave(labels);
    onClose();
  };

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

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Gerenciar Tags</h2>
              <p className="text-sm text-gray-500 mt-1">
                Adicione, edite ou remova tags personalizadas
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Add New Label */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nova Tag
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddLabel();
                  }}
                  placeholder="Digite o nome da tag..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  onClick={handleAddLabel}
                  disabled={!newLabel.trim()}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Adicionar</span>
                </button>
              </div>
            </div>

            {/* Labels List */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tags Disponíveis ({labels.length})
              </label>
              {labels.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">Nenhuma tag cadastrada</p>
                  <p className="text-xs mt-1">Adicione sua primeira tag acima</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {labels.map((label, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      {editingIndex === index ? (
                        <>
                          <input
                            type="text"
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveEdit();
                              if (e.key === "Escape") {
                                setEditingIndex(null);
                                setEditingValue("");
                              }
                            }}
                            className="flex-1 px-3 py-1 border border-primary-500 rounded focus:outline-none"
                            autoFocus
                          />
                          <button
                            onClick={handleSaveEdit}
                            className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Salvar"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingIndex(null);
                              setEditingValue("");
                            }}
                            className="p-2 text-gray-400 hover:bg-gray-200 rounded transition-colors"
                            title="Cancelar"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <span
                            className={`flex-1 px-3 py-2 text-sm font-medium rounded text-white ${
                              labelColors[label] || "bg-gray-600"
                            }`}
                          >
                            {label}
                          </span>
                          <button
                            onClick={() => handleStartEdit(index)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteLabel(index)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
            >
              Salvar Alterações
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
