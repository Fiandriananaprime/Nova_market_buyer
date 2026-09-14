import { useState } from "react";
import type { CartItem, Currency, Page } from "../data";
import { formatPrice, malagasyRegions } from "../data";

interface CheckoutPageProps {
  cart: CartItem[];
  onNavigate: (page: Page, payload?: unknown) => void;
  onPlaceOrder: () => void;
  currency: Currency;
}

const steps = ["Adresse", "Livraison", "Paiement", "Confirmation"];

const savedAddresses = [
  {
    id: "a1",
    label: "Domicile",
    recipientName: "Rakoto Andry",
    phone: "+261 34 12 345 67",
    street: "Lot II A 34 Ankorondrano",
    district: "Antananarivo Renivohitra",
    city: "Antananarivo",
    region: "Analamanga",
    postalCode: "101",
    country: "MG",
    isDefault: true,
  },
  {
    id: "a2",
    label: "Bureau",
    recipientName: "Rakoto Andry",
    phone: "+261 34 12 345 67",
    street: "Immeuble FIARO, Rue Rainandriamampandry",
    district: "Antananarivo Renivohitra",
    city: "Antananarivo",
    region: "Analamanga",
    postalCode: "101",
    country: "MG",
    isDefault: false,
  },
];

const pickupPoints = [
  { id: "pp1", name: "Nova Market — Andravoahangy", address: "Près du marché Andravoahangy, Antananarivo", hours: "Lu–Sa 8h–18h" },
  { id: "pp2", name: "Nova Market — Analakely", address: "Centre Analakely, Antananarivo", hours: "Lu–Sa 8h–18h, Di 9h–13h" },
  { id: "pp3", name: "Point relais Toamasina", address: "Rue du Commerce, Toamasina", hours: "Lu–Ve 8h–17h" },
];

type PaymentMethodType = "mvola" | "orange_money" | "card" | "cod";
type DeliveryMethod = "standard" | "express" | "pickup";

export default function CheckoutPage({ cart, onNavigate, onPlaceOrder, currency }: CheckoutPageProps) {
  const [step, setStep] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState("a1");
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("standard");
  const [selectedPickup, setSelectedPickup] = useState("pp1");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("mvola");
  const [mobileNumber, setMobileNumber] = useState("+261 34 ");
  const [addingAddress, setAddingAddress] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [note, setNote] = useState("");

  const subtotal = cart.reduce((s, i) => s + i.selectedPrice * i.quantity, 0);
  const shippingCost = deliveryMethod === "express" ? 25_000 : deliveryMethod === "pickup" ? 0 : 0;
  const total = subtotal + shippingCost;

  const handlePlaceOrder = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onPlaceOrder();
      onNavigate("order-confirmation");
    }, 2200);
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-700 transition-colors ${
              i < step ? "bg-green-500 text-white" : i === step ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-400"
            }`}>
              {i < step ? "✓" : i + 1}
            </div>
            <span className={`text-xs mt-1 whitespace-nowrap ${i === step ? "text-blue-600 font-600" : "text-slate-400"}`}>{s}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-12 md:w-20 h-0.5 mx-2 mb-5 transition-colors ${i < step ? "bg-green-500" : "bg-slate-200"}`}/>
          )}
        </div>
      ))}
    </div>
  );

  const OrderSummary = () => (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
        <h3 className="font-700 text-slate-900 text-sm">Résumé de commande</h3>
      </div>
      <div className="p-4 space-y-3">
        {cart.map(item => (
          <div key={item.product.id} className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <img src={item.product.image} alt={item.product.name} className="w-12 h-12 object-cover rounded-xl bg-slate-50"/>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-[9px] font-700 rounded-full flex items-center justify-center">{item.quantity}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-600 text-slate-900 line-clamp-1">{item.product.name}</p>
              <p className="text-[10px] text-slate-400">{item.selectedSeller.name}</p>
            </div>
            <span className="text-sm font-700 text-slate-900 whitespace-nowrap">{formatPrice(item.selectedPrice * item.quantity, currency)}</span>
          </div>
        ))}
        <div className="border-t border-slate-100 pt-3 space-y-1.5 text-sm">
          <div className="flex justify-between text-slate-500">
            <span>Sous-total</span>
            <span>{formatPrice(subtotal, currency)}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Livraison</span>
            <span>{shippingCost === 0 ? <span className="text-green-600 font-500">Gratuite</span> : formatPrice(shippingCost, currency)}</span>
          </div>
          <div className="flex justify-between font-700 text-slate-900 text-base border-t border-slate-200 pt-2">
            <span>Total</span>
            <span className="text-blue-600">{formatPrice(total, currency)}</span>
          </div>
          <p className="text-[10px] text-slate-400">TVA incluse. Prix TTC.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-[1100px] mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => onNavigate("home")} className="font-display text-lg font-800 text-slate-900">
              nova<span className="text-blue-600">·market</span>
            </button>
            <span className="text-slate-300">/</span>
            <h1 className="font-600 text-slate-700">Paiement sécurisé</h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>🔒</span>
            <span className="hidden sm:block">Connexion sécurisée SSL</span>
          </div>
        </div>

        <StepIndicator />

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-4">

            {/* Step 0: Address */}
            {step === 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                <h2 className="font-700 text-slate-900">Adresse de livraison</h2>
                <div className="space-y-3">
                  {savedAddresses.map(addr => (
                    <label key={addr.id} className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${selectedAddress === addr.id ? "border-blue-600 bg-blue-50" : "border-slate-200 hover:border-slate-300"}`}>
                      <input type="radio" name="address" checked={selectedAddress === addr.id} onChange={() => setSelectedAddress(addr.id)} className="mt-0.5"/>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-600 text-slate-900 text-sm">{addr.recipientName}</span>
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-600">{addr.label}</span>
                          {addr.isDefault && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-600">Par défaut</span>}
                        </div>
                        <p className="text-sm text-slate-600">{addr.street}</p>
                        <p className="text-sm text-slate-600">{addr.district}, {addr.city} {addr.postalCode}</p>
                        <p className="text-xs text-slate-400">{addr.region} • 📞 {addr.phone}</p>
                      </div>
                    </label>
                  ))}

                  <button onClick={() => setAddingAddress(!addingAddress)} className="w-full flex items-center gap-2 p-4 rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-400 transition-colors text-slate-500 hover:text-blue-600 text-sm font-600">
                    + Ajouter une nouvelle adresse
                  </button>

                  {addingAddress && (
                    <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                      {[
                        { label: "Nom du destinataire", col: 2 },
                        { label: "Téléphone (ex: +261 34...)", col: 2 },
                        { label: "Rue / Lot / Adresse", col: 2 },
                        { label: "District", col: 1 },
                        { label: "Ville", col: 1 },
                      ].map((f, i) => (
                        <div key={i} className={f.col === 2 ? "col-span-2" : ""}>
                          <label className="text-xs font-600 text-slate-600 block mb-1">{f.label}</label>
                          <input type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 bg-white"/>
                        </div>
                      ))}
                      <div>
                        <label className="text-xs font-600 text-slate-600 block mb-1">Région</label>
                        <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 bg-white">
                          {malagasyRegions.map(r => <option key={r}>{r}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-600 text-slate-600 block mb-1">Code postal</label>
                        <input type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 bg-white"/>
                      </div>
                      <div className="col-span-2">
                        <label className="text-xs font-600 text-slate-600 block mb-1">Instructions de livraison (facultatif)</label>
                        <input type="text" placeholder="ex: Sonner au portail, appeler avant..." className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 bg-white"/>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex justify-end">
                  <button onClick={() => setStep(1)} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-600 text-sm hover:bg-blue-700 transition-colors">
                    Continuer vers la livraison →
                  </button>
                </div>
              </div>
            )}

            {/* Step 1: Delivery */}
            {step === 1 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                <h2 className="font-700 text-slate-900">Mode de livraison</h2>
                <div className="space-y-3">
                  {[
                    { id: "standard" as DeliveryMethod, label: "Livraison standard", desc: "3–7 jours ouvrables", price: "Gratuite", est: "28 nov. – 4 déc.", icon: "📦" },
                    { id: "express" as DeliveryMethod, label: "Livraison express", desc: "1–2 jours ouvrables", price: formatPrice(25_000, currency), est: "22–23 nov.", icon: "⚡" },
                    { id: "pickup" as DeliveryMethod, label: "Retrait en point relais", desc: "Disponible sous 3 jours", price: "Gratuit", est: "23–25 nov.", icon: "🏪" },
                  ].map(option => (
                    <label key={option.id} className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${deliveryMethod === option.id ? "border-blue-600 bg-blue-50" : "border-slate-200 hover:border-slate-300"}`}>
                      <input type="radio" name="delivery" checked={deliveryMethod === option.id} onChange={() => setDeliveryMethod(option.id)} className="mt-0.5"/>
                      <div className="flex-1">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span className="font-600 text-slate-900 text-sm flex items-center gap-1.5">{option.icon} {option.label}</span>
                          <span className="font-700 text-blue-600 text-sm">{option.price}</span>
                        </div>
                        <p className="text-xs text-slate-500">{option.desc} • Livraison estimée : {option.est}</p>
                      </div>
                    </label>
                  ))}

                  {/* Pickup point selector */}
                  {deliveryMethod === "pickup" && (
                    <div className="ml-7 space-y-2">
                      <p className="text-sm font-600 text-slate-700 mb-2">Choisir un point relais :</p>
                      {pickupPoints.map(pp => (
                        <label key={pp.id} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${selectedPickup === pp.id ? "border-blue-400 bg-blue-50" : "border-slate-200 hover:border-slate-300"}`}>
                          <input type="radio" name="pickup" checked={selectedPickup === pp.id} onChange={() => setSelectedPickup(pp.id)} className="mt-0.5"/>
                          <div>
                            <p className="text-sm font-600 text-slate-900">{pp.name}</p>
                            <p className="text-xs text-slate-500">{pp.address}</p>
                            <p className="text-[10px] text-green-600 font-500 mt-0.5">🕒 {pp.hours}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Note */}
                <div>
                  <label className="text-sm font-600 text-slate-700 block mb-1">Note pour le vendeur (facultatif)</label>
                  <textarea
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    placeholder="Instructions spéciales, couleur préférée..."
                    rows={2}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-400 resize-none"
                  />
                </div>

                <div className="flex justify-between">
                  <button onClick={() => setStep(0)} className="text-sm text-slate-500 hover:text-slate-900 font-600">← Retour</button>
                  <button onClick={() => setStep(2)} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-600 text-sm hover:bg-blue-700 transition-colors">Continuer vers le paiement →</button>
                </div>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
                <h2 className="font-700 text-slate-900">Mode de paiement</h2>

                <div className="space-y-3">
                  {/* MVola */}
                  <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === "mvola" ? "border-orange-500 bg-orange-50" : "border-slate-200 hover:border-slate-300"}`}>
                    <input type="radio" name="payment" checked={paymentMethod === "mvola"} onChange={() => setPaymentMethod("mvola")} className="mt-1"/>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="bg-orange-600 text-white text-[10px] font-800 px-2 py-0.5 rounded">MVola</span>
                        <span className="font-600 text-slate-900 text-sm">MVola (Telma)</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">Paiement mobile sécurisé via MVola</p>
                      {paymentMethod === "mvola" && (
                        <div className="mt-3">
                          <label className="text-xs font-600 text-slate-600 block mb-1">Numéro MVola</label>
                          <input
                            type="tel"
                            value={mobileNumber}
                            onChange={e => setMobileNumber(e.target.value)}
                            placeholder="+261 34 XX XXX XX"
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-400 bg-white"
                          />
                          <p className="text-[10px] text-slate-400 mt-1">Un code de confirmation sera envoyé par SMS.</p>
                        </div>
                      )}
                    </div>
                  </label>

                  {/* Orange Money */}
                  <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === "orange_money" ? "border-orange-400 bg-orange-50" : "border-slate-200 hover:border-slate-300"}`}>
                    <input type="radio" name="payment" checked={paymentMethod === "orange_money"} onChange={() => setPaymentMethod("orange_money")} className="mt-1"/>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="bg-orange-500 text-white text-[10px] font-800 px-2 py-0.5 rounded">OM</span>
                        <span className="font-600 text-slate-900 text-sm">Orange Money</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">Paiement mobile via Orange Money</p>
                      {paymentMethod === "orange_money" && (
                        <div className="mt-3">
                          <label className="text-xs font-600 text-slate-600 block mb-1">Numéro Orange Money</label>
                          <input
                            type="tel"
                            value={mobileNumber}
                            onChange={e => setMobileNumber(e.target.value)}
                            placeholder="+261 32 XX XXX XX"
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-400 bg-white"
                          />
                          <p className="text-[10px] text-slate-400 mt-1">Un code de confirmation sera envoyé par SMS.</p>
                        </div>
                      )}
                    </div>
                  </label>

                  {/* Card */}
                  <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === "card" ? "border-blue-600 bg-blue-50" : "border-slate-200 hover:border-slate-300"}`}>
                    <input type="radio" name="payment" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} className="mt-1"/>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-600 text-slate-900 text-sm">💳 Carte bancaire</span>
                        <div className="flex gap-1">
                          {["VISA", "MC"].map(m => <span key={m} className="bg-slate-200 text-slate-600 text-[9px] font-700 px-1.5 py-0.5 rounded">{m}</span>)}
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">Paiement sécurisé par carte</p>
                      {paymentMethod === "card" && (
                        <div className="mt-3 space-y-2">
                          <input type="text" placeholder="1234 5678 9012 3456" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 bg-white"/>
                          <div className="grid grid-cols-2 gap-2">
                            <input type="text" placeholder="MM / AA" className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 bg-white"/>
                            <input type="text" placeholder="CVV" className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 bg-white"/>
                          </div>
                        </div>
                      )}
                    </div>
                  </label>

                  {/* COD */}
                  <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === "cod" ? "border-green-500 bg-green-50" : "border-slate-200 hover:border-slate-300"}`}>
                    <input type="radio" name="payment" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} className="mt-1"/>
                    <div>
                      <span className="font-600 text-slate-900 text-sm flex items-center gap-2">💵 Paiement à la livraison (COD)</span>
                      <p className="text-xs text-slate-500 mt-0.5">Payez en espèces à la réception de votre commande. Disponible uniquement pour Antananarivo.</p>
                    </div>
                  </label>
                </div>

                <div className="bg-green-50 border border-green-100 rounded-xl p-3 flex items-center gap-2 text-xs text-green-800">
                  <span>🔒</span>
                  Vos informations de paiement sont chiffrées et sécurisées. Nous ne stockons jamais vos données bancaires brutes.
                </div>

                <div className="flex justify-between">
                  <button onClick={() => setStep(1)} className="text-sm text-slate-500 hover:text-slate-900 font-600">← Retour</button>
                  <button onClick={() => setStep(3)} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-600 text-sm hover:bg-blue-700 transition-colors">Vérifier la commande →</button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                  <h2 className="font-700 text-slate-900 mb-4">Vérifier la commande</h2>

                  <div className="space-y-3 mb-5">
                    {[
                      {
                        label: "Livrer à",
                        value: (() => {
                          const addr = savedAddresses.find(a => a.id === selectedAddress);
                          return addr ? `${addr.recipientName} — ${addr.street}, ${addr.city}` : "—";
                        })(),
                      },
                      {
                        label: "Mode de livraison",
                        value: deliveryMethod === "express" ? `Express (${formatPrice(25_000, currency)})` : deliveryMethod === "pickup" ? "Retrait en point relais (Gratuit)" : "Standard (Gratuit)",
                      },
                      {
                        label: "Paiement",
                        value: paymentMethod === "mvola" ? `MVola — ${mobileNumber}` : paymentMethod === "orange_money" ? `Orange Money — ${mobileNumber}` : paymentMethod === "cod" ? "Paiement à la livraison" : "Carte bancaire",
                      },
                    ].map(row => (
                      <div key={row.label} className="flex justify-between items-start text-sm border-b border-slate-50 pb-2">
                        <span className="text-slate-500 w-28 flex-shrink-0">{row.label}</span>
                        <span className="text-slate-900 font-500 text-right">{row.value}</span>
                      </div>
                    ))}
                  </div>

                  <OrderSummary />

                  <div className="mt-5">
                    <button
                      onClick={handlePlaceOrder}
                      disabled={processing}
                      className={`w-full py-4 rounded-xl font-700 text-base transition-all ${processing ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                    >
                      {processing ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"/>
                          Traitement en cours...
                        </span>
                      ) : (
                        `Confirmer la commande — ${formatPrice(total, currency)}`
                      )}
                    </button>
                    <p className="text-center text-xs text-slate-400 mt-2">
                      En passant commande, vous acceptez nos Conditions d'utilisation et Politique de confidentialité.
                    </p>
                  </div>
                </div>
                <button onClick={() => setStep(2)} className="text-sm text-slate-500 hover:text-slate-900 font-600">← Retour au paiement</button>
              </div>
            )}
          </div>

          {/* Order summary sidebar */}
          <div className="lg:w-80">
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
