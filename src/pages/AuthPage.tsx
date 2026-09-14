import { useState } from "react";
import type { Page } from "../data";

interface AuthPageProps {
  mode: "login" | "register";
  onNavigate: (page: Page, payload?: unknown) => void;
  onLogin: () => void;
}

type RegisterRole = "buyer" | "seller";

export default function AuthPage({ mode, onNavigate, onLogin }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(mode === "login");
  const [role, setRole] = useState<RegisterRole>("buyer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("+261 ");
  const [businessName, setBusinessName] = useState("");
  const [location, setLocation] = useState("Antananarivo");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Veuillez remplir tous les champs obligatoires."); return; }
    if (password.length < 8) { setError("Le mot de passe doit contenir au moins 8 caractères."); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
      onNavigate("home");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-12 px-4">
      {/* Logo */}
      <button onClick={() => onNavigate("home")} className="mb-8 font-display text-2xl font-800 text-slate-900">
        nova<span className="text-blue-600">·</span><span className="text-blue-600">market</span><span className="text-[11px] text-slate-400 font-400 ml-1">.mg</span>
      </button>

      <div className="w-full max-w-md">
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3.5 text-sm font-700 transition-colors ${isLogin ? "bg-white text-blue-600 border-b-2 border-blue-600" : "bg-slate-50 text-slate-500 hover:text-slate-900"}`}
            >
              Connexion
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3.5 text-sm font-700 transition-colors ${!isLogin ? "bg-white text-blue-600 border-b-2 border-blue-600" : "bg-slate-50 text-slate-500 hover:text-slate-900"}`}
            >
              Créer un compte
            </button>
          </div>

          <div className="p-6">
            {isLogin ? (
              // LOGIN
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <h2 className="font-display text-xl font-700 text-slate-900 mb-1">Bon retour !</h2>
                  <p className="text-slate-500 text-sm">Connectez-vous à votre compte Nova Market.</p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-xs text-red-700 flex items-center gap-2">
                    <span>⚠️</span>{error}
                  </div>
                )}

                <div>
                  <label className="text-xs font-600 text-slate-600 block mb-1">Adresse e-mail</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="votre@email.mg"
                    required
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-600 text-slate-600">Mot de passe</label>
                    <button type="button" className="text-xs text-blue-600 hover:underline">Mot de passe oublié ?</button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 transition-colors pr-10"
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs">
                      {showPass ? "Cacher" : "Voir"}
                    </button>
                  </div>
                </div>

                <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                  <input type="checkbox" className="rounded"/>
                  Se souvenir de moi pendant 30 jours
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-xl font-700 text-sm transition-all ${loading ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"/>
                      Connexion...
                    </span>
                  ) : "Se connecter"}
                </button>

                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"/></div>
                  <span className="relative bg-white px-3 text-xs text-slate-400">ou continuer avec</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {["Google", "Facebook"].map(provider => (
                    <button key={provider} type="button" className="flex items-center justify-center gap-2 border border-slate-200 rounded-xl py-2.5 text-sm font-600 text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-colors">
                      <span>{provider === "Google" ? "G" : "f"}</span>
                      {provider}
                    </button>
                  ))}
                </div>
              </form>
            ) : (
              // REGISTER
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <h2 className="font-display text-xl font-700 text-slate-900 mb-1">Créer un compte</h2>
                  <p className="text-slate-500 text-sm">Rejoignez des milliers d'acheteurs sur Nova Market.</p>
                </div>

                {/* Role selector */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "buyer" as RegisterRole, icon: "🛒", label: "Acheteur", desc: "Je veux acheter" },
                    { id: "seller" as RegisterRole, icon: "🏪", label: "Vendeur", desc: "Je veux vendre" },
                  ].map(r => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id)}
                      className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-colors ${role === r.id ? "border-blue-600 bg-blue-50" : "border-slate-200 hover:border-slate-300"}`}
                    >
                      <span className="text-xl">{r.icon}</span>
                      <span className={`text-sm font-700 ${role === r.id ? "text-blue-700" : "text-slate-700"}`}>{r.label}</span>
                      <span className="text-[10px] text-slate-400">{r.desc}</span>
                    </button>
                  ))}
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-xs text-red-700 flex items-center gap-2">
                    <span>⚠️</span>{error}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-600 text-slate-600 block mb-1">Prénom *</label>
                    <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Rakoto" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-500"/>
                  </div>
                  <div>
                    <label className="text-xs font-600 text-slate-600 block mb-1">Nom *</label>
                    <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Andry" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-500"/>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-600 text-slate-600 block mb-1">Adresse e-mail *</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="votre@email.mg" required className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-500"/>
                </div>

                <div>
                  <label className="text-xs font-600 text-slate-600 block mb-1">Téléphone</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+261 34 XX XXX XX" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-500"/>
                </div>

                {role === "seller" && (
                  <>
                    <div>
                      <label className="text-xs font-600 text-slate-600 block mb-1">Nom de la boutique *</label>
                      <input type="text" value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="Ma Boutique Madagascar" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-500"/>
                    </div>
                    <div>
                      <label className="text-xs font-600 text-slate-600 block mb-1">Localisation</label>
                      <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="Antananarivo" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-500"/>
                    </div>
                  </>
                )}

                <div>
                  <label className="text-xs font-600 text-slate-600 block mb-1">Mot de passe * <span className="font-400 text-slate-400">(min. 8 caractères)</span></label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-500 pr-10"
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                      {showPass ? "Cacher" : "Voir"}
                    </button>
                  </div>
                  {/* Strength indicator */}
                  <div className="flex gap-1 mt-1.5">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className={`flex-1 h-1 rounded-full transition-colors ${password.length >= i * 3 ? (password.length >= 12 ? "bg-green-400" : password.length >= 8 ? "bg-amber-400" : "bg-red-400") : "bg-slate-200"}`}/>
                    ))}
                  </div>
                </div>

                <label className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer">
                  <input type="checkbox" required className="rounded mt-0.5"/>
                  <span>J'accepte les <button type="button" className="text-blue-600 hover:underline">Conditions d'utilisation</button> et la <button type="button" className="text-blue-600 hover:underline">Politique de confidentialité</button> de Nova Market.</span>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-xl font-700 text-sm transition-all ${loading ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"/>
                      Création du compte...
                    </span>
                  ) : (role === "seller" ? "Créer ma boutique" : "Créer mon compte")}
                </button>
              </form>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-4">
          {isLogin ? (
            <>Pas encore de compte ? <button onClick={() => setIsLogin(false)} className="text-blue-600 hover:underline font-600">Créer un compte</button></>
          ) : (
            <>Déjà un compte ? <button onClick={() => setIsLogin(true)} className="text-blue-600 hover:underline font-600">Se connecter</button></>
          )}
        </p>
      </div>
    </div>
  );
}
