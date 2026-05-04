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
    try{
      await emailjs.send("YOUR_SERVICE_ID","YOUR_TEMPLATE_ID",
        { from_name:form.name, from_email:form.email, subject:form.subject, message:form.message, to_email:"ikerfc09@gmail.com" },
        "YOUR_PUBLIC_KEY"
      );
      setSent(true);
    }catch(err){ console.error(err); setError("Hubo un error al enviar el mensaje."); }
    finally{ setLoading(false); }
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet"/>
      <div className="min-h-screen flex flex-col bg-[#fff9f2] dark:bg-gray-900 transition-colors duration-300" style={{ fontFamily:"'DM Sans', sans-serif" }}>
        <Header/>
        <div className="py-12 px-6 text-center" style={{ background:"linear-gradient(135deg,rgba(150,95,33,0.1) 0%,rgba(200,160,100,0.06) 100%)", borderBottom:"0.5px solid rgba(150,95,33,0.12)" }}>
          <h1 className="text-[32px] font-semibold mb-2 text-[#1a1208] dark:text-gray-100" style={{ fontFamily:"'Playfair Display', serif" }}>{t.contact_title}</h1>
          <p className="text-[14px] font-light text-[#9c8060]">{t.contact_sub}</p>
        </div>

        <div className="flex-grow flex items-start justify-center px-4 py-12">
          <div className="w-full max-w-2xl">
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { icon:"📧", label:t.contact_email, val:"ikerfc09@gmail.com" },
                { icon:"📞", label:t.contact_phone, val:"+34 900 123 456" },
                { icon:"🕐", label:t.contact_hours, val:t.contact_hours_val },
              ].map(item=>(
                <div key={item.label} className="rounded-xl p-4 text-center bg-white dark:bg-gray-800 transition-colors duration-300"
                  style={{ border:"0.5px solid rgba(150,95,33,0.18)", boxShadow:"0 2px 12px rgba(150,95,33,0.06)" }}>
                  <div className="text-2xl mb-1.5">{item.icon}</div>
                  <p className="text-[10px] uppercase tracking-widest mb-0.5 text-[#9c8060]">{item.label}</p>
                  <p className="text-[12px] font-semibold text-[#5c4a2a] dark:text-gray-300">{item.val}</p>
                </div>
              ))}
            </div>

            {sent?(
              <div className="rounded-2xl p-10 text-center bg-white dark:bg-gray-800" style={{ border:"0.5px solid rgba(150,95,33,0.18)", boxShadow:"0 4px 24px rgba(150,95,33,0.08)" }}>
                <span className="text-5xl block mb-4">✉️</span>
                <h3 className="text-[22px] font-semibold mb-2 text-[#1a1208] dark:text-gray-100" style={{ fontFamily:"'Playfair Display', serif" }}>{t.contact_sent}</h3>
                <p className="text-[14px] mb-6 text-[#9c8060]">{t.contact_sent_sub}</p>
                <button onClick={()=>{setSent(false);setForm({...form,message:""}); }}
                  className="px-6 py-2.5 rounded-xl text-[13px] font-medium text-white transition-all border-none cursor-pointer"
                  style={{ background:"rgba(150,95,33,1)" }}
                  onMouseEnter={e=>(e.currentTarget.style.background="rgba(110,68,18,1)")}
                  onMouseLeave={e=>(e.currentTarget.style.background="rgba(150,95,33,1)")}>
                  {t.contact_another}
                </button>
              </div>
            ):(
              <form onSubmit={handleSubmit} className="rounded-2xl p-8 bg-white dark:bg-gray-800" style={{ border:"0.5px solid rgba(150,95,33,0.18)", boxShadow:"0 4px 24px rgba(150,95,33,0.08)" }}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {[
                    { label:t.contact_name, id:"ct-name", type:"text",  field:"name",  placeholder:"Tu nombre" },
                    { label:t.contact_mail, id:"ct-email",type:"email", field:"email", placeholder:"tu@email.com" },
                  ].map(f=>(
                    <div key={f.id} className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-medium uppercase tracking-widest text-[#5c4a2a] dark:text-gray-300">{f.label}</label>
                      <input type={f.type} value={form[f.field]} onChange={e=>handleChange(f.field,e.target.value)} placeholder={f.placeholder}
                        className="h-11 px-4 rounded-xl text-[14px] outline-none transition-all bg-[#faf7f2] dark:bg-gray-700 text-[#1a1208] dark:text-gray-100 border border-[rgba(150,95,33,0.25)] focus:border-[rgba(150,95,33,1)] focus:shadow-[0_0_0_3px_rgba(150,95,33,0.1)]"/>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-1.5 mb-4">
                  <label className="text-[11px] font-medium uppercase tracking-widest text-[#5c4a2a] dark:text-gray-300">{t.contact_subject}</label>
                  <select value={form.subject} onChange={e=>handleChange("subject",e.target.value)}
                    className="h-11 px-4 rounded-xl text-[14px] outline-none transition-all cursor-pointer bg-[#faf7f2] dark:bg-gray-700 text-[#1a1208] dark:text-gray-100 border border-[rgba(150,95,33,0.25)] focus:border-[rgba(150,95,33,1)]">
                    {SUBJECTS.map(s=><option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5 mb-4">
                  <label className="text-[11px] font-medium uppercase tracking-widest text-[#5c4a2a] dark:text-gray-300">{t.contact_message}</label>
                  <textarea value={form.message} onChange={e=>handleChange("message",e.target.value)}
                    placeholder="Describe tu consulta..." rows={5}
                    className="px-4 py-3 rounded-xl text-[14px] outline-none transition-all resize-none bg-[#faf7f2] dark:bg-gray-700 text-[#1a1208] dark:text-gray-100 border border-[rgba(150,95,33,0.25)] focus:border-[rgba(150,95,33,1)]"/>
                </div>

                {error&&<p className="text-[12px] mb-3 text-[#b43232]">⚠️ {error}</p>}

                <button type="submit" disabled={loading}
                  className="w-full h-12 flex items-center justify-center gap-2 rounded-xl text-[15px] font-medium transition-all text-white border-none cursor-pointer"
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