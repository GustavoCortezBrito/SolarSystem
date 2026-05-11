"use client";

import { useState } from "react";

interface TrelloImportModalProps {
  companyId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function TrelloImportModal({
  companyId,
  onClose,
  onSuccess,
}: TrelloImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [replaceExisting, setReplaceExisting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState({ current: 0, total: 0, message: "" });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== "application/json") {
        setError("Por favor, selecione um arquivo JSON");
        return;
      }
      setFile(selectedFile);
      setError("");
    }
  };

  const handleImport = async () => {
    if (!file) {
      setError("Selecione um arquivo JSON do Trello");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Ler arquivo JSON
      setProgress({ current: 0, total: 100, message: "Lendo arquivo..." });
      const text = await file.text();
      const trelloData = JSON.parse(text);

      // Validar estrutura básica
      if (!trelloData.lists || !trelloData.cards) {
        throw new Error("Arquivo JSON inválido. Certifique-se de exportar o board completo do Trello.");
      }

      const activeLists = trelloData.lists.filter((l: any) => !l.closed).length;
      const activeCards = trelloData.cards.filter((c: any) => !c.closed).length;
      
      setProgress({ 
        current: 10, 
        total: 100, 
        message: `Preparando importação: ${activeLists} listas, ${activeCards} cards...` 
      });

      // Enviar para API
      setProgress({ current: 20, total: 100, message: "Enviando dados para o servidor..." });
      const response = await fetch("/api/board/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trelloData,
          companyId,
          replaceExisting,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erro ao importar board");
      }

      setProgress({ current: 90, total: 100, message: "Finalizando importação..." });
      const result = await response.json();
      setProgress({ current: 100, total: 100, message: "Concluído!" });
      
      alert(
        `Importação concluída!\n\n` +
        `✓ ${result.stats.columnsImported} colunas importadas\n` +
        `✓ ${result.stats.cardsImported} cards importados\n` +
        (result.stats.cardsSkipped > 0 ? `⚠ ${result.stats.cardsSkipped} cards ignorados (lista fechada)` : "")
      );

      onSuccess();
    } catch (err: any) {
      console.error("Erro ao importar:", err);
      setError(err.message || "Erro ao importar board");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold mb-4">Importar Board do Trello</h2>

        <div className="space-y-4">
          {/* Instruções */}
          <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm">
            <p className="font-medium text-blue-900 mb-2">Como exportar do Trello:</p>
            <ol className="list-decimal list-inside space-y-1 text-blue-800">
              <li>Abra seu board no Trello</li>
              <li>Clique em "Mostrar menu" (canto superior direito)</li>
              <li>Clique em "Mais" → "Imprimir e exportar"</li>
              <li>Clique em "Exportar como JSON"</li>
              <li>Salve o arquivo e faça upload aqui</li>
            </ol>
          </div>

          {/* Upload de arquivo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Arquivo JSON do Trello
            </label>
            <input
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
                cursor-pointer"
            />
            {file && (
              <p className="mt-2 text-sm text-green-600">
                ✓ {file.name} selecionado
              </p>
            )}
          </div>

          {/* Opção de substituir */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="replaceExisting"
              checked={replaceExisting}
              onChange={(e) => setReplaceExisting(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="replaceExisting" className="text-sm text-gray-700">
              Substituir board existente (apaga colunas e cards atuais)
            </label>
          </div>

          {/* Erro */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-800">
              {error}
            </div>
          )}

          {/* Barra de Progresso */}
          {isLoading && (
            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress.current}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 text-center">
                {progress.message}
              </p>
            </div>
          )}

          {/* Botões */}
          <div className="flex space-x-3 pt-4">
            <button
              onClick={handleImport}
              disabled={!file || isLoading}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isLoading ? "Importando..." : "Importar"}
            </button>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
