"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  FaUser,
  FaLock,
  FaGraduationCap,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import Image from "next/image";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      toast.success("Login realizado com sucesso!");
      router.push("/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Erro ao fazer login. Verifique suas credenciais."
      );
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-secondary items-center justify-center p-12">
        <div className="text-center text-white">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-white rounded-full p-4 shadow-md flex items-center justify-center">
              <Image
                src="/imersiva.png"
                alt="Imersiva"
                width={200}
                height={200}
              />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-6">Imersiva</h1>
          <p className="text-xl mb-8 opacity-90">
            Sistema Educacional Imersivo
          </p>
          <div className="space-y-4 text-lg opacity-80">
            <p>✨ Experiências educacionais interativas</p>
            <p>📚 Gestão completa de estudantes</p>
            <p>🎯 Aprendizado personalizado</p>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50 text-black">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Image
              src="/imersiva.png"
              alt="Imersiva"
              width={100}
              height={100}
            />
            <h1 className="text-3xl font-bold text-gray-800">Imersiva</h1>
            <p className="text-gray-600">Sistema Educacional</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-primary  mb-2">
                Bem-vindo de volta!
              </h2>
              <p>Entre em sua conta para continuar</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className=" text-black">
                  Email
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border rounded px-3 py-2 pl-10 focus:outline-none focus:ring"
                    placeholder="seu@email.com"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className=" text-black">
                  Senha
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border rounded px-3 py-2 pl-10 focus:outline-none focus:ring"
                    placeholder="Sua senha"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={isLoading}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Entrando...
                  </div>
                ) : (
                  "Entrar"
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-black text-sm">
                Esqueceu sua senha?{" "}
                <a
                  href="#"
                  className="text-primary hover:text-primary-dark font-medium"
                >
                  Recuperar senha
                </a>
              </p>
            </div>
          </div>

          <div className="text-center mt-6 text-gray-500 text-sm">
            © 2024 Imersiva. Todos os direitos reservados.
          </div>
        </div>
      </div>
    </div>
  );
}
