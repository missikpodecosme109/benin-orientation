"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { motion } from "motion/react";
import { UserPlus } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { AuthLayout } from "@/components/AuthLayout";

export default function InscriptionPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [erreurs, setErreurs] = useState<Record<string, string[]>>({});
  const [erreurGenerale, setErreurGenerale] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErreurs({});
    setErreurGenerale(null);
    setEnvoi(true);
    try {
      await register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      router.push("/tableau-de-bord");
    } catch (err) {
      if (err instanceof ApiError && err.errors) {
        setErreurs(err.errors);
      } else if (err instanceof ApiError) {
        setErreurGenerale(err.message);
      } else {
        setErreurGenerale("Impossible de créer le compte pour le moment.");
      }
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-800/30 dark:text-brand-300">
          <UserPlus className="h-6 w-6" />
        </span>
        <h1 className="mt-4 text-2xl font-bold tracking-tight">
          Créer un compte
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gratuit, pour sauvegarder vos simulations et vos filières favorites.
        </p>
      </motion.div>

      <Card className="mt-8">
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <Input
            id="name"
            label="Nom complet"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            erreurs={erreurs.name}
          />
          <Input
            id="email"
            label="Adresse email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            erreurs={erreurs.email}
          />
          <Input
            id="password"
            label="Mot de passe (8 caractères minimum)"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            erreurs={erreurs.password}
          />
          <Input
            id="password_confirmation"
            label="Confirmez le mot de passe"
            type="password"
            required
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
          />

          {erreurGenerale && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm font-medium text-red-600">
              {erreurGenerale}
            </p>
          )}

          <Button type="submit" disabled={envoi} className="mt-2 w-full">
            {envoi ? "Création..." : "Créer mon compte"}
          </Button>
        </form>
      </Card>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Déjà inscrit ?{" "}
        <Link href="/connexion" className="font-medium text-brand-600">
          Se connecter
        </Link>
      </p>
    </AuthLayout>
  );
}
