import { useState } from "react";
import type { Page } from "../data";
import { malagasyRegions } from "../data";

interface SimplePageProps {
  onNavigate: (page: Page) => void;
}

export function AddressesPage({ onNavigate }: SimplePageProps) {
  const addresses = [
    { id: "a1", label: "Domicile", recipientName: "Rakoto Andry", phone: "+261 34 12 345 67", street: "Lot II A 34 Ankorondrano", district: "Antananarivo Renivohitra", city: "Antananarivo", region: "Analamanga", postalCode: "101", isDefault: true },
    { id: "a2", label: "Bureau", recipientName: "Rakoto Andry", phone: "+261 34 12 345 67", street: "Immeuble FIARO, Rue Rainandriamampandry", district: "Antananarivo Renivohitra", city: "Antananarivo", region: "Analamanga", postalCode: "101", isDefault: false },
  ];
  const [adding, setAdding] = useState(false);

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl font-700 text-slate-900">Mes adresses</h1>
          <button onClick={() => setAdding(!adding)} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-600 hover:bg-blue-700 transition-colors">+ Nouvelle adresse</button>
        </div>

        {adding && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-4 grid grid-cols-2 gap-3">
            <h3 className="col-span-2 font-700 text-slate-900 text-sm mb-1">Nouvelle adresse</h3>
            {[
              { label: "Nom du destinataire *", col: 2, placeholder: "Rakoto Andry" },
              { label: "Téléphone *", col: 2, placeholder: "+261 34 XX XXX XX" },
              { label: "Libellé (ex: Domicile)", col: 1, placeholder: "Domicile" },
              { label: "Code postal", col: 1, placeholder: "101" },
              { label: "Rue / Lot / Adresse *", col: 2, placeholder: "Lot II A 34..." },
              { label: "District", col: 1, placeholder: "Antananarivo Renivohitra" },
              { label: "Ville *", col: 1, placeholder: "Antananarivo" },
            ].map((f, i) => (
              <div key={i} className={f.col === 2 ? "col-span-2" : ""}>
                <label className="text-xs font-600 text-slate-600 block mb-1">{f.label}</label>
                <input type="text" placeholder={f.placeholder} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"/>
              </div>
            ))}
            <div className="col-span-2">
              <label className="text-xs font-600 text-slate-600 block mb-1">Région *</label>
              <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 bg-white">
                {malagasyRegions.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-xs font-600 text-slate-600 block mb-1">Instructions de livraison (facultatif)</label>
              <input type="text" placeholder="Ex : Sonner au portail..." className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"/>
            </div>
            <div className="col-span-2 flex justify-end gap-3">
              <button onClick={() => setAdding(false)} className="text-sm text-slate-500 hover:text-slate-900 px-4 py-2 rounded-lg border border-slate-200">Annuler</button>
              <button className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg font-600 hover:bg-blue-700 transition-colors">Enregistrer</button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {addresses.map(addr => (
            <div key={addr.id} className="bg-white border border-slate-200 rounded-2xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-700 text-slate-900">{addr.recipientName}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-600">{addr.label}</span>
                    {addr.isDefault && <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-600">Par défaut</span>}
                  </div>
                  <p className="text-sm text-slate-600">{addr.street}</p>
                  <p className="text-sm text-slate-600">{addr.district}, {addr.city} {addr.postalCode}</p>
                  <p className="text-xs text-slate-400">{addr.region} · 📞 {addr.phone}</p>
                </div>
                <div className="flex gap-2">
                  <button className="text-xs text-blue-600 hover:underline">Modifier</button>
                  <button className="text-xs text-red-500 hover:underline">Supprimer</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => onNavigate("account")} className="mt-4 text-sm text-blue-600 font-600 hover:underline">← Retour au compte</button>
      </div>
    </div>
  );
}

export function PaymentMethodsPage({ onNavigate }: SimplePageProps) {
  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl font-700 text-slate-900">Moyens de paiement</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-600 hover:bg-blue-700 transition-colors">+ Ajouter</button>
        </div>
        <div className="space-y-4">
          {[
            { type: "mvola", label: "MVola", phone: "+261 34 12 345 67", isDefault: true, icon: "📱", color: "bg-orange-600", desc: "Paiement mobile Telma" },
            { type: "orange_money", label: "Orange Money", phone: "+261 32 XX XXX XX", isDefault: false, icon: "📱", color: "bg-orange-500", desc: "Paiement mobile Orange" },
            { type: "card", label: "Carte Visa ****3456", phone: null, isDefault: false, icon: "💳", color: "bg-blue-700", desc: "Expire 09/27" },
          ].map((method, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className={`w-10 h-10 rounded-xl ${method.color} flex items-center justify-center text-white text-lg flex-shrink-0`}>{method.icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-700 text-slate-900 text-sm">{method.label}</span>
                    {method.isDefault && <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-600">Par défaut</span>}
                  </div>
                  <p className="text-xs text-slate-500">{method.phone || method.desc}</p>
                  <p className="text-[10px] text-slate-400">{method.desc}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {!method.isDefault && <button className="text-xs text-blue-600 hover:underline">Défaut</button>}
                <button className="text-xs text-red-500 hover:underline">Supprimer</button>
              </div>
            </div>
          ))}
        </div>

        {/* Add new */}
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-5 mt-4">
          <h3 className="font-600 text-slate-900 text-sm mb-3">Ajouter un nouveau moyen de paiement</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { type: "mvola", label: "MVola", color: "bg-orange-600" },
              { type: "orange_money", label: "Orange Money", color: "bg-orange-500" },
              { type: "card", label: "Carte bancaire", color: "bg-blue-700" },
            ].map(pm => (
              <button key={pm.type} className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <span className={`w-8 h-8 rounded-lg ${pm.color} flex items-center justify-center text-white text-sm`}>+</span>
                <span className="text-[10px] font-600 text-slate-700 text-center">{pm.label}</span>
              </button>
            ))}
          </div>
        </div>

        <button onClick={() => onNavigate("account")} className="mt-4 text-sm text-blue-600 font-600 hover:underline">← Retour au compte</button>
      </div>
    </div>
  );
}

export function NotificationsPage({ onNavigate }: SimplePageProps) {
  const [prefs, setPrefs] = useState({
    orderCreated: true, orderShipped: true, orderDelivered: true, orderCancelled: true,
    payment: true, promotions: true, priceDrops: true, backInStock: true,
    newProducts: false, followedStores: false, reviews: true, recommendations: true,
    email: false, push: true,
  });

  const notifications = [
    { icon: "📦", title: "Commande expédiée !", body: "Votre casque Sony WH-1000XM5 a été expédié via Colissimo Madagascar. Numéro de suivi : NVM-2024-884712-001", time: "Il y a 2h", unread: true },
    { icon: "💰", title: "Baisse de prix !", body: "Le JBL Flip 6 que vous avez mis en favori a baissé de Ar 590 000 à Ar 460 000 (−22%)", time: "Il y a 5h", unread: true },
    { icon: "⭐", title: "Laissez votre avis", body: "Vous avez reçu votre Dell XPS 15. Partagez votre expérience avec la communauté.", time: "Il y a 1j", unread: true },
    { icon: "🎉", title: "Vente flash démarrée !", body: "Jusqu'à 40% de remise sur l'Électronique. Ne manquez pas les offres !", time: "Il y a 2j", unread: false },
    { icon: "✅", title: "Commande livrée", body: "Votre commande #ORD-2024-643918 a été livrée avec succès.", time: "Il y a 3j", unread: false },
  ];

  type PrefKey = keyof typeof prefs;

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-700 text-slate-900">Notifications</h1>
          <button className="text-sm text-blue-600 font-600 hover:underline">Tout marquer comme lu</button>
        </div>

        {/* Notification list */}
        <div className="space-y-2">
          {notifications.map((n, i) => (
            <div key={i} className={`bg-white border rounded-xl p-4 flex gap-3 ${n.unread ? "border-blue-200 bg-blue-50/30" : "border-slate-200"}`}>
              <span className="text-2xl flex-shrink-0">{n.icon}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-600 text-slate-900 text-sm">{n.title}</p>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.time}</span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{n.body}</p>
              </div>
              {n.unread && <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-1.5"/>}
            </div>
          ))}
        </div>

        {/* Preferences */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <h2 className="font-700 text-slate-900 mb-4">Préférences de notification</h2>
          <div className="space-y-3">
            {([
              ["orderShipped", "Commande expédiée"],
              ["orderDelivered", "Commande livrée"],
              ["priceDrops", "Baisses de prix (favoris)"],
              ["backInStock", "Retour en stock"],
              ["promotions", "Promotions et offres"],
              ["reviews", "Demandes d'avis"],
              ["recommendations", "Recommandations personnalisées"],
              ["followedStores", "Nouveaux produits des boutiques suivies"],
              ["push", "Notifications push"],
              ["email", "Notifications par e-mail"],
            ] as [PrefKey, string][]).map(([key, label]) => (
              <label key={key} className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-slate-700">{label}</span>
                <div
                  onClick={() => setPrefs(p => ({ ...p, [key]: !p[key] }))}
                  className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer ${prefs[key] ? "bg-blue-600" : "bg-slate-200"}`}
                >
                  <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${prefs[key] ? "translate-x-4" : "translate-x-0"}`}/>
                </div>
              </label>
            ))}
          </div>
        </div>

        <button onClick={() => onNavigate("account")} className="text-sm text-blue-600 font-600 hover:underline">← Retour au compte</button>
      </div>
    </div>
  );
}

export function ReturnsPage({ onNavigate }: SimplePageProps) {
  const [step, setStep] = useState(0);
  const [reason, setReason] = useState("");
  const [refundMethod, setRefundMethod] = useState("");

  const reasons = [
    "Article endommagé ou défectueux",
    "Article reçu incorrect",
    "Non conforme à la description",
    "J'ai changé d'avis",
    "Ne convient pas (taille, couleur...)",
    "Autre raison",
  ];
  const refundMethods = ["Moyen de paiement d'origine", "Crédit Nova Market", "Virement bancaire", "MVola", "Orange Money"];

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4">
        <button onClick={() => onNavigate("orders")} className="text-sm text-blue-600 font-600 hover:underline mb-5 flex items-center gap-1">← Retour aux commandes</button>
        <h1 className="font-display text-2xl font-700 text-slate-900 mb-6">Retourner un article</h1>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-6">
          {["Motif", "Remboursement", "Confirmation"].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full text-xs font-700 flex items-center justify-center ${i <= step ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-400"}`}>{i < step ? "✓" : i + 1}</div>
              <span className={`text-xs ${i === step ? "text-blue-600 font-600" : "text-slate-400"} hidden sm:block`}>{s}</span>
              {i < 2 && <div className="w-8 h-0.5 bg-slate-200 flex-shrink-0"/>}
            </div>
          ))}
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          {step === 0 && (
            <div>
              <h2 className="font-700 text-slate-900 mb-1">Quel est le motif du retour ?</h2>
              <p className="text-slate-500 text-sm mb-4">Sélectionnez le motif le plus approprié pour accélérer le traitement.</p>
              <div className="space-y-2">
                {reasons.map(r => (
                  <label key={r} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${reason === r ? "border-blue-600 bg-blue-50" : "border-slate-200 hover:border-slate-300"}`}>
                    <input type="radio" name="reason" checked={reason === r} onChange={() => setReason(r)} />
                    <span className="text-sm text-slate-700">{r}</span>
                  </label>
                ))}
              </div>
              <button onClick={() => reason && setStep(1)} disabled={!reason} className={`mt-4 w-full py-3 rounded-xl font-600 text-sm transition-colors ${reason ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}>
                Continuer →
              </button>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="font-700 text-slate-900 mb-1">Mode de remboursement</h2>
              <p className="text-slate-500 text-sm mb-4">Le remboursement est traité sous 3 à 5 jours ouvrables.</p>
              <div className="space-y-2">
                {refundMethods.map(m => (
                  <label key={m} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${refundMethod === m ? "border-blue-600 bg-blue-50" : "border-slate-200 hover:border-slate-300"}`}>
                    <input type="radio" name="refund" checked={refundMethod === m} onChange={() => setRefundMethod(m)} />
                    <span className="text-sm text-slate-700">{m}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={() => setStep(0)} className="flex-1 border border-slate-300 text-slate-700 py-3 rounded-xl font-600 text-sm hover:border-slate-400 transition-colors">← Retour</button>
                <button onClick={() => refundMethod && setStep(2)} disabled={!refundMethod} className={`flex-1 py-3 rounded-xl font-600 text-sm transition-colors ${refundMethod ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}>
                  Soumettre la demande
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4 text-white text-2xl">✓</div>
              <h2 className="font-display text-xl font-700 text-slate-900 mb-1">Demande de retour envoyée</h2>
              <p className="text-slate-500 text-sm mb-4">Vous recevrez une étiquette de retour prépayée par e-mail sous 24h.</p>
              <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-600 text-left mb-5 space-y-1">
                <p><strong>Motif :</strong> {reason}</p>
                <p><strong>Remboursement via :</strong> {refundMethod}</p>
                <p><strong>Délai estimé :</strong> 3–5 jours ouvrables</p>
              </div>
              <button onClick={() => onNavigate("orders")} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-600 text-sm hover:bg-blue-700 transition-colors">
                Retour aux commandes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function NotFoundPage({ onNavigate }: SimplePageProps) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <p className="font-display text-8xl font-800 text-slate-100 mb-4">404</p>
        <h1 className="font-display text-2xl font-700 text-slate-900 mb-2">Page introuvable</h1>
        <p className="text-slate-500 mb-8">La page que vous cherchez n'existe pas ou a été déplacée.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => onNavigate("home")} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-600 hover:bg-blue-700 transition-colors">Retour à l'accueil</button>
          <button onClick={() => onNavigate("search")} className="border border-slate-300 text-slate-700 px-6 py-3 rounded-xl font-600 hover:border-slate-400 transition-colors">Rechercher un produit</button>
        </div>
      </div>
    </div>
  );
}
