"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calculator,
  Zap,
  Sun,
  Home,
  Building2,
  Factory,
  TrendingUp,
  DollarSign,
  Battery,
  ArrowLeft,
  Download,
  Save,
  Info,
  AlertCircle,
  Check,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import jsPDF from "jspdf";

interface CalculationResult {
  // Consumo
  monthlyConsumption: number;
  dailyConsumption: number;
  
  // Sistema
  systemPowerKWp: number;
  numberOfPanels: number;
  panelPowerWp: number;
  
  // Inversor
  inverterPowerKW: number;
  inverterEfficiency: number;
  recommendedInverter?: any;
  
  // Geração
  monthlyGeneration: number;
  dailyGeneration: number;
  annualGeneration: number;
  
  // Financeiro Básico (estimativa)
  estimatedSystemCost: number;
  
  // Área
  requiredAreaM2: number;
  
  // Ambiental
  co2AvoidedKgYear: number;
  treesEquivalent: number;
}

export default function CalculatorPage() {
  const router = useRouter();
  const { data: session } = useSession();
  
  // Inputs
  const [propertyType, setPropertyType] = useState<"residential" | "commercial" | "industrial">("residential");
  const [monthlyBill, setMonthlyBill] = useState<string>("300");
  const [averageConsumption, setAverageConsumption] = useState<string>("350");
  const [tariff, setTariff] = useState<string>("0.85");
  const [roofType, setRoofType] = useState<"ceramic" | "metallic" | "concrete" | "fibrociment">("ceramic");
  const [solarIrradiation, setSolarIrradiation] = useState<string>("5.5");
  const [selectedPanelPower, setSelectedPanelPower] = useState<number>(550);
  const [systemType, setSystemType] = useState<"on-grid" | "off-grid" | "hybrid">("on-grid");
  const [hasBattery, setHasBattery] = useState(false);
  
  // Equipamentos disponíveis
  const [modules, setModules] = useState<any[]>([]);
  const [inverters, setInverters] = useState<any[]>([]);
  const [batteries, setBatteries] = useState<any[]>([]);
  
  // Resultado
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  
  // Estados de ação
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Buscar equipamentos
  useEffect(() => {
    async function fetchEquipment() {
      try {
        const [modulesRes, invertersRes, batteriesRes] = await Promise.all([
          fetch("/api/equipment/modules"),
          fetch("/api/equipment/inverters"),
          fetch("/api/equipment/batteries"),
        ]);
        
        if (modulesRes.ok) setModules(await modulesRes.json());
        if (invertersRes.ok) setInverters(await invertersRes.json());
        if (batteriesRes.ok) setBatteries(await batteriesRes.json());
      } catch (error) {
        console.error("Erro ao buscar equipamentos:", error);
      }
    }
    fetchEquipment();
  }, []);

  // Calcular sistema
  const calculateSystem = () => {
    const consumption = parseFloat(averageConsumption);
    const tariffValue = parseFloat(tariff);
    const irradiation = parseFloat(solarIrradiation);
    const bill = parseFloat(monthlyBill);
    
    if (!consumption || !tariffValue || !irradiation) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    // 1. Consumo diário (kWh/dia)
    const dailyConsumption = consumption / 30;
    
    // 2. Potência do sistema (kWp)
    // Fórmula: Potência = (Consumo diário / Irradiação solar) / Eficiência
    const systemEfficiency = 0.80; // 80% (perdas de cabeamento, sujeira, temperatura)
    const systemPowerKWp = (dailyConsumption / irradiation) / systemEfficiency;
    
    // 3. Número de painéis
    const panelPowerKWp = selectedPanelPower / 1000;
    const numberOfPanels = Math.ceil(systemPowerKWp / panelPowerKWp);
    
    // 4. Potência real do sistema (ajustada)
    const actualSystemPowerKWp = numberOfPanels * panelPowerKWp;
    
    // 5. Geração mensal e anual (kWh)
    const dailyGeneration = actualSystemPowerKWp * irradiation * systemEfficiency;
    const monthlyGeneration = dailyGeneration * 30;
    const annualGeneration = dailyGeneration * 365;
    
    // 6. Inversor recomendado (1.0 a 1.2x a potência dos painéis)
    const inverterPowerKW = actualSystemPowerKWp * 1.1;
    const recommendedInverter = inverters.find(
      inv => inv.nominalPower >= inverterPowerKW * 1000 && inv.nominalPower <= inverterPowerKW * 1000 * 1.3
    );
    
    // 7. Custo ESTIMADO (apenas referência)
    // Custo médio: R$ 4.000 a R$ 5.500 por kWp instalado
    const costPerKWp = propertyType === "residential" ? 4500 : 
                       propertyType === "commercial" ? 4200 : 4000;
    let estimatedSystemCost = actualSystemPowerKWp * costPerKWp;
    
    // Adicionar custo de bateria se necessário
    if (hasBattery && batteries.length > 0) {
      const batteryCapacity = dailyConsumption * 2; // 2 dias de autonomia
      const battery = batteries.find(b => b.capacity >= batteryCapacity * 1000);
      if (battery) {
        estimatedSystemCost += battery.price || 15000;
      }
    }
    
    // 8. Área necessária
    // Painel típico: 2.3m² (550Wp) ou 2.0m² (450Wp)
    const panelAreaM2 = selectedPanelPower >= 500 ? 2.3 : 2.0;
    const requiredAreaM2 = numberOfPanels * panelAreaM2 * 1.2; // +20% para espaçamento
    
    // 9. Impacto ambiental
    // 1 kWh evita ~0.5 kg de CO2
    const co2AvoidedKgYear = annualGeneration * 0.5;
    const treesEquivalent = Math.round(co2AvoidedKgYear / 21); // 1 árvore absorve ~21kg CO2/ano

    const calculationResult: CalculationResult = {
      monthlyConsumption: consumption,
      dailyConsumption,
      systemPowerKWp: actualSystemPowerKWp,
      numberOfPanels,
      panelPowerWp: selectedPanelPower,
      inverterPowerKW: recommendedInverter?.nominalPower / 1000 || inverterPowerKW,
      inverterEfficiency: recommendedInverter?.efficiency || 97.5,
      recommendedInverter,
      monthlyGeneration,
      dailyGeneration,
      annualGeneration,
      estimatedSystemCost,
      requiredAreaM2,
      co2AvoidedKgYear,
      treesEquivalent,
    };

    setResult(calculationResult);
    setShowResult(true);
  };

  const saveCalculation = async () => {
    if (!result || !session?.user) {
      alert("Você precisa estar logado para salvar o cálculo");
      return;
    }
    
    const companyId = localStorage.getItem("companyId");
    if (!companyId) {
      alert("Empresa não selecionada");
      return;
    }
    
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      const response = await fetch("/api/calculations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId,
          propertyType,
          monthlyConsumption: averageConsumption,
          monthlyBill,
          tariff,
          solarIrradiation,
          roofType,
          panelPowerWp: selectedPanelPower,
          systemType,
          hasBattery,
          result,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erro da API:", errorData);
        throw new Error(errorData.details || "Erro ao salvar cálculo");
      }
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Erro ao salvar cálculo:", error);
      alert("Erro ao salvar cálculo. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const downloadPDF = () => {
    if (!result) return;
    
    setIsGeneratingPDF(true);
    
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let yPos = 20;
      
      // Header
      doc.setFillColor(249, 115, 22); // Orange
      doc.rect(0, 0, pageWidth, 40, "F");
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text("Dimensionamento Solar", pageWidth / 2, 20, { align: "center" });
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("Especificações Técnicas do Sistema Fotovoltaico", pageWidth / 2, 30, { align: "center" });
      
      yPos = 50;
      doc.setTextColor(0, 0, 0);
      
      // Data
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Data: ${new Date().toLocaleDateString("pt-BR")}`, 20, yPos);
      yPos += 15;
      
      // Seção: Dados de Entrada
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text("Dados de Entrada", 20, yPos);
      yPos += 8;
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const propertyTypeLabel = { residential: "Residencial", commercial: "Comercial", industrial: "Industrial" };
      doc.text(`Tipo de Propriedade: ${propertyTypeLabel[propertyType]}`, 20, yPos);
      yPos += 6;
      doc.text(`Consumo Mensal: ${averageConsumption} kWh`, 20, yPos);
      yPos += 6;
      doc.text(`Conta de Luz: R$ ${monthlyBill}`, 20, yPos);
      yPos += 6;
      doc.text(`Tarifa: R$ ${tariff}/kWh`, 20, yPos);
      yPos += 6;
      doc.text(`Irradiação Solar: ${solarIrradiation} kWh/m²/dia`, 20, yPos);
      yPos += 6;
      doc.text(`Potência do Painel: ${selectedPanelPower}Wp`, 20, yPos);
      yPos += 6;
      const systemTypeLabel = { "on-grid": "On-Grid", "off-grid": "Off-Grid", "hybrid": "Híbrido" };
      doc.text(`Tipo de Sistema: ${systemTypeLabel[systemType]}`, 20, yPos);
      yPos += 15;
      
      // Seção: Sistema
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setFillColor(59, 130, 246); // Blue
      doc.rect(20, yPos - 5, pageWidth - 40, 8, "F");
      doc.setTextColor(255, 255, 255);
      doc.text("Componentes do Sistema", 25, yPos);
      yPos += 10;
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      doc.text(`Potência do Sistema: ${result.systemPowerKWp.toFixed(2)} kWp`, 20, yPos);
      yPos += 6;
      doc.text(`Painéis Solares: ${result.numberOfPanels}x ${result.panelPowerWp}Wp`, 20, yPos);
      yPos += 6;
      doc.text(`Potência do Inversor: ${result.inverterPowerKW.toFixed(1)} kW`, 20, yPos);
      yPos += 6;
      if (result.recommendedInverter) {
        doc.text(`Inversor Recomendado: ${result.recommendedInverter.manufacturer} ${result.recommendedInverter.model}`, 20, yPos);
        yPos += 6;
      }
      doc.text(`Área Necessária: ${result.requiredAreaM2.toFixed(1)} m²`, 20, yPos);
      yPos += 15;
      
      // Seção: Geração
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setFillColor(34, 197, 94); // Green
      doc.rect(20, yPos - 5, pageWidth - 40, 8, "F");
      doc.setTextColor(255, 255, 255);
      doc.text("Geração de Energia", 25, yPos);
      yPos += 10;
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      doc.text(`Geração Mensal: ${result.monthlyGeneration.toFixed(0)} kWh`, 20, yPos);
      yPos += 6;
      doc.text(`Geração Anual: ${result.annualGeneration.toFixed(0)} kWh`, 20, yPos);
      yPos += 15;
      
      // Seção: Análise Financeira
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setFillColor(249, 115, 22); // Orange
      doc.rect(20, yPos - 5, pageWidth - 40, 8, "F");
      doc.setTextColor(255, 255, 255);
      doc.text("Investimento Estimado", 25, yPos);
      yPos += 10;
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      doc.text(`Custo Estimado: R$ ${result.estimatedSystemCost.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, 20, yPos);
      yPos += 6;
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`* Valor estimado. Para orçamento detalhado, solicite uma proposta comercial.`, 20, yPos);
      yPos += 15;
      
      // Seção: Impacto Ambiental
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setFillColor(34, 197, 94); // Green
      doc.rect(20, yPos - 5, pageWidth - 40, 8, "F");
      doc.setTextColor(255, 255, 255);
      doc.text("Impacto Ambiental", 25, yPos);
      yPos += 10;
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      doc.text(`CO₂ Evitado por Ano: ${result.co2AvoidedKgYear.toFixed(0)} kg`, 20, yPos);
      yPos += 6;
      doc.text(`Equivalente a: ${result.treesEquivalent} árvores plantadas`, 20, yPos);
      yPos += 20;
      
      // Footer
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text("SolarSystem CRM - Dimensionamento Solar", pageWidth / 2, pageHeight - 10, { align: "center" });
      doc.text(`Gerado em ${new Date().toLocaleString("pt-BR")}`, pageWidth / 2, pageHeight - 6, { align: "center" });
      
      // Salvar PDF
      doc.save(`dimensionamento-solar-${Date.now()}.pdf`);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert("Erro ao gerar PDF. Tente novamente.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-primary-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/board" className="text-gray-600 hover:text-primary-600 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Calculadora Solar</h1>
                  <p className="text-sm text-gray-500">Dimensione seu sistema fotovoltaico</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* ── Formulário ─────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Tipo de Propriedade */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Home className="w-5 h-5 text-primary-600" />
                Tipo de Propriedade
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "residential", icon: Home, label: "Residencial" },
                  { value: "commercial", icon: Building2, label: "Comercial" },
                  { value: "industrial", icon: Factory, label: "Industrial" },
                ].map((type) => (
                  <button key={type.value}
                    onClick={() => setPropertyType(type.value as any)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      propertyType === type.value
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}>
                    <type.icon className={`w-6 h-6 mx-auto mb-2 ${
                      propertyType === type.value ? "text-primary-600" : "text-gray-400"
                    }`} />
                    <p className={`text-sm font-medium ${
                      propertyType === type.value ? "text-primary-900" : "text-gray-700"
                    }`}>
                      {type.label}
                    </p>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Consumo e Tarifa */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-600" />
                Consumo de Energia
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Conta de Luz Mensal (R$)
                  </label>
                  <input type="number" value={monthlyBill}
                    onChange={(e) => setMonthlyBill(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="300.00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Consumo Médio (kWh/mês)
                  </label>
                  <input type="number" value={averageConsumption}
                    onChange={(e) => setAverageConsumption(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="350" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tarifa (R$/kWh)
                  </label>
                  <input type="number" step="0.01" value={tariff}
                    onChange={(e) => setTariff(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="0.85" />
                </div>
              </div>
              <div className="mt-3 p-3 bg-blue-50 rounded-lg flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-800">
                  Você pode encontrar essas informações na sua conta de luz. O consumo médio está em kWh.
                </p>
              </div>
            </motion.div>

            {/* Localização e Irradiação */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Sun className="w-5 h-5 text-orange-600" />
                Localização e Telhado
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Irradiação Solar (kWh/m²/dia)
                  </label>
                  <select value={solarIrradiation}
                    onChange={(e) => setSolarIrradiation(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="3.5">3.5 - Região Sul (inverno)</option>
                    <option value="4.5">4.5 - Região Sul (média)</option>
                    <option value="5.0">5.0 - Região Sudeste</option>
                    <option value="5.5">5.5 - Região Centro-Oeste</option>
                    <option value="6.0">6.0 - Região Nordeste</option>
                    <option value="6.5">6.5 - Região Norte</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Telhado
                  </label>
                  <select value={roofType}
                    onChange={(e) => setRoofType(e.target.value as any)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="ceramic">Cerâmico</option>
                    <option value="metallic">Metálico</option>
                    <option value="concrete">Laje de Concreto</option>
                    <option value="fibrociment">Fibrocimento</option>
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Equipamentos */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Sun className="w-5 h-5 text-blue-600" />
                Configuração do Sistema
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Potência do Painel (Wp)
                  </label>
                  <select value={selectedPanelPower}
                    onChange={(e) => setSelectedPanelPower(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="450">450 Wp</option>
                    <option value="500">500 Wp</option>
                    <option value="550">550 Wp (Recomendado)</option>
                    <option value="600">600 Wp</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Sistema
                  </label>
                  <select value={systemType}
                    onChange={(e) => setSystemType(e.target.value as any)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="on-grid">On-Grid (Conectado à rede)</option>
                    <option value="off-grid">Off-Grid (Isolado)</option>
                    <option value="hybrid">Híbrido</option>
                  </select>
                </div>
              </div>
              
              {(systemType === "off-grid" || systemType === "hybrid") && (
                <div className="mt-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" checked={hasBattery}
                      onChange={(e) => setHasBattery(e.target.checked)}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" />
                    <span className="text-sm font-medium text-gray-700">
                      Incluir banco de baterias
                    </span>
                  </label>
                </div>
              )}
            </motion.div>

            {/* Botão Calcular */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}>
              <button onClick={calculateSystem}
                className="w-full py-4 bg-gradient-to-r from-primary-600 to-orange-500 text-white rounded-xl font-semibold text-lg hover:from-primary-700 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                <Calculator className="w-5 h-5" />
                Calcular Sistema Solar
              </button>
            </motion.div>
          </div>

          {/* ── Resultado ──────────────────────────────────────────────── */}
          <div className="lg:col-span-1">
            {showResult && result ? (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-24 space-y-6">
                
                <div className="text-center pb-4 border-b border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">Dimensionamento do Sistema</h3>
                  <p className="text-sm text-gray-500">Especificações técnicas</p>
                </div>

                {/* Sistema */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">Componentes</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Potência do Sistema</span>
                      <span className="text-lg font-bold text-primary-600">
                        {result.systemPowerKWp.toFixed(2)} kWp
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Painéis Solares</span>
                      <span className="text-lg font-bold text-gray-900">
                        {result.numberOfPanels}x {result.panelPowerWp}Wp
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Inversor</span>
                      <span className="text-sm font-medium text-gray-900">
                        {result.inverterPowerKW.toFixed(1)} kW
                      </span>
                    </div>
                    {result.recommendedInverter && (
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-xs font-semibold text-blue-900 mb-1">Inversor Recomendado:</p>
                        <p className="text-sm text-blue-800">
                          {result.recommendedInverter.manufacturer} {result.recommendedInverter.model}
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          {result.recommendedInverter.nominalPower}W • {result.recommendedInverter.efficiency}% eficiência
                        </p>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Área Necessária</span>
                      <span className="text-sm font-medium text-gray-900">
                        {result.requiredAreaM2.toFixed(1)} m²
                      </span>
                    </div>
                  </div>
                </div>

                {/* Geração */}
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">Geração de Energia</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Geração Mensal</span>
                      <span className="text-lg font-bold text-green-600">
                        {result.monthlyGeneration.toFixed(0)} kWh
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Geração Anual</span>
                      <span className="text-sm font-medium text-gray-900">
                        {result.annualGeneration.toFixed(0)} kWh
                      </span>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-xs text-green-800">
                        <strong>Cobertura:</strong> {((result.monthlyGeneration / result.monthlyConsumption) * 100).toFixed(0)}% do consumo mensal
                      </p>
                    </div>
                  </div>
                </div>

                {/* Custo Estimado */}
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">Investimento Estimado</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Custo Estimado</span>
                      <span className="text-lg font-bold text-gray-900">
                        R$ {result.estimatedSystemCost.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <p className="text-xs text-yellow-800">
                        <strong>Nota:</strong> Valor estimado. Para orçamento detalhado, crie uma proposta.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Ambiental */}
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">Impacto Ambiental</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">CO₂ Evitado/Ano</span>
                      <span className="text-sm font-medium text-green-700">
                        {result.co2AvoidedKgYear.toFixed(0)} kg
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Equivalente a</span>
                      <span className="text-sm font-medium text-green-700">
                        {result.treesEquivalent} árvores
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ações */}
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <Link href="/proposals/new"
                    className="w-full py-2 bg-gradient-to-r from-primary-600 to-orange-500 text-white rounded-lg hover:from-primary-700 hover:to-orange-600 transition-colors flex items-center justify-center gap-2 font-medium">
                    <TrendingUp className="w-4 h-4" />
                    Criar Proposta Comercial
                  </Link>
                  <button onClick={saveCalculation}
                    disabled={isSaving || saveSuccess}
                    className={`w-full py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                      saveSuccess
                        ? "bg-green-600 text-white"
                        : "bg-primary-600 text-white hover:bg-primary-700"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}>
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Salvando...
                      </>
                    ) : saveSuccess ? (
                      <>
                        <Check className="w-4 h-4" />
                        Salvo com Sucesso!
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Salvar Dimensionamento
                      </>
                    )}
                  </button>
                  <button onClick={downloadPDF}
                    disabled={isGeneratingPDF}
                    className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isGeneratingPDF ? (
                      <>
                        <div className="w-4 h-4 border-2 border-gray-700 border-t-transparent rounded-full animate-spin" />
                        Gerando PDF...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Baixar PDF
                      </>
                    )}
                  </button>
                </div>

              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="bg-gradient-to-br from-primary-50 to-orange-50 rounded-xl border-2 border-dashed border-primary-200 p-8 text-center sticky top-24">
                <Calculator className="w-16 h-16 text-primary-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Preencha os dados
                </h3>
                <p className="text-sm text-gray-600">
                  Complete o formulário ao lado e clique em "Calcular" para ver o dimensionamento do seu sistema solar.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
