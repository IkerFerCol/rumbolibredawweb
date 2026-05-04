import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import { useSettings } from "../context/SettingsContext";

const CITY_FACTS = {
  "Madrid":    { emoji:"🏛", bg:"linear-gradient(135deg,#e8d5b0 0%,#c9a96e 100%)", tags:["Arte","Gastronomía","Cultura"],      fact:"Madrid alberga el restaurante más antiguo del mundo, Sobrino de Botín, abierto desde 1725.", museums:"Más de 40", airports:1, temp:"15°C", currency:"Euro" },
  "Barcelona": { emoji:"🏖", bg:"linear-gradient(135deg,#d4c5a9 0%,#a08060 100%)", tags:["Playa","Arquitectura","Gastronomía"], fact:"La Sagrada Familia lleva en construcción desde 1882 y se espera terminar en 2026.",               museums:"Más de 50", airports:1, temp:"18°C", currency:"Euro" },
  "Palma":     { emoji:"🌴", bg:"linear-gradient(135deg,#c8d8b0 0%,#7a9e5a 100%)", tags:["Playa","Naturaleza","Historia"],      fact:"La Catedral de Mallorca tiene el rosetón gótico más grande del mundo, con 13 metros.",          museums:"Más de 20", airports:1, temp:"20°C", currency:"Euro" },
  "Málaga":    { emoji:"☀",  bg:"linear-gradient(135deg,#e2c9a0 0%,#b8935a 100%)", tags:["Playa","Arte","Gastronomía"],          fact:"Picasso nació en Málaga en 1881. Su casa natal se ha convertido en un museo.",                    museums:"Más de 30", airports:1, temp:"19°C", currency:"Euro" },
  "Valencia":  { emoji:"🌊", bg:"linear-gradient(135deg,#ccd5ae 0%,#8fa06a 100%)", tags:["Cultura","Playa","Diseño"],            fact:"La Ciudad de las Artes y las Ciencias es uno de los complejos culturales más grandes de Europa.",  museums:"Más de 25", airports:1, temp:"18°C", currency:"Euro" },
  "Sevilla":   { emoji:"💃", bg:"linear-gradient(135deg,#e8d0a8 0%,#c09858 100%)", tags:["Flamenco","Historia","Gastronomía"],   fact:"La Giralda fue construida originalmente como minarete de una mezquita almohade en el siglo XII.",  museums:"Más de 30", airports:1, temp:"20°C", currency:"Euro" },
  "Bilbao":    { emoji:"🏗", bg:"linear-gradient(135deg,#b5c4b1 0%,#7a9e7e 100%)", tags:["Arte","Gastronomía","Diseño"],          fact:"El Museo Guggenheim de Bilbao, inaugurado en 1997, transformó completamente la ciudad.",           museums:"Más de 15", airports:1, temp:"14°C", currency:"Euro" },
  "Alicante":  { emoji:"🏰", bg:"linear-gradient(135deg,#d4b896 0%,#a07850 100%)", tags:["Playa","Historia","Gastronomía"],      fact:"El Castillo de Santa Bárbara data del siglo IX y ofrece vistas panorámicas de toda la bahía.",    museums:"Más de 10", airports:1, temp:"19°C", currency:"Euro" },
};

const DEFAULT = { emoji:"✈", bg:"linear-gradient(135deg,#e8d5b0 0%,#c9a96e 100%)", tags:["Turismo","Cultura","Gastronomía"], fact:"Ciudad con rica historia y cultura.", museums:"Varios", airports:1, temp:"15°C", currency:"Euro" };

function Spinner() {
  return <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-[rgba(150,95,33,0.2)] border-t-[#965f21] mb-4"/>;
}

function CityCard({ city }) {
  const { t } = useSettings();
  const d = CITY_FACTS[city.ciudad]||DEFAULT;
  return (
    <div className="relative cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 bg-white dark:bg-gray-800"
      style={{ border:"0.5px solid rgba(150,95,33,0.18)", boxShadow:"0 2px 16px rgba(150,95,33,0.07)", minHeight:"340px" }}
      onMouseEnter={e=>{ e.currentTarget.style.boxShadow="0 8px 32px rgba(150,95,33,0.18)"; e.currentTarget.style.transform="translateY(-4px)"; }}
      onMouseLeave={e=>{ e.currentTarget.style.boxShadow="0 2px 16px rgba(150,95,33,0.07)"; e.currentTarget.style.transform="translateY(0)"; }}>
      <div className="h-36 flex items-center justify-center relative" style={{ background:d.bg }}>
        <span className="text-6xl drop-shadow-md">{d.emoji}</span>
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-medium" style={{ background:"rgba(0,0,0,0.35)", color:"rgba(255,249,242,1)", backdropFilter:"blur(6px)" }}>{city.codigoIata}</div>
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-medium"  style={{ background:"rgba(0,0,0,0.35)", color:"rgba(255,249,242,1)", backdropFilter:"blur(6px)" }}>{d.temp}</div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h3 className="text-[18px] font-semibold text-[#1a1208] dark:text-gray-100" style={{ fontFamily:"'Playfair Display', serif" }}>{city.ciudad}</h3>
            <p className="text-[12px] text-[#9c8060]">{city.pais}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-[#9c8060]">{t.cities_currency}</p>
            <p className="text-[12px] font-medium text-[#5c4a2a]">{d.currency}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-3 mt-2">
          {d.tags.map(tag=>(
            <span key={tag} className="px-2.5 py-0.5 rounded-full text-[11px] font-medium"
              style={{ background:"rgba(150,95,33,0.1)", color:"rgba(110,68,18,1)", border:"0.5px solid rgba(150,95,33,0.2)" }}>{tag}</span>
          ))}
        </div>
        <p className="text-[12px] leading-relaxed mb-4 text-[#5c4a2a]" style={{ borderLeft:"2px solid rgba(150,95,33,0.35)", paddingLeft:"10px" }}>{d.fact}</p>
        <div className="grid grid-cols-3 gap-2 pt-3" style={{ borderTop:"0.5px solid rgba(150,95,33,0.12)" }}>
          {[
            { label:t.cities_name,     val:city.nombre?.split(" ").slice(0,2).join(" ")||city.ciudad },
            { label:t.cities_museums,  val:d.museums },
            { label:t.cities_airports, val:d.airports },
          ].map(s=>(
            <div key={s.label} className="text-center">
              <div className="text-[15px] font-bold text-[#965f21]">{s.val}</div>
              <div className="text-[10px] text-[#9c8060]">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CiudadesPage() {
  const { t } = useSettings();
  const [ciudades, setCiudades] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [search,   setSearch]   = useState("");

  useEffect(() => {
    (async()=>{
      setLoading(true);
      try { const r=await axios.get("http://localhost:8080/api/aeropuertos"); if(r.data?.length) setCiudades(r.data); }
      catch { setError("No se pudieron cargar los destinos."); }
      finally { setLoading(false); }
    })();
  },[]);

  const filtered = ciudades.filter(c=>
    c.ciudad?.toLowerCase().includes(search.toLowerCase())||
    c.pais?.toLowerCase().includes(search.toLowerCase())||
    c.nombre?.toLowerCase().includes(search.toLowerCase())||
    c.codigoIata?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet"/>
      <div className="min-h-screen flex flex-col bg-[#fff9f2] dark:bg-gray-900 transition-colors duration-300" style={{ fontFamily:"'DM Sans', sans-serif" }}>
        <Header/>
        <div className="py-14 px-6 text-center" style={{ background:"linear-gradient(135deg,rgba(150,95,33,0.12) 0%,rgba(200,160,100,0.08) 100%)", borderBottom:"0.5px solid rgba(150,95,33,0.12)" }}>
          <h1 className="text-[34px] font-semibold mb-2 text-[#1a1208] dark:text-gray-100" style={{ fontFamily:"'Playfair Display', serif" }}>{t.cities_title}</h1>
          <p className="text-[15px] font-light mb-8 text-[#9c8060]">{t.cities_sub}</p>
          <div className="flex justify-center">
            <div className="relative w-full max-w-md">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg" style={{ color:"rgba(150,95,33,0.5)" }}>🔍</span>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t.cities_search}
                className="w-full h-12 pl-11 pr-4 rounded-xl text-[14px] outline-none transition-all bg-[#faf7f2] dark:bg-gray-700 text-[#1a1208] dark:text-gray-100 border border-[rgba(150,95,33,0.3)]"
                style={{ boxShadow:"0 2px 12px rgba(150,95,33,0.08)" }}
                onFocus={e=>{e.target.style.borderColor="rgba(150,95,33,1)";e.target.style.boxShadow="0 0 0 3px rgba(150,95,33,0.1)";}}
                onBlur={e=>{e.target.style.borderColor="rgba(150,95,33,0.3)";e.target.style.boxShadow="0 2px 12px rgba(150,95,33,0.08)";}}/>
            </div>
          </div>
          {!loading&&!error&&(
            <p className="text-[12px] mt-3 text-[#9c8060]">
              {filtered.length} {filtered.length!==1?t.cities_count_p:t.cities_count} {filtered.length!==1?t.cities_avail_p:t.cities_avail}
            </p>
          )}
        </div>
        <div className="flex-grow px-6 py-10 max-w-7xl mx-auto w-full">
          {loading&&<div className="text-center py-20"><Spinner/><p className="mt-3 text-[#9c8060]">{t.cities_loading}</p></div>}
          {!loading&&error&&(
            <div className="text-center py-20">
              <span className="text-5xl mb-4 block">🌍</span>
              <p className="text-[16px] font-medium mb-1 text-[#b43232]">{error}</p>
              <button onClick={()=>window.location.reload()}
                className="mt-4 px-5 py-2 rounded-lg text-[13px] font-medium border-none cursor-pointer text-white"
                style={{ background:"rgba(150,95,33,1)" }}>{t.cities_retry}</button>
            </div>
          )}
          {!loading&&!error&&filtered.length===0&&(
            <div className="text-center py-20">
              <span className="text-5xl mb-4 block">🔍</span>
              <p className="text-[16px] font-medium mb-1 text-[#5c4a2a]">{t.cities_empty}</p>
              <p className="text-[13px] text-[#9c8060]">{t.cities_empty_s}</p>
            </div>
          )}
          {!loading&&!error&&filtered.length>0&&(
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map(city=><CityCard key={city.id} city={city}/>)}
            </div>
          )}
        </div>
        <Footer/>
      </div>
    </>
  );
}