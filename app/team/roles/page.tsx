"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Shield,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import { CustomRole, PERMISSION_GROUPS, ROLE_TEMPLATES } from "@/types/customRole";
import { Permission, Role } from "@/types/auth";
import { hasPermission } from "@/lib/permissions";
import { mockMemberships, mockUsers } from "@/lib/mockAuthData";

export default function CustomRolesPage() {
  const router = useRouter();
  const [companyId, setCompanyId] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [userRole, setUserRole] = useState<Role>(Role.SELLER);
  const [customRoles, setCustomRoles] = useState<CustomRole[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRole, setEditingRole] = useState<CustomRole | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["leads", "boards"]);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: [] as Permission[],
    color: "bg-blue-100 text-blue-800",
  });

  useEffect(() => {
    const storedCompanyId = localStorage.getItem("companyId");
    const storedUserId = localStorage.getItem("userId");

    if (!storedCompanyId || !storedUserId) {
      router.push("/login");
      return;
    }

    setCompanyId(storedCompanyId);
    setUserId(storedUserId);

    // Verificar permissão
    const membership = mockMemberships.find(
      (m) => m.userId === storedUserId && m.companyId === storedCompanyId
    );

    if (!membership) {
      router.push("/board");
      return;
    }

    setUserRole(membership.role);

    // Apenas OWNER pode gerenciar cargos customizados
    if (membership.role !== Role.OWNER) {
      alert("Apenas o dono da empresa pode gerenciar cargos customizados");
      router.push("/team");
      return;
    }

    // Carregar cargos customizados (mock)
    loadCustomRoles(storedCompanyId);
  }, [router]);

  const loadCustomRoles = (companyId: string) => {
    // Mock: carregar cargos customizados
    const mockCustomRoles: CustomRole[] = [
      {
        id: "custom-1",
        companyId: companyId,
        name: "Instalador",
        description: "Responsável pela instalação dos sistemas",
        permissions: [
          Permission.BOARDS_VIEW_OWN,
          Permission.BOARDS_UPDATE,
          Permission.LEADS_VIEW_OWN,
          Permission.LEADS_UPDATE,
        ],
        color: "bg-orange-100 text-orange-800",
        isDefault: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: userId,
      },
      {
        id: "custom-2",
        companyId: companyId,
        name: "Engenheiro",
        description: "Responsável por dimensionamento e projetos técnicos",
        permissions: [
          Permission.BOARDS_VIEW_ALL,
          Permission.BOARDS_CREATE,
          Permission.BOARDS_UPDATE,
          Permission.LEADS_VIEW_ALL,
          Permission.LEADS_UPDATE,
          Permission.REPORTS_VIEW_TEAM,
        ],
        color: "bg-indigo-100 text-indigo-800",
        isDefault: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: userId,
      },
    ];

    setCustomRoles(mockCustomRoles);
  };

  const handleCreateRole = () => {
    if (!formData.name.trim()) {
      alert("Digite um nome para o cargo");
      return;
    }

    if (formData.permissions.length === 0) {
      alert("Selecione pelo menos uma permissão");
      return;
    }

    const newRole: CustomRole = {
      id: `custom-${Date.now()}`,
      companyId: companyId,
      name: formData.name,
      description: formData.description,
      permissions: formData.permissions,
      color: formData.color,
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: userId,
    };

    setCustomRoles([...customRoles, newRole]);
    setShowCreateModal(false);
    resetForm();
    alert("Cargo criado com sucesso!");
  };

  const handleUpdateRole = () => {
    if (!editingRole) return;

    if (!formData.name.trim()) {
      alert("Digite um nome para o cargo");
      return;
    }

    if (formData.permissions.length === 0) {
      alert("Selecione pelo menos uma permissão");
      return;
    }

    const updatedRole: CustomRole = {
      ...editingRole,
      name: formData.name,
      description: formData.description,
      permissions: formData.permissions,
      color: formData.color,
      updatedAt: new Date().toISOString(),
    };

    setCustomRoles(
      customRoles.map((role) => (role.id === editingRole.id ? updatedRole : role))
    );
    setEditingRole(null);
    resetForm();
    alert("Cargo atualizado com sucesso!");
  };

  const handleDeleteRole = (roleId: string) => {
    if (!confirm("Tem certeza que deseja excluir este cargo?")) return;

    setCustomRoles(customRoles.filter((role) => role.id !== roleId));
    alert("Cargo excluído com sucesso!");
  };

  const handleEditRole = (role: CustomRole) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      permissions: role.permissions,
      color: role.color,
    });
  };

  const handleUseTemplate = (template: typeof ROLE_TEMPLATES[0]) => {
    setFormData({
      name: template.name,
      description: template.description,
      permissions: template.permissions,
      color: template.color,
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      permissions: [],
      color: "bg-blue-100 text-blue-800",
    });
  };

  const togglePermission = (permission: Permission) => {
    if (formData.permissions.includes(permission)) {
      setFormData({
        ...formData,
        permissions: formData.permissions.filter((p) => p !== permission),
      });
    } else {
      setFormData({
        ...formData,
        permissions: [...formData.permissions, permission],
      });
    }
  };

  const toggleGroup = (groupId: string) => {
    if (expandedGroups.includes(groupId)) {
      setExpandedGroups(expandedGroups.filter((id) => id !== groupId));
    } else {
      setExpandedGroups([...expandedGroups, groupId]);
    }
  };

  const selectAllInGroup = (groupPermissions: Permission[]) => {
    const allSelected = groupPermissions.every((p) =>
      formData.permissions.includes(p)
    );

    if (allSelected) {
      // Desmarcar todos
      setFormData({
        ...formData,
        permissions: formData.permissions.filter(
          (p) => !groupPermissions.includes(p)
        ),
      });
    } else {
      // Marcar todos
      const newPermissions = [
        ...formData.permissions,
        ...groupPermissions.filter((p) => !formData.permissions.includes(p)),
      ];
      setFormData({
        ...formData,
        permissions: newPermissions,
      });
    }
  };

  const getPermissionLabel = (permission: Permission): string => {
    const labels: Record<Permission, string> = {
      [Permission.LEADS_VIEW_ALL]: "Ver todos os leads",
      [Permission.LEADS_VIEW_OWN]: "Ver próprios leads",
      [Permission.LEADS_CREATE]: "Criar leads",
      [Permission.LEADS_UPDATE]: "Editar leads",
      [Permission.LEADS_DELETE]: "Excluir leads",
      [Permission.LEADS_ASSIGN]: "Atribuir leads",
      [Permission.BOARDS_VIEW_ALL]: "Ver todos os boards",
      [Permission.BOARDS_VIEW_OWN]: "Ver próprios boards",
      [Permission.BOARDS_CREATE]: "Criar boards",
      [Permission.BOARDS_UPDATE]: "Editar boards",
      [Permission.BOARDS_DELETE]: "Excluir boards",
      [Permission.USERS_VIEW]: "Ver usuários",
      [Permission.USERS_INVITE]: "Convidar usuários",
      [Permission.USERS_REMOVE]: "Remover usuários",
      [Permission.USERS_UPDATE_ROLE]: "Alterar cargos",
      [Permission.SETTINGS_VIEW]: "Ver configurações",
      [Permission.SETTINGS_UPDATE]: "Editar configurações",
      [Permission.BILLING_VIEW]: "Ver faturamento",
      [Permission.BILLING_MANAGE]: "Gerenciar faturamento",
      [Permission.REPORTS_VIEW_ALL]: "Ver todos os relatórios",
      [Permission.REPORTS_VIEW_TEAM]: "Ver relatórios da equipe",
      [Permission.REPORTS_VIEW_OWN]: "Ver próprios relatórios",
      [Permission.COMPANY_UPDATE]: "Editar empresa",
      [Permission.COMPANY_DELETE]: "Excluir empresa",
    };
    return labels[permission] || permission;
  };

  const colorOptions = [
    { value: "bg-blue-100 text-blue-800", label: "Azul" },
    { value: "bg-green-100 text-green-800", label: "Verde" },
    { value: "bg-purple-100 text-purple-800", label: "Roxo" },
    { value: "bg-orange-100 text-orange-800", label: "Laranja" },
    { value: "bg-pink-100 text-pink-800", label: "Rosa" },
    { value: "bg-indigo-100 text-indigo-800", label: "Índigo" },
    { value: "bg-teal-100 text-teal-800", label: "Teal" },
    { value: "bg-red-100 text-red-800", label: "Vermelho" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/team" className="text-gray-600 hover:text-primary-600">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Cargos Customizados</h1>
                <p className="text-sm text-gray-500">
                  Crie cargos personalizados com permissões específicas
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowCreateModal(true);
              }}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Novo Cargo</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Roles List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customRoles.map((role) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Shield className="w-6 h-6 text-primary-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{role.name}</h3>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${role.color}`}>
                      {role.permissions.length} permissões
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEditRole(role)}
                    className="text-gray-400 hover:text-primary-600 transition-colors"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteRole(role.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">{role.description}</p>
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-500 uppercase">Permissões:</p>
                <div className="flex flex-wrap gap-1">
                  {role.permissions.slice(0, 3).map((permission) => (
                    <span
                      key={permission}
                      className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded"
                    >
                      {getPermissionLabel(permission).split(" ")[0]}
                    </span>
                  ))}
                  {role.permissions.length > 3 && (
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                      +{role.permissions.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {customRoles.length === 0 && (
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum cargo customizado
            </h3>
            <p className="text-gray-500 mb-6">
              Crie cargos personalizados para sua equipe
            </p>
            <button
              onClick={() => {
                resetForm();
                setShowCreateModal(true);
              }}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Criar Primeiro Cargo
            </button>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {(showCreateModal || editingRole) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowCreateModal(false);
              setEditingRole(null);
              resetForm();
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingRole ? "Editar Cargo" : "Novo Cargo"}
                </h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingRole(null);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Templates */}
                {!editingRole && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Templates (opcional)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {ROLE_TEMPLATES.map((template) => (
                        <button
                          key={template.name}
                          onClick={() => handleUseTemplate(template)}
                          className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 text-left"
                        >
                          <span className="font-medium">{template.name}</span>
                          <p className="text-xs text-gray-500">{template.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Nome */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Cargo *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Instalador, Engenheiro, Atendente"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {/* Descrição */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Descreva as responsabilidades deste cargo"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {/* Cor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cor do Badge
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setFormData({ ...formData, color: color.value })}
                        className={`px-3 py-2 rounded-lg border-2 ${
                          formData.color === color.value
                            ? "border-primary-600"
                            : "border-transparent"
                        } ${color.value}`}
                      >
                        {color.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Permissões */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Permissões * ({formData.permissions.length} selecionadas)
                  </label>
                  <div className="space-y-3">
                    {PERMISSION_GROUPS.map((group) => {
                      const isExpanded = expandedGroups.includes(group.id);
                      const allSelected = group.permissions.every((p) =>
                        formData.permissions.includes(p)
                      );
                      const someSelected = group.permissions.some((p) =>
                        formData.permissions.includes(p)
                      );

                      return (
                        <div
                          key={group.id}
                          className="border border-gray-200 rounded-lg overflow-hidden"
                        >
                          <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => selectAllInGroup(group.permissions)}
                                className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                  allSelected
                                    ? "bg-primary-600 border-primary-600"
                                    : someSelected
                                    ? "bg-primary-200 border-primary-600"
                                    : "border-gray-300"
                                }`}
                              >
                                {allSelected && <Check className="w-4 h-4 text-white" />}
                              </button>
                              <div>
                                <h4 className="font-medium text-gray-900">{group.name}</h4>
                                <p className="text-xs text-gray-500">{group.description}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => toggleGroup(group.id)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-5 h-5" />
                              ) : (
                                <ChevronDown className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                          {isExpanded && (
                            <div className="p-4 space-y-2">
                              {group.permissions.map((permission) => (
                                <label
                                  key={permission}
                                  className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
                                >
                                  <input
                                    type="checkbox"
                                    checked={formData.permissions.includes(permission)}
                                    onChange={() => togglePermission(permission)}
                                    className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                                  />
                                  <span className="text-sm text-gray-700">
                                    {getPermissionLabel(permission)}
                                  </span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingRole(null);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={editingRole ? handleUpdateRole : handleCreateRole}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
                >
                  <Save className="w-5 h-5" />
                  <span>{editingRole ? "Salvar Alterações" : "Criar Cargo"}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
