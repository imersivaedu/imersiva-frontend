"use client";

import { useState } from "react";
import { FaTimes, FaPlus } from "react-icons/fa";

interface Class {
  id: string;
  name: string;
  grade: number;
}

interface ExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; classId: string }) => Promise<void>;
  classes: Class[];
  loading?: boolean;
}

export function ExperienceModal({
  isOpen,
  onClose,
  onSubmit,
  classes,
  loading = false,
}: ExperienceModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    classId: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nome da experiência é obrigatório";
    }

    if (!formData.classId) {
      newErrors.classId = "Selecione uma turma";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(formData);

      // Reset form and close modal on success
      setFormData({ name: "", classId: "" });
      setErrors({});
      onClose();
    } catch (error) {
      console.error("Failed to create experience:", error);
      setErrors({ submit: "Erro ao criar experiência. Tente novamente." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({ name: "", classId: "" });
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="bg-black/50 fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className=" rounded-lg bg-gray-50 shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Criar Nova Experiência
          </h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Experience Name */}
            <div>
              <label
                htmlFor="experienceName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nome da Experiência
              </label>
              <input
                type="text"
                id="experienceName"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary ${
                  errors.name ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Digite o nome da experiência"
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Class Selection */}
            <div>
              <label
                htmlFor="classSelect"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Turma
              </label>
              <select
                id="classSelect"
                value={formData.classId}
                onChange={(e) =>
                  setFormData({ ...formData, classId: e.target.value })
                }
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary ${
                  errors.classId ? "border-red-300" : "border-gray-300"
                }`}
                disabled={isSubmitting || loading}
              >
                <option value="">Selecione uma turma</option>
                {classes.map((classItem) => (
                  <option
                    className="text-black"
                    key={classItem.id}
                    value={classItem.id}
                  >
                    {classItem.name} - {classItem.grade}º ano
                  </option>
                ))}
              </select>
              {errors.classId && (
                <p className="mt-1 text-sm text-red-600">{errors.classId}</p>
              )}
              {loading && (
                <p className="mt-1 text-sm text-gray-500">
                  Carregando turmas...
                </p>
              )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Criando...
                </div>
              ) : (
                <div className="flex items-center">
                  <FaPlus className="mr-2" size={14} />
                  Criar Experiência
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
