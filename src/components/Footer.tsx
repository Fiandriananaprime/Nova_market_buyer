import type { Page } from "../data";

interface FooterProps {
  onNavigate: (page: Page) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-slate-900 text-slate-400">
      {/* Trust strip */}
      <div className="border-t border-slate-800 bg-slate-800">
        <div className="max-w-[1400px] mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: "🚚", title: "Livraison rapide", desc: "Partout à Madagascar" },
            { icon: "🔒", title: "Paiement sécurisé", desc: "MVola · Orange Money · Carte" },
            { icon: "↩️", title: "Retours faciles", desc: "30 jours sans question" },
            { icon: "🛡️", title: "Protection acheteur", desc: "100 % garanti" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className="text-white text-sm font-600">{item.title}</p>
                <p className="text-slate-400 text-xs">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-[1400px] mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-baseline gap-0.5 mb-3">
              <span className="font-display text-xl font-800 text-white">nova<span className="text-blue-500">·</span><span className="text-blue-500">market</span></span>
              <span className="text-[10px] text-slate-500 ml-0.5">.mg</span>
            </div>
            <p className="text-sm leading-relaxed mb-4">Des millions de produits. Des milliers de vendeurs vérifiés. Une seule marketplace malgache.</p>
            <div className="flex gap-2 mb-4">
              {["fb", "ig", "tw", "yt"].map((s, i) => (
                <button key={i} className="w-8 h-8 rounded-full bg-slate-700 hover:bg-blue-600 transition-colors flex items-center justify-center text-xs text-white">{["f", "ig", "𝕏", "▶"][i]}</button>
              ))}
            </div>
            {/* Malagasy mobile payment logos */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] text-slate-500">Paiement :</span>
              {[
                { label: "MVola", color: "bg-orange-600" },
                { label: "Orange", color: "bg-orange-500" },
                { label: "VISA", color: "bg-blue-700" },
                { label: "COD", color: "bg-green-700" },
              ].map(m => (
                <span key={m.label} className={`px-2 py-0.5 ${m.color} text-white text-[9px] rounded font-700`}>{m.label}</span>
              ))}
            </div>
          </div>

          {[
            {
              title: "Acheter",
              links: ["Promotions du jour", "Nouveautés", "Meilleures ventes", "Électronique", "Mode", "Maison & Déco", "Alimentation"],
            },
            {
              title: "Marketplace",
              links: ["Devenir vendeur", "Espace vendeur", "Publicité", "Solutions entreprises", "Programme d'affiliation"],
            },
            {
              title: "Mon compte",
              links: ["Mes commandes", "Mes favoris", "Mes avis", "Mes adresses", "Moyens de paiement"],
            },
            {
              title: "Aide & Support",
              links: ["Centre d'aide", "Suivre ma commande", "Retours & remboursements", "Protection acheteur", "Signaler un problème", "Accessibilité"],
            },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-white text-sm font-600 mb-3">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link, j) => (
                  <li key={j}>
                    <button className="text-sm hover:text-white transition-colors" onClick={() => onNavigate("home")}>{link}</button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-[1400px] mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span>🇲🇬</span>
            <p>© 2024 Nova Market SARL. Tous droits réservés. Antananarivo, Madagascar.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <button className="hover:text-white transition-colors">Politique de confidentialité</button>
            <button className="hover:text-white transition-colors">Conditions d'utilisation</button>
            <button className="hover:text-white transition-colors">Cookies</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
