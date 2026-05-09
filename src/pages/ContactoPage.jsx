import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import emailjs from "@emailjs/browser";
import { useSettings } from "../context/SettingsContext";

export default function ContactoPage() {
  const { t } = useSettings();
  const user = (()=>{ try{return JSON.parse(localStorage.getItem("rl_user"));}catch{return null;} })();

  const SUBJECTS = t.contact_subjects;

  const [form, setForm] = useState({ name:user?.nombre||user?.name||"", email:user?.email||"", subject:SUBJECTS[0], message:"" });
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState("");

  function handleChange(f,v){ setForm(p=>({...p,[f]:v})); }

  async function handleSubmit(e){
    e.preventDefault();
    if(!form.name||!form.email||!form.message){ setError(t.contact_error); return; }
    setError(""); setLoading(true);
    
    try {
      // 📧 1. Enviar correo a ti (Contact Us)
      await emailjs.send(
        "service_bjnunki",           // ← Cambia por tu Service ID
        "template_3wjh31w", // ← Cambia por tu Template ID de Contact Us
        {
          from_name: form.name,
          from_email: form.email,
          subject: form.subject,
          message: form.message,
          to_email: "ikerfc09@gmail.com"
        },
        "UdXS6zUnQy62pa6JY"            // ← Cambia por tu Public Key
      );

      // 📧 2. Enviar correo de confirmación al usuario (Auto-reply)
      await emailjs.send(
        "service_bjnunki",           // ← El mismo Service ID
        "template_k7355mt", // ← Cambia por tu Template ID de Auto-reply
        {
          to_name: form.name,
          to_email: form.email,
          subject: form.subject,
          message: form.message
        },
        "UdXS6zUnQy62pa6JY"            // ← La misma Public Key
      );

      setSent(true);
    } catch(err) {
      console.error("Error al enviar:", err);
      setError("Hubo un error al enviar el mensaje. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet"/>
      <div className="min-h-screen flex flex-col bg-[#fff9f2] dark:bg-gray-900 transition-colors duration-300" style={{ fontFamily:"'DM Sans', sans-serif" }}>
        <Header/>
        
        {/* Header */}
        <div className="py-8 md:py-12 px-4 md:px-6 text-center" style={{ background:"linear-gradient(135deg,rgba(150,95,33,0.1) 0%,rgba(200,160,100,0.06) 100%)", borderBottom:"0.5px solid rgba(150,95,33,0.12)" }}>
          <h1 className="text-2xl md:text-[32px] font-semibold mb-2 text-[#1a1208] dark:text-gray-100" style={{ fontFamily:"'Playfair Display', serif" }}>{t.contact_title}</h1>
          <p className="text-[13px] md:text-[14px] font-light text-[#9c8060]">{t.contact_sub}</p>
        </div>

        <div className="flex-grow flex items-start justify-center px-4 py-8 md:py-12">
          <div className="w-full max-w-2xl">
            {/* Info cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
              {[
                { icon:"📧", label:t.contact_email, val:"ikerfc09@gmail.com" },
                { icon:"📞", label:t.contact_phone, val:"+34 900 123 456" },
                { icon:"🕐", label:t.contact_hours, val:t.contact_hours_val },
              ].map(item=>(
                <div key={item.label} className="rounded-xl p-3 md:p-4 text-center bg-white dark:bg-gray-800 transition-colors duration-300 flex md:block items-center gap-3 md:gap-0"
                  style={{ border:"0.5px solid rgba(150,95,33,0.18)", boxShadow:"0 2px 12px rgba(150,95,33,0.06)" }}>
                  <div className="text-xl md:text-2xl">{item.icon}</div>
                  <div className="text-left md:text-center">
                    <p className="text-[10px] uppercase tracking-widest text-[#9c8060]">{item.label}</p>
                    <p className="text-[12px] font-semibold text-[#5c4a2a] dark:text-gray-300">{item.val}</p>
                  </div>
                </div>
              ))}
            </div>

            {sent?(
              <div className="rounded-2xl p-6 md:p-10 text-center bg-white dark:bg-gray-800" style={{ border:"0.5px solid rgba(150,95,33,0.18)", boxShadow:"0 4px 24px rgba(150,95,33,0.08)" }}>
                <span className="text-4xl md:text-5xl block mb-3 md:mb-4">✉️</span>
                <h3 className="text-lg md:text-[22px] font-semibold mb-2 text-[#1a1208] dark:text-gray-100" style={{ fontFamily:"'Playfair Display', serif" }}>{t.contact_sent}</h3>
                <p className="text-[13px] md:text-[14px] mb-5 md:mb-6 text-[#9c8060]">{t.contact_sent_sub}</p>
                <button onClick={()=>{setSent(false);setForm({...form,message:""}); }}
                  className="w-full md:w-auto px-6 py-2.5 rounded-xl text-[13px] font-medium text-white transition-all border-none cursor-pointer"
                  style={{ background:"rgba(150,95,33,1)" }}
                  onMouseEnter={e=>(e.currentTarget.style.background="rgba(110,68,18,1)")}
                  onMouseLeave={e=>(e.currentTarget.style.background="rgba(150,95,33,1)")}>
                  {t.contact_another}
                </button>
              </div>
            ):(
              <form onSubmit={handleSubmit} className="rounded-2xl p-5 md:p-8 bg-white dark:bg-gray-800" style={{ border:"0.5px solid rgba(150,95,33,0.18)", boxShadow:"0 4px 24px rgba(150,95,33,0.08)" }}>
                {/* Nombre y Email - Stack en móvil, grid en desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-3 md:mb-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-medium uppercase tracking-widest text-[#5c4a2a] dark:text-gray-300">{t.contact_name}</label>
                    <input type="text" value={form.name} onChange={e=>handleChange("name",e.target.value)} placeholder="Tu nombre"
                      className="h-10 md:h-11 px-3 md:px-4 rounded-xl text-[13px] md:text-[14px] outline-none transition-all bg-[#faf7f2] dark:bg-gray-700 text-[#1a1208] dark:text-gray-100 border border-[rgba(150,95,33,0.25)] focus:border-[rgba(150,95,33,1)] focus:shadow-[0_0_0_3px_rgba(150,95,33,0.1)]"/>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-medium uppercase tracking-widest text-[#5c4a2a] dark:text-gray-300">{t.contact_mail}</label>
                    <input type="email" value={form.email} onChange={e=>handleChange("email",e.target.value)} placeholder="tu@email.com"
                      className="h-10 md:h-11 px-3 md:px-4 rounded-xl text-[13px] md:text-[14px] outline-none transition-all bg-[#faf7f2] dark:bg-gray-700 text-[#1a1208] dark:text-gray-100 border border-[rgba(150,95,33,0.25)] focus:border-[rgba(150,95,33,1)] focus:shadow-[0_0_0_3px_rgba(150,95,33,0.1)]"/>
                  </div>
                </div>

                {/* Asunto */}
                <div className="flex flex-col gap-1.5 mb-3 md:mb-4">
                  <label className="text-[11px] font-medium uppercase tracking-widest text-[#5c4a2a] dark:text-gray-300">{t.contact_subject}</label>
                  <select value={form.subject} onChange={e=>handleChange("subject",e.target.value)}
                    className="h-10 md:h-11 px-3 md:px-4 rounded-xl text-[13px] md:text-[14px] outline-none transition-all cursor-pointer bg-[#faf7f2] dark:bg-gray-700 text-[#1a1208] dark:text-gray-100 border border-[rgba(150,95,33,0.25)] focus:border-[rgba(150,95,33,1)]">
                    {SUBJECTS.map(s=><option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* Mensaje */}
                <div className="flex flex-col gap-1.5 mb-3 md:mb-4">
                  <label className="text-[11px] font-medium uppercase tracking-widest text-[#5c4a2a] dark:text-gray-300">{t.contact_message}</label>
                  <textarea value={form.message} onChange={e=>handleChange("message",e.target.value)}
                    placeholder="Describe tu consulta..." rows={4}
                    className="px-3 md:px-4 py-2.5 md:py-3 rounded-xl text-[13px] md:text-[14px] outline-none transition-all resize-none bg-[#faf7f2] dark:bg-gray-700 text-[#1a1208] dark:text-gray-100 border border-[rgba(150,95,33,0.25)] focus:border-[rgba(150,95,33,1)]"/>
                </div>

                {error&&<p className="text-[11px] md:text-[12px] mb-3 text-[#b43232]">⚠️ {error}</p>}

                <button type="submit" disabled={loading}
                  className="w-full h-11 md:h-12 flex items-center justify-center gap-2 rounded-xl text-[14px] md:text-[15px] font-medium transition-all text-white border-none cursor-pointer"
                  style={{ background:loading?"rgba(150,95,33,0.5)":"rgba(150,95,33,1)" }}
                  onMouseEnter={e=>!loading&&(e.currentTarget.style.background="rgba(110,68,18,1)")}
                  onMouseLeave={e=>!loading&&(e.currentTarget.style.background="rgba(150,95,33,1)")}>
                  {loading?(
                    <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> {t.contact_sending}</>
                  ):t.contact_send}
                </button>
              </form>
            )}
          </div>
        </div>
        <Footer/>
      </div>
    </>
  );
}