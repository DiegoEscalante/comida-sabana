import { useState } from "react";
import LogoHeader from "../components/LogoHeader";
import AuthCard from "../components/AuthCard";
import FormInput from "../components/FormInput";
import PrimaryButton from "../components/PrimaryButton";
import { Link } from "react-router-dom";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-white">
      <LogoHeader />
      <AuthCard title="Crear cuenta">
        <form>
            <div className="flex gap-4">
                <div className="w-1/2">
                    <FormInput
                        label="Nombre"
                        type="text"
                        name="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>
                <div className="w-1/2">
                    <FormInput
                        label="Apellido"
                        type="text"
                        name="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>
            </div>

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

            <div className="text-sm mb-4">
                <Link to="/" className="text-blue-900 hover:underline">
                    ¿Ya tienes cuenta? Inicia sesión
                </Link>
            </div>

          <PrimaryButton>Registrarte</PrimaryButton>
        </form>
      </AuthCard>
    </div>
  );
}