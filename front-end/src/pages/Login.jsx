import { useState } from "react";
import LogoHeader from "../components/LogoHeader";
import AuthCard from "../components/AuthCard";
import FormInput from "../components/FormInput";
import PrimaryButton from "../components/PrimaryButton";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-white">
      <LogoHeader />
      <AuthCard title="Inicio de sesión">
        <form>
          <FormInput
            label="Correo electrónico"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormInput
            label="Contraseña"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Comentado: ¿Olvidaste tu contraseña?
          <div className="text-sm mb-2">
            <a href="/change-password" className="text-blue-700 hover:underline">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
          */}

            <div className="text-sm mb-4">
                ¿No tienes una cuenta?{" "}
                <Link to="/register" className="text-blue-700 hover:underline">
                    Regístrate
                </Link>
            </div>

          <PrimaryButton>Ingresar</PrimaryButton>
        </form>
      </AuthCard>
    </div>
  );
}