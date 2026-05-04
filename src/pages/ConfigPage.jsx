import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { useSettings } from "../context/SettingsContext";
import api from "../services/api";

const UserIcon     = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>;
const LockIcon     = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const ThemeIcon    = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"/><circle cx="12" cy="12" r="4"/></svg>;
const CurrencyIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
const LanguageIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
const SaveIcon     = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>;
const MailIcon     = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="m2 7 10 7 10-7"/></svg>;

const EyeIcon = ({ open }) => open ? (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
) : (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const Toast = ({ message, type="success", visible }) => (
  <div className="fixed top-4 left-1/2 z-50 px-5 py-2.5 rounded-xl text-[13px] font-medium whitespace-nowrap transition-all duration-300"
    style={{ transform:`translateX(-50%) translateY(${visible?"0":"-80px"})`, background:type==="success"?"rgba(74,140,63,1)":"rgba(226,80,58,1)", color:"white", boxShadow:"0 4px 20px rgba(0,0,0,0.2)", fontFamily:"'DM Sans', sans-serif" }}>
    {message}
  </div>
);

const ConfigSection = ({ icon, title, description, children }) => (
  <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
    className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 border border-[rgba(150,95,33,0.12)] dark:border-gray-700 shadow-sm transition-colors duration-300">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[rgba(150,95,33,0.08)] text-[#965f21]">{icon}</div>
      <div>
        <h3 className="font-semibold text-[15px] text-[#1a1208] dark:text-gray-100">{title}</h3>
        <p className="text-xs text-[#9c8060]">{description}</p>
      </div>
    </div>
    {children}
  </motion.div>
);

const InputField = ({ label, id, type="text", placeholder, value, onChange, icon, rightElement, disabled }) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-[11px] font-medium uppercase tracking-widest text-[#5c4a2a] dark:text-gray-400">{label}</label>
    <div className="relative flex items-center">
      {icon&&<span className="absolute left-3 pointer-events-none text-[rgba(150,95,33,0.55)]">{icon}</span>}
      <input id={id} type={type} placeholder={placeholder} value={value} onChange={onChange} disabled={disabled}
        className="w-full h-11 pl-9 pr-10 text-sm rounded-xl border outline-none transition-all disabled:opacity-50 bg-[#faf7f2] dark:bg-gray-700 border-[rgba(150,95,33,0.25)] dark:border-gray-600 text-[#1a1208] dark:text-gray-100 focus:border-[#965f21] focus:shadow-[0_0_0_3px_rgba(150,95,33,0.1)]"
        style={{ fontFamily:"'DM Sans', sans-serif" }}/>
      {rightElement&&<div className="absolute right-2">{rightElement}</div>}
    </div>
  </div>
);

const SelectField = ({ label, id, value, onChange, options, icon }) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-[11px] font-medium uppercase tracking-widest text-[#5c4a2a] dark:text-gray-400">{label}</label>
    <div className="relative flex items-center">
      {icon&&<span className="absolute left-3 pointer-events-none z-10 text-[rgba(150,95,33,0.55)]">{icon}</span>}
      <select id={id} value={value} onChange={onChange}
        className="w-full h-11 pl-9 pr-8 text-sm rounded-xl border outline-none cursor-pointer appearance-none bg-[#faf7f2] dark:bg-gray-700 border-[rgba(150,95,33,0.25)] dark:border-gray-600 text-[#1a1208] dark:text-gray-100 focus:border-[#965f21]"
        style={{ fontFamily:"'DM Sans', sans-serif" }}>
        {options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <span className="absolute right-3 pointer-events-none text-[rgba(150,95,33,0.55)] text-[10px]">▼</span>
    </div>
  </div>
);

export default function ConfiguracionPage() {
  const { t, preferences, updatePreference } = useSettings();
  const [toast,   setToast]   = useState({ message:"", type:"success", visible:false });
  const [saving,  setSaving]  = useState(false);

  const user = (()=>{ try{return JSON.parse(localStorage.getItem("rl_user"));}catch{return null;} })();

  const [profileData,   setProfileData]   = useState({ nombre:"", apellidos:"", email:"" });
  const [passwordData,  setPasswordData]  = useState({ currentPassword:"", newPassword:"", confirmPassword:"" });
  const [showCurr,      setShowCurr]      = useState(false);
  const [showNew,       setShowNew]       = useState(false);

  useEffect(()=>{ if(user) setProfileData({ nombre:user.nombre||"", apellidos:user.apellidos||"", email:user.email||"" }); },[]);

  function showToast(msg,type="success"){ setToast({message:msg,type,visible:true}); setTimeout(()=>setToast({message:"",type:"success",visible:false}),2800); }

  async function handleSaveProfile(){
    if(!profileData.nombre.trim()){ showToast(t.config_name+" es obligatorio","error"); return; }
    setSaving(true);
    try{
      await api.put(`/usuarios/${user.id}`,{ nombre:profileData.nombre.trim(), apellidos:profileData.apellidos.trim(), email:profileData.email.trim(), telefono:user?.telefono||"", rol:user?.rol||"USER" });
      const updated={...user,nombre:profileData.nombre.trim(),apellidos:profileData.apellidos.trim()};
      localStorage.setItem("rl_user",JSON.stringify(updated));
      showToast(t.config_save+" ✅");
    }catch(e){ showToast(e.response?.data?.mensaje||"Error","error"); }
    finally{ setSaving(false); }
  }

  async function handleChangePassword(){
    if(!passwordData.newPassword){ showToast("Ingresa la nueva contraseña","error"); return; }
    if(passwordData.newPassword.length<6){ showToast("Mínimo 6 caracteres","error"); return; }
    if(passwordData.newPassword!==passwordData.confirmPassword){ showToast("Las contraseñas no coinciden","error"); return; }
    setSaving(true);
    try{
      await api.put(`/usuarios/${user.id}`,{ nombre:user.nombre, apellidos:user.apellidos||"", email:user.email, telefono:user.telefono||"", password:passwordData.newPassword, rol:user.rol||"USER" });
      setPasswordData({currentPassword:"",newPassword:"",confirmPassword:""});
      showToast(t.config_change+" ✅");
    }catch(e){ showToast(e.response?.data?.mensaje||"Error","error"); }
    finally{ setSaving(false); }
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet"/>
      <div className="min-h-screen flex flex-col bg-[#fff9f2] dark:bg-gray-900 transition-colors duration-300" style={{ fontFamily:"'DM Sans', sans-serif" }}>
        <Header/>
        <Toast message={toast.message} type={toast.type} visible={toast.visible}/>

        <main className="flex-grow max-w-3xl mx-auto px-4 py-8 w-full">
          <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-[#1a1208] dark:text-white" style={{ fontFamily:"'Playfair Display', serif" }}>{t.config_title}</h1>
            <p className="text-sm text-[#9c8060]">{t.config_sub}</p>
          </motion.div>

          {/* Perfil */}
          <ConfigSection icon={<UserIcon/>} title={t.config_profile} description={t.config_prof_sub}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <InputField label={t.config_name}     id="cfg-name"     placeholder="Tu nombre"    value={profileData.nombre}    onChange={e=>setProfileData(p=>({...p,nombre:e.target.value}))}    icon={<UserIcon/>}/>
              <InputField label={t.config_lastname} id="cfg-lastname" placeholder="Tus apellidos" value={profileData.apellidos} onChange={e=>setProfileData(p=>({...p,apellidos:e.target.value}))} icon={<UserIcon/>}/>
            </div>
            <InputField label={t.config_email} id="cfg-email" type="email" placeholder="tu@email.com" value={profileData.email} disabled icon={<MailIcon/>}/>
            <button onClick={handleSaveProfile} disabled={saving}
              className="mt-4 w-full md:w-auto px-6 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-white border-none cursor-pointer"
              style={{ background:"rgba(150,95,33,1)" }}
              onMouseEnter={e=>(e.currentTarget.style.background="rgba(110,68,18,1)")}
              onMouseLeave={e=>(e.currentTarget.style.background="rgba(150,95,33,1)")}>
              <SaveIcon/> {saving?t.config_saving:t.config_save}
            </button>
          </ConfigSection>

          {/* Contraseña */}
          <ConfigSection icon={<LockIcon/>} title={t.config_pass} description={t.config_pass_sub}>
            <div className="grid grid-cols-1 gap-4">
              <InputField label={t.config_cur_pass} id="cur-pass" type={showCurr?"text":"password"} placeholder="••••••••" value={passwordData.currentPassword} onChange={e=>setPasswordData(p=>({...p,currentPassword:e.target.value}))} icon={<LockIcon/>}
                rightElement={<button onClick={()=>setShowCurr(p=>!p)} className="p-1 opacity-50 hover:opacity-100 bg-transparent border-none cursor-pointer text-[#5c4a2a]"><EyeIcon open={showCurr}/></button>}/>
              <InputField label={t.config_new_pass} id="new-pass" type={showNew?"text":"password"} placeholder="Mínimo 6 caracteres" value={passwordData.newPassword} onChange={e=>setPasswordData(p=>({...p,newPassword:e.target.value}))} icon={<LockIcon/>}
                rightElement={<button onClick={()=>setShowNew(p=>!p)} className="p-1 opacity-50 hover:opacity-100 bg-transparent border-none cursor-pointer text-[#5c4a2a]"><EyeIcon open={showNew}/></button>}/>
              <InputField label={t.config_rep_pass} id="rep-pass" type="password" placeholder="Repite la nueva contraseña" value={passwordData.confirmPassword} onChange={e=>setPasswordData(p=>({...p,confirmPassword:e.target.value}))} icon={<LockIcon/>}/>
            </div>
            <button onClick={handleChangePassword} disabled={saving}
              className="mt-4 w-full md:w-auto px-6 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-white border-none cursor-pointer"
              style={{ background:"rgba(150,95,33,1)" }}
              onMouseEnter={e=>(e.currentTarget.style.background="rgba(110,68,18,1)")}
              onMouseLeave={e=>(e.currentTarget.style.background="rgba(150,95,33,1)")}>
              <LockIcon/> {saving?t.config_changing:t.config_change}
            </button>
          </ConfigSection>

          {/* Preferencias */}
          <ConfigSection icon={<ThemeIcon/>} title={t.config_pref} description={t.config_pref_sub}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectField label={t.config_theme} id="theme-sel" icon={<ThemeIcon/>}
                value={preferences.theme} onChange={e=>updatePreference("theme",e.target.value)}
                options={[{value:"light",label:t.config_theme_l},{value:"dark",label:t.config_theme_d}]}/>
              <SelectField label={t.config_currency} id="cur-sel" icon={<CurrencyIcon/>}
                value={preferences.currency} onChange={e=>updatePreference("currency",e.target.value)}
                options={[{value:"EUR",label:"€ Euro (EUR)"},{value:"GBP",label:"£ Libra (GBP)"},{value:"USD",label:"$ Dólar (USD)"}]}/>
              <SelectField label={t.config_language} id="lang-sel" icon={<LanguageIcon/>}
                value={preferences.language} onChange={e=>updatePreference("language",e.target.value)}
                options={[{value:"es",label:"🇪🇸 Español"},{value:"en",label:"🇬🇧 English"}]}/>
            </div>
            <p className="mt-4 text-xs text-[#9c8060] flex items-center gap-1">{t.config_auto}</p>
          </ConfigSection>

          {/* Info cuenta */}
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.3}}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm mb-8 border border-[rgba(150,95,33,0.12)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[rgba(150,95,33,0.08)] text-[#965f21]"><UserIcon/></div>
              <h3 className="font-semibold text-[15px] text-[#1a1208] dark:text-gray-100">{t.config_account}</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-xs uppercase tracking-wider text-[#9c8060]">{t.config_role}</p><p className="font-medium text-[#1a1208] dark:text-gray-100">{user?.rol||"Usuario"}</p></div>
              <div><p className="text-xs uppercase tracking-wider text-[#9c8060]">{t.config_userid}</p><p className="font-medium text-[#1a1208] dark:text-gray-100">#{user?.id||"—"}</p></div>
              <div className="col-span-2"><p className="text-xs uppercase tracking-wider text-[#9c8060]">{t.config_email}</p><p className="font-medium text-[#1a1208] dark:text-gray-100">{user?.email||"—"}</p></div>
            </div>
          </motion.div>
        </main>
        <Footer/>
      </div>
    </>
  );
}