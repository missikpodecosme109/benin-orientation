"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { motion } from "motion/react";
import { LogIn } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { AuthLayout } from "@/components/AuthLayout";

export default function ConnexionPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErreur(null);
    setEnvoi(true);
    try {
      await login({ email, password });
      router.push("/tableau-de-bord");
    } catch (err) {
      setErreur(
        err instanceof ApiError
          ? err.message
          : "Impossible de se connecter pour le moment."
      );
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
          <LogIn className="h-6 w-6" />
        </span>
        <h1 className="mt-4 text-2xl font-bold tracking-tight">Connexion</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Retrouvez votre historique de simulations et vos favoris.
        </p>
      </motion.div>

      <Card className="mt-8">
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <Input
            id="email"
            label="Adresse email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            id="password"
            label="Mot de passe"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {erreur && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm font-medium text-red-600">
              {erreur}
            </p>
          )}

          <Button type="submit" disabled={envoi} className="mt-2 w-full">
            {envoi ? "Connexion..." : "Se connecter"}
          </Button>
        </form>
      </Card>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Pas encore de compte ?{" "}
        <Link href="/inscription" className="font-medium text-brand-600">
          Créer un compte
        </Link>
      </p>
    </AuthLayout>
  );
}
