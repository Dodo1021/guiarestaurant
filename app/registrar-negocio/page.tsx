"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

const CATEGORIAS = [
  { name: "Mexicana", icon: "🌮" },
  { name: "Italiana", icon: "🍝" },
  { name: "Japonesa", icon: "🍣" },
  { name: "China", icon: "🥡" },
  { name: "Americana", icon: "🍔" },
  { name: "Mariscos", icon: "🦐" },
  { name: "Tacos", icon: "🌯" },
  { name: "Pizza", icon: "🍕" },
  { name: "Hamburguesas", icon: "🍔" },
  { name: "Café", icon: "☕" },
  { name: "Bar", icon: "🍺" },
  { name: "Postres", icon: "🍰" },
  { name: "Vegetariana", icon: "🥗" },
  { name: "Vegana", icon: "🌱" },
  { name: "Comida Rápida", icon: "🍟" },
  { name: "Buffet", icon: "🍽️" },
  { name: "Desayunos", icon: "🍳" },
  { name: "Parrilla", icon: "🥩" },
  { name: "Árabe", icon: "🧆" },
  { name: "Coreana", icon: "🍜" },
  { name: "Peruana", icon: "🐟" },
  { name: "Antojitos", icon: "🫔" },
  { name: "Birria", icon: "🍲" },
  { name: "Tortas", icon: "🥪" },
  { name: "Alitas", icon: "🍗" },
  { name: "Sushi", icon: "🍱" },
  { name: "Helados", icon: "🍦" },
  { name: "Otro", icon: "🍴" }
];

const PRECIOS = [
  { value: "$", label: "Económico", desc: "$50-150 por persona", icon: "💵" },
  { value: "$$", label: "Moderado", desc: "$150-300 por persona", icon: "💰" },
  { value: "$$$", label: "Caro", desc: "$300-500 por persona", icon: "💎" },
  { value: "$$$$", label: "Premium", desc: "+$500 por persona", icon: "👑" },
];

const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

interface FormData {
  // Propietario
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  // Restaurante
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  facebook: string;
  instagram: string;
  whatsapp: string;
  estado: string;
  municipio: string;
  codigoPostal: string;
  categoria: string[];
  precioPromedio: string;
  horarios: { [key: string]: { abierto: boolean; apertura: string; cierre: string } };
  // Imágenes
  logo: string;
  imagenes: string[];
}

export default function RegistrarNegocioPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [honeypot, setHoneypot] = useState(""); // Campo trampa para bots
  const [formStartTime] = useState(Date.now()); // Timestamp anti-bot
  
  const logoInputRef = useRef<HTMLInputElement>(null);
  const imagesInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<FormData>({
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
    name: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    facebook: "",
    instagram: "",
    whatsapp: "",
    estado: "",
    municipio: "",
    codigoPostal: "",
    categoria: [],
    precioPromedio: "",
    horarios: DIAS.reduce((acc, dia) => ({
      ...acc,
      [dia]: { abierto: dia !== "Domingo", apertura: "09:00", cierre: "21:00" }
    }), {}),
    logo: "",
    imagenes: [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoriaChange = (categoria: string) => {
    setFormData(prev => ({
      ...prev,
      categoria: prev.categoria.includes(categoria)
        ? prev.categoria.filter(c => c !== categoria)
        : prev.categoria.length < 5 ? [...prev.categoria, categoria] : prev.categoria
    }));
  };

  const handleHorarioChange = (dia: string, field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      horarios: {
        ...prev.horarios,
        [dia]: { ...prev.horarios[dia], [field]: value }
      }
    }));
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      const res = await fetch("/api/upload/public", {
        method: "POST",
        body: formData,
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al subir imagen");
      }
      
      const data = await res.json();
      return data.url;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingLogo(true);
    const url = await uploadFile(file);
    if (url) {
      setFormData(prev => ({ ...prev, logo: url }));
    }
    setUploadingLogo(false);
  };

  const handleImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploadingImages(true);
    const newImages: string[] = [];
    
    for (let i = 0; i < Math.min(files.length, 6 - formData.imagenes.length); i++) {
      const url = await uploadFile(files[i]);
      if (url) newImages.push(url);
    }
    
    setFormData(prev => ({ ...prev, imagenes: [...prev.imagenes, ...newImages] }));
    setUploadingImages(false);
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      imagenes: prev.imagenes.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificación anti-bot: si el formulario se llenó muy rápido (menos de 10 segundos)
    const timeSpent = Date.now() - formStartTime;
    if (timeSpent < 10000) {
      setError("Por favor, toma tu tiempo para llenar el formulario correctamente.");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/registrar-negocio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          website2: honeypot, // Campo honeypot
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al registrar");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 5));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.ownerName && formData.ownerEmail && formData.ownerPhone;
      case 2:
        return formData.name && formData.address && formData.estado && formData.municipio && formData.phone;
      case 3:
        return formData.categoria.length > 0 && formData.precioPromedio;
      case 4:
        return true; // Horarios tienen valores por defecto
      case 5:
        return formData.imagenes.length > 0; // Al menos una foto
      default:
        return false;
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 py-12 px-4 flex items-center justify-center">
        <div className="max-w-lg w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">¡Registro Enviado!</h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Tu restaurante ha sido enviado para revisión. 
              <br />Te notificaremos por correo en <strong>24-48 horas</strong>.
            </p>
            <div className="bg-orange-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-orange-800">
                📧 Revisa tu bandeja de entrada y spam en <strong>{formData.ownerEmail}</strong>
              </p>
            </div>
            <Link 
              href="/"
              className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition shadow-lg"
            >
              Volver al Inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">Volver</span>
          </Link>
          <div className="text-center">
            <h1 className="text-lg font-bold text-gray-800">Registrar Restaurante</h1>
          </div>
          <div className="w-16"></div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    s < step
                      ? "bg-green-500 text-white"
                      : s === step
                      ? "bg-orange-500 text-white ring-4 ring-orange-200"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {s < step ? "✓" : s}
                </div>
                {s < 5 && (
                  <div className={`w-12 sm:w-20 h-1 mx-1 sm:mx-2 rounded ${s < step ? "bg-green-500" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Propietario</span>
            <span>Negocio</span>
            <span>Categorías</span>
            <span>Horarios</span>
            <span>Fotos</span>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit}>
          {/* Honeypot - campo trampa invisible para bots */}
          <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }} aria-hidden="true">
            <label htmlFor="website2">No llenar este campo</label>
            <input
              type="text"
              id="website2"
              name="website2"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Step 1: Propietario */}
          {step === 1 && (
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-2xl">👤</div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Datos del Propietario</h2>
                  <p className="text-sm text-gray-500">Esta información es privada, no se publicará</p>
                </div>
              </div>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre Completo *</label>
                  <input
                    type="text"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition text-lg"
                    placeholder="Ej: Juan Pérez García"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Correo Electrónico *</label>
                  <input
                    type="email"
                    name="ownerEmail"
                    value={formData.ownerEmail}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition text-lg"
                    placeholder="tu@correo.com"
                  />
                  <p className="text-xs text-gray-500 mt-1">Aquí te enviaremos la confirmación</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Teléfono de Contacto *</label>
                  <input
                    type="tel"
                    name="ownerPhone"
                    value={formData.ownerPhone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition text-lg"
                    placeholder="33 1234 5678"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Datos del Negocio */}
          {step === 2 && (
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-2xl">🍽️</div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Datos del Restaurante</h2>
                  <p className="text-sm text-gray-500">Información que aparecerá en tu perfil</p>
                </div>
              </div>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre del Restaurante *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition text-lg"
                    placeholder="Ej: Tacos El Güero"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                    placeholder="Describe tu restaurante, especialidades, ambiente, lo que te hace único..."
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.description.length}/500 caracteres</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Dirección Completa *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                    placeholder="Calle, número, colonia"
                  />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Estado *</label>
                    <input
                      type="text"
                      name="estado"
                      value={formData.estado}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                      placeholder="Jalisco"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Ciudad *</label>
                    <input
                      type="text"
                      name="municipio"
                      value={formData.municipio}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                      placeholder="Guadalajara"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">C.P.</label>
                    <input
                      type="text"
                      name="codigoPostal"
                      value={formData.codigoPostal}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                      placeholder="44100"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Teléfono del Negocio *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                      placeholder="33 1234 5678"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">WhatsApp</label>
                    <input
                      type="tel"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                      placeholder="Con código de país: 521..."
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Facebook</label>
                    <input
                      type="text"
                      name="facebook"
                      value={formData.facebook}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                      placeholder="facebook.com/tunegocio"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Instagram</label>
                    <input
                      type="text"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                      placeholder="@tunegocio"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Categorías y Precio */}
          {step === 3 && (
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-2xl">🏷️</div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Tipo de Cocina</h2>
                  <p className="text-sm text-gray-500">Selecciona hasta 5 categorías</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8">
                {CATEGORIAS.map(cat => (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => handleCategoriaChange(cat.name)}
                    className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                      formData.categoria.includes(cat.name)
                        ? "bg-orange-50 border-orange-500 text-orange-700 shadow-md"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-xl">{cat.icon}</span>
                    <span className="text-sm font-medium">{cat.name}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-2xl">💰</div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Rango de Precios</h2>
                  <p className="text-sm text-gray-500">¿Cuánto gasta una persona en promedio?</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {PRECIOS.map(precio => (
                  <button
                    key={precio.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, precioPromedio: precio.value }))}
                    className={`p-4 rounded-xl border-2 transition-all text-center ${
                      formData.precioPromedio === precio.value
                        ? "bg-orange-50 border-orange-500 text-orange-700 shadow-md"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="text-2xl mb-1">{precio.icon}</div>
                    <div className="text-lg font-bold">{precio.value}</div>
                    <div className="text-sm font-medium">{precio.label}</div>
                    <div className="text-xs text-gray-500">{precio.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Horarios */}
          {step === 4 && (
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-2xl">🕐</div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Horarios de Atención</h2>
                  <p className="text-sm text-gray-500">Configura los días y horas que abres</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {DIAS.map(dia => (
                  <div key={dia} className={`flex items-center gap-4 p-4 rounded-xl border-2 transition ${formData.horarios[dia].abierto ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                    <button
                      type="button"
                      onClick={() => handleHorarioChange(dia, 'abierto', !formData.horarios[dia].abierto)}
                      className={`w-12 h-7 rounded-full transition-all ${formData.horarios[dia].abierto ? 'bg-green-500' : 'bg-gray-300'} relative`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all shadow ${formData.horarios[dia].abierto ? 'right-1' : 'left-1'}`} />
                    </button>
                    <span className="font-semibold w-24">{dia}</span>
                    {formData.horarios[dia].abierto ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="time"
                          value={formData.horarios[dia].apertura}
                          onChange={(e) => handleHorarioChange(dia, 'apertura', e.target.value)}
                          className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                        <span className="text-gray-500">a</span>
                        <input
                          type="time"
                          value={formData.horarios[dia].cierre}
                          onChange={(e) => handleHorarioChange(dia, 'cierre', e.target.value)}
                          className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">Cerrado</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Fotos */}
          {step === 5 && (
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-2xl">📸</div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Fotos de tu Restaurante</h2>
                  <p className="text-sm text-gray-500">Las buenas fotos atraen más clientes</p>
                </div>
              </div>

              {/* Logo */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Logo (opcional)</label>
                <div className="flex items-center gap-4">
                  {formData.logo ? (
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-gray-200">
                      <Image src={formData.logo} alt="Logo" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, logo: "" }))}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      disabled={uploadingLogo}
                      className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-orange-500 hover:text-orange-500 transition"
                    >
                      {uploadingLogo ? (
                        <div className="animate-spin w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full" />
                      ) : (
                        <>
                          <span className="text-2xl">+</span>
                          <span className="text-xs">Logo</span>
                        </>
                      )}
                    </button>
                  )}
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <p className="text-sm text-gray-500">Sube el logo de tu negocio</p>
                </div>
              </div>

              {/* Fotos del lugar */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Fotos del lugar * <span className="font-normal text-gray-500">(mínimo 1, máximo 6)</span>
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {formData.imagenes.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200">
                      <Image src={img} alt={`Foto ${i + 1}`} fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm shadow"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {formData.imagenes.length < 6 && (
                    <button
                      type="button"
                      onClick={() => imagesInputRef.current?.click()}
                      disabled={uploadingImages}
                      className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-orange-500 hover:text-orange-500 transition"
                    >
                      {uploadingImages ? (
                        <div className="animate-spin w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full" />
                      ) : (
                        <>
                          <span className="text-3xl">+</span>
                          <span className="text-xs">Agregar</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
                <input
                  ref={imagesInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImagesUpload}
                  className="hidden"
                />
                <p className="text-sm text-gray-500 mt-3">
                  💡 Tip: Sube fotos de tu fachada, interior, platillos favoritos y equipo
                </p>
              </div>

              {/* Preview */}
              {formData.imagenes.length > 0 && (
                <div className="mt-8 p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Vista previa de tu tarjeta:</p>
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-sm">
                    <div className="relative h-40 bg-gray-200">
                      <Image src={formData.imagenes[0]} alt="Preview" fill className="object-cover" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-gray-800">{formData.name || "Nombre del Restaurante"}</h3>
                      <p className="text-sm text-gray-500">{formData.municipio}, {formData.estado}</p>
                      <div className="flex gap-1 mt-2">
                        {formData.categoria.slice(0, 3).map(cat => (
                          <span key={cat} className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded">{cat}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                ← Anterior
              </button>
            ) : (
              <div />
            )}
            
            {step < 5 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={!isStepValid()}
                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                Siguiente →
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading || !isStepValid()}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                    Enviando...
                  </>
                ) : (
                  <>
                    ✓ Enviar Solicitud
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
