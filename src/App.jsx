import { useState, useEffect, useCallback } from "react";
import { supabase } from "./lib/supabase";

const USUARIO = "Jefe de Máquinas";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --navy:#213363;--blue:#235C96;--mid:#6381A7;--light:#A5B5CC;
  --bg:#F0F4F8;--surface:#FFF;--surface2:#F5F7FA;--border:#D6E0ED;
  --text:#213363;--muted:#6381A7;--muted2:#8FA3BC;--accent:#235C96;--accent2:#1E7E4A;
  --warn:#B07D0A;--danger:#C0392B;
  --sans:'Montserrat',sans-serif;--mono:'DM Mono',monospace;--r:6px;--r2:10px;
}
body{background:var(--bg);color:var(--text);font-family:var(--sans);font-size:14px;line-height:1.5;min-height:100vh}
.app{display:flex;min-height:100vh}
.sidebar{width:235px;min-width:235px;background:var(--navy);display:flex;flex-direction:column;box-shadow:2px 0 8px rgba(33,51,99,.15)}
.sidebar-header{border-bottom:1px solid rgba(255,255,255,.1)}
.sidebar-logo-wrap{padding:20px 18px 16px;display:flex;align-items:center;gap:12px}
.sidebar-logo{width:36px;height:36px;background:rgba(255,255,255,.15);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:18px}
.sidebar-logo-main{font-size:13px;font-weight:700;color:#fff;letter-spacing:2px;text-transform:uppercase}
.sidebar-logo-sub{font-size:9px;color:rgba(255,255,255,.5);letter-spacing:.5px}
.nav-section{padding:12px 18px 4px;font-family:var(--mono);font-size:9px;letter-spacing:2px;color:rgba(255,255,255,.35);text-transform:uppercase}
.ni{display:flex;align-items:center;gap:9px;padding:7px 18px;font-size:12px;font-weight:500;cursor:pointer;color:rgba(255,255,255,.6);border-left:3px solid transparent;transition:all .12s;user-select:none}
.ni:hover{color:#fff;background:rgba(255,255,255,.06)}
.ni.active{color:#fff;border-left-color:var(--light);background:rgba(255,255,255,.1);font-weight:600}
.ni-icon{font-size:13px;width:16px;text-align:center;flex-shrink:0}
.ni-badge{margin-left:auto;background:var(--danger);color:#fff;font-family:var(--mono);font-size:9px;font-weight:700;padding:1px 6px;border-radius:10px;min-width:18px;text-align:center}
.main{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0}
.topbar{background:var(--surface);border-bottom:1px solid var(--border);padding:13px 28px;display:flex;align-items:center;justify-content:space-between;box-shadow:0 1px 3px rgba(33,51,99,.06)}
.topbar-title{font-size:12px;font-weight:600;letter-spacing:1px;color:var(--navy);text-transform:uppercase}
.content{flex:1;overflow-y:auto;padding:24px 28px;background:var(--bg)}
.card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r2);padding:20px;margin-bottom:16px;box-shadow:0 1px 4px rgba(33,51,99,.06)}
.card-title{font-size:10px;font-weight:600;letter-spacing:1.5px;color:var(--muted);text-transform:uppercase;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between}
.badge{display:inline-flex;align-items:center;font-family:var(--mono);font-size:9px;font-weight:600;padding:3px 8px;border-radius:4px;white-space:nowrap;letter-spacing:.3px}
.b-red{background:#FEE2E2;color:#991B1B;border:1px solid #FECACA}
.b-amber{background:#FEF3C7;color:#92400E;border:1px solid #FDE68A}
.b-green{background:#D1FAE5;color:#065F46;border:1px solid #A7F3D0}
.b-blue{background:#DBEAFE;color:#1E40AF;border:1px solid #BFDBFE}
.b-gray{background:#F3F4F6;color:#6B7280;border:1px solid #E5E7EB}
.b-purple{background:#EDE9FE;color:#4C1D95;border:1px solid #DDD6FE}
.btn{display:inline-flex;align-items:center;gap:6px;font-family:var(--sans);font-size:11px;font-weight:600;letter-spacing:.3px;padding:7px 14px;border-radius:var(--r);border:1px solid transparent;cursor:pointer;transition:all .15s;white-space:nowrap;text-transform:uppercase}
.btn-primary{background:var(--blue);color:#fff}.btn-primary:hover{background:var(--navy)}
.btn-danger{background:transparent;color:var(--danger);border-color:var(--danger)}.btn-danger:hover{background:#FEE2E2}
.btn-ghost{background:transparent;color:var(--muted);border-color:var(--border)}.btn-ghost:hover{color:var(--text);background:var(--surface2)}
.btn-success{background:var(--accent2);color:#fff}.btn-success:hover{background:#145E37}
.btn-sm{padding:4px 10px;font-size:10px}
.btn:disabled{opacity:.4;cursor:not-allowed}
.overlay{position:fixed;inset:0;background:rgba(33,51,99,.5);display:flex;align-items:flex-start;justify-content:center;z-index:100;padding:20px;overflow-y:auto;animation:fadeIn .15s}
.modal{background:var(--surface);border:1px solid var(--border);border-radius:12px;width:100%;max-width:720px;margin:auto;animation:slideUp .2s;box-shadow:0 8px 32px rgba(33,51,99,.18)}
.mhdr{display:flex;justify-content:space-between;align-items:flex-start;padding:18px 22px;border-bottom:1px solid var(--border);background:var(--surface2);border-radius:12px 12px 0 0}
.mtitle{font-size:13px;font-weight:700;letter-spacing:.5px;color:var(--navy)}
.mbody{padding:22px}
.mftr{padding:14px 22px;border-top:1px solid var(--border);display:flex;justify-content:flex-end;gap:8px;background:var(--surface2);border-radius:0 0 12px 12px}
.mclose{background:none;border:none;color:var(--muted);font-size:20px;cursor:pointer}
.mclose:hover{color:var(--navy)}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideUp{from{transform:translateY(14px);opacity:0}to{transform:translateY(0);opacity:1}}
.fg{display:flex;flex-direction:column;gap:5px}
.fg label{font-size:10px;color:var(--navy);letter-spacing:.5px;text-transform:uppercase;font-weight:600}
.fg input,.fg select,.fg textarea{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);color:var(--text);font-family:var(--sans);font-size:13px;padding:8px 10px;outline:none;transition:border-color .15s}
.fg input:focus,.fg select:focus,.fg textarea:focus{border-color:var(--blue)}
.fg textarea{resize:vertical;min-height:65px}
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px}
.form-grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-bottom:14px}
.form-section{font-size:10px;font-weight:700;letter-spacing:1.5px;color:var(--blue);text-transform:uppercase;margin:18px 0 12px;padding-bottom:6px;border-bottom:2px solid var(--light)}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:18px}
.stat{background:var(--surface);border:1px solid var(--border);border-radius:var(--r2);padding:16px 18px}
.stat-label{font-size:10px;color:var(--muted);font-weight:600;letter-spacing:.5px;margin-bottom:6px;text-transform:uppercase}
.stat-value{font-family:var(--mono);font-size:28px;font-weight:600}
.table-wrap{overflow-x:auto}
table{width:100%;border-collapse:collapse;font-size:12px}
th{font-size:10px;font-weight:600;letter-spacing:.5px;color:var(--muted);text-transform:uppercase;padding:9px 12px;text-align:left;border-bottom:2px solid var(--border);background:var(--surface2)}
td{padding:11px 12px;border-bottom:1px solid var(--border);vertical-align:middle}
tr:last-child td{border-bottom:none}
tr.click:hover td{background:var(--surface2);cursor:pointer}
.filter-row{display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap;align-items:center}
.filter-select{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);color:var(--text);font-family:var(--sans);font-size:11px;padding:6px 10px;outline:none;cursor:pointer}
.filter-input{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);color:var(--text);font-family:var(--sans);font-size:11px;padding:6px 10px;outline:none;min-width:180px}
.alerta-row{background:var(--surface);border:1px solid var(--border);border-radius:var(--r2);padding:14px 16px;margin-bottom:8px;transition:all .15s}
.alerta-row.vencida{border-left:4px solid var(--danger)}
.alerta-row.proxima{border-left:4px solid var(--warn)}
.alerta-row.ok{border-left:4px solid var(--accent2)}
.pct-bar{height:5px;background:var(--surface2);border-radius:3px;overflow:hidden;border:1px solid var(--border);margin-top:6px}
.pct-fill{height:100%;border-radius:3px;transition:width .3s}
.pct-fill.danger{background:var(--danger)}
.pct-fill.warn{background:var(--warn)}
.pct-fill.ok{background:var(--accent2)}
.hs-input{width:100%;background:var(--surface);border:1px solid var(--border);border-radius:var(--r);color:var(--text);font-family:var(--mono);font-size:13px;padding:8px 10px;outline:none;text-align:right}
.hs-input:focus{border-color:var(--blue)}
.flex-gap{display:flex;gap:8px;align-items:center}
.flex-between{display:flex;justify-content:space-between;align-items:center}
.mt8{margin-top:8px}.mt12{margin-top:12px}.mt16{margin-top:16px}
.mb8{margin-bottom:8px}.mb12{margin-bottom:12px}
.text-mono{font-family:var(--mono)}.text-muted{color:var(--muted)}
.empty-state{text-align:center;padding:48px 20px;color:var(--muted);font-size:13px}
.loading{display:flex;align-items:center;justify-content:center;padding:48px;color:var(--muted);gap:10px;font-size:13px}
.spin{animation:spin 1s linear infinite}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
.notif{position:fixed;bottom:20px;right:20px;background:var(--surface);border:1px solid var(--border);border-left-width:3px;border-radius:var(--r2);padding:12px 16px;font-size:13px;animation:slideUp .2s;z-index:300;max-width:340px;display:flex;align-items:center;gap:10px;box-shadow:0 4px 16px rgba(33,51,99,.15)}
.n-green{border-left-color:var(--accent2)}.n-red{border-left-color:var(--danger)}.n-amber{border-left-color:var(--warn)}.n-blue{border-left-color:var(--blue)}
.info-box{background:var(--surface2);border:1px solid var(--border);border-radius:var(--r);padding:12px 14px;font-size:13px}
.info-box.warn{border-left:3px solid var(--warn);background:#FFFBEB}
.info-box.danger{border-left:3px solid var(--danger);background:#FEF2F2}
.info-box.accent{border-left:3px solid var(--blue)}
.tabs-row{display:flex;border-bottom:2px solid var(--border);margin-bottom:18px;overflow-x:auto}
.tab{font-size:11px;font-weight:600;padding:9px 16px;cursor:pointer;color:var(--muted);border-bottom:2px solid transparent;transition:all .12s;text-transform:uppercase;letter-spacing:.5px;margin-bottom:-2px;white-space:nowrap}
.tab.active{color:var(--blue);border-bottom-color:var(--blue)}
.forecast-bar{height:8px;background:var(--surface2);border-radius:4px;overflow:hidden;border:1px solid var(--border);margin-top:4px;position:relative}
.forecast-fill{height:100%;border-radius:4px;transition:width .3s}
.forecast-marker{position:absolute;top:-2px;width:2px;height:12px;background:var(--navy);border-radius:1px}
`;

const fmtDate = d => d ? new Date(d + "T00:00:00").toLocaleDateString("es-AR") : "—";
const today = () => new Date().toISOString().split("T")[0];
const addDays = (date, days) => { const d = new Date(date); d.setDate(d.getDate() + days); return d.toISOString().split("T")[0]; };

const api = {
  async getBuques() {
    const { data, error } = await supabase.from("mant_buques").select("*").eq("activo", true).order("nombre");
    if (error) throw error; return data || [];
  },
  async getEquipos(buqueId) {
    const { data, error } = await supabase.from("mant_equipos").select("*").eq("buque_id", buqueId).eq("activo", true).order("sector").order("nombre");
    if (error) throw error; return data || [];
  },
  async getTareas(buqueId) {
    const { data, error } = await supabase
      .from("mant_tareas")
      .select("*, mant_equipos!inner(id, nombre, codigo, sistema, sector, marca, modelo, nro_serie, buque_id)")
      .eq("mant_equipos.buque_id", buqueId)
      .order("codigo");
    if (error) throw error; return data || [];
  },
  async getRegistrosHoras(buqueId) {
    const { data, error } = await supabase
      .from("mant_registros_horas")
      .select("*, mant_equipos(nombre)")
      .eq("buque_id", buqueId)
      .order("fecha", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) throw error; return data || [];
  },
  async getUltimasHoras(buqueId) {
    const data = await api.getRegistrosHoras(buqueId);
    const map = {};
    data.forEach(h => { if (!map[h.equipo_id]) map[h.equipo_id] = h.horas; });
    return map;
  },
  async getPromedioHorasDiarias(buqueId, equipoId) {
    const { data, error } = await supabase
      .from("mant_registros_horas")
      .select("horas, fecha")
      .eq("buque_id", buqueId)
      .eq("equipo_id", equipoId)
      .order("fecha", { ascending: false })
      .limit(30);
    if (error || !data || data.length < 2) return null;
    const sorted = [...data].sort((a, b) => a.fecha > b.fecha ? 1 : -1);
    const first = sorted[0]; const last = sorted[sorted.length - 1];
    const dias = Math.max(1, (new Date(last.fecha) - new Date(first.fecha)) / 86400000);
    const hsGanadas = last.horas - first.horas;
    return hsGanadas > 0 ? Math.round(hsGanadas / dias * 10) / 10 : null;
  },
  async registrarHoras(registros) {
    const { error } = await supabase.from("mant_registros_horas").insert(registros);
    if (error) throw error;
  },
  async getEjecuciones(buqueId) {
    const { data, error } = await supabase
      .from("mant_ejecuciones")
      .select("*, mant_tareas(descripcion, frecuencia_hs, mant_equipos(nombre))")
      .eq("buque_id", buqueId)
      .order("fecha", { ascending: false });
    if (error) throw error; return data || [];
  },
  async registrarEjecucion(ej) {
    const { error } = await supabase.from("mant_ejecuciones").insert([ej]);
    if (error) throw error;
  },
  async getCorrectivos(buqueId) {
    const { data, error } = await supabase
      .from("mant_correctivos")
      .select("*, mant_equipos(nombre, codigo)")
      .eq("buque_id", buqueId)
      .order("created_at", { ascending: false });
    if (error) throw error; return data || [];
  },
  async crearCorrectivo(c) { const { error } = await supabase.from("mant_correctivos").insert([c]); if (error) throw error; },
  async actualizarCorrectivo(id, c) { const { error } = await supabase.from("mant_correctivos").update(c).eq("id", id); if (error) throw error; },
  async crearEquipo(eq) { const { data, error } = await supabase.from("mant_equipos").insert([eq]).select().single(); if (error) throw error; return data; },
  async crearTarea(t) { const { data, error } = await supabase.from("mant_tareas").insert([t]).select().single(); if (error) throw error; return data; },
  async actualizarTarea(id, c) { const { error } = await supabase.from("mant_tareas").update(c).eq("id", id); if (error) throw error; },
  async subirAdjunto(file, ejecucionId) {
    const path = `riesgo/${ejecucionId}/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from("mantenimiento").upload(path, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from("mantenimiento").getPublicUrl(path);
    return data.publicUrl;
  },
};

function calcEstado(tarea, horasActuales) {
  if (!tarea.frecuencia_hs || !horasActuales) return { estado: "sin_datos", restante: null, pct: 0 };
  const ultima = tarea.ultima_ejecucion_hs || 0;
  const proxima = ultima + tarea.frecuencia_hs;
  const restante = proxima - horasActuales;
  const pct = Math.min(((horasActuales - ultima) / tarea.frecuencia_hs) * 100, 100);
  if (restante < 0) return { estado: "vencida", restante, pct: 100 };
  if (restante <= tarea.frecuencia_hs * 0.1) return { estado: "proxima", restante, pct };
  return { estado: "ok", restante, pct };
}

function calcForecastFecha(restanteHs, promedioHsDiarias) {
  if (!restanteHs || restanteHs <= 0 || !promedioHsDiarias || promedioHsDiarias <= 0) return null;
  const diasRestantes = Math.ceil(restanteHs / promedioHsDiarias);
  return addDays(today(), diasRestantes);
}

function Notif({ msg, onClose }) {
  if (!msg) return null;
  const cls = { success: "n-green", error: "n-red", warn: "n-amber", info: "n-blue" }[msg.type] || "n-blue";
  return <div className={`notif ${cls}`}><span>{msg.text}</span><button onClick={onClose} style={{ marginLeft: "auto", background: "none", border: "none", color: "var(--muted)", cursor: "pointer" }}>✕</button></div>;
}

function FG({ label, hint, children, full }) {
  return <div className="fg" style={full ? { gridColumn: "1/-1" } : {}}>
    {label && <label>{label}</label>}
    {children}
    {hint && <div style={{ fontSize: 10, color: "var(--muted2)", marginTop: 2 }}>{hint}</div>}
  </div>;
}

// ─── MODAL: EJECUCIÓN CON ADJUNTO ────────────────────────────────────────────
function EjecucionModal({ tarea, buqueId, horasActuales, horasVencimiento, onClose, onSave }) {
  const [form, setForm] = useState({
    tarea_id: tarea.id, buque_id: buqueId,
    fecha: today(), horas_equipo: horasActuales || "",
    realizado_por: "", observaciones: "",
    fue_fuera_termino: horasActuales > horasVencimiento,
    dias_fuera_termino: 0, adjunto_riesgo_url: "",
  });
  const [archivo, setArchivo] = useState(null);
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.realizado_por) return alert("Completá quién realizó el trabajo");
    setSaving(true);
    try {
      let adjunto_url = form.adjunto_riesgo_url;
      if (archivo) {
        const tempId = `temp_${Date.now()}`;
        adjunto_url = await api.subirAdjunto(archivo, tempId);
      }
      await api.registrarEjecucion({ ...form, adjunto_riesgo_url: adjunto_url });
      await api.actualizarTarea(tarea.id, {
        ultima_ejecucion_hs: parseInt(form.horas_equipo) || horasActuales,
        ultima_ejecucion_fecha: form.fecha,
      });
      onSave();
    } catch (e) { alert("Error: " + e.message); }
    finally { setSaving(false); }
  };

  const fueraTerm = parseInt(form.horas_equipo) > horasVencimiento;

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="mhdr">
          <div className="mtitle">Registrar ejecución</div>
          <button className="mclose" onClick={onClose}>✕</button>
        </div>
        <div className="mbody">
          <div className="info-box mb12" style={{ fontSize: 12 }}>
            <strong>{tarea.descripcion}</strong><br />
            <span style={{ color: "var(--muted)", fontSize: 11 }}>{tarea.mant_equipos?.nombre} · Frec: {tarea.frecuencia_hs ? `${tarea.frecuencia_hs} hs` : tarea.frecuencia_texto}</span>
          </div>
          {fueraTerm && (
            <div className="info-box danger mb12" style={{ fontSize: 11 }}>
              ⚠ Ejecución fuera de término. Se registrará el atraso. Si corresponde, adjuntá la matriz de riesgo.
            </div>
          )}
          <div className="form-grid">
            <FG label="Fecha *"><input type="date" value={form.fecha} onChange={e => set("fecha", e.target.value)} /></FG>
            <FG label="Horas del equipo al momento"><input type="number" value={form.horas_equipo} onChange={e => set("horas_equipo", e.target.value)} /></FG>
            <FG label="Realizado por *" full><input value={form.realizado_por} onChange={e => set("realizado_por", e.target.value)} placeholder="Nombre del responsable" /></FG>
          </div>
          <FG label="Observaciones" full><textarea value={form.observaciones} onChange={e => set("observaciones", e.target.value)} placeholder="Notas del trabajo..." /></FG>
          {fueraTerm && <>
            <div className="form-section">Fuera de término</div>
            <div className="form-grid">
              <FG label="Días de atraso"><input type="number" min={0} value={form.dias_fuera_termino} onChange={e => set("dias_fuera_termino", parseInt(e.target.value) || 0)} /></FG>
              <FG label="Adjuntar matriz de riesgo (PDF)">
                <input type="file" accept=".pdf,.jpg,.png" onChange={e => setArchivo(e.target.files[0])} style={{ fontSize: 12, padding: "6px 0" }} />
              </FG>
            </div>
          </>}
        </div>
        <div className="mftr">
          <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? "Guardando..." : "Registrar"}</button>
        </div>
      </div>
    </div>
  );
}

// ─── MODAL: CORRECTIVO ────────────────────────────────────────────────────────
function CorrectivoModal({ buqueId, equipos, correctivo, onClose, onSave }) {
  const [form, setForm] = useState({
    buque_id: buqueId, equipo_id: "", titulo: "", descripcion: "",
    prioridad: "normal", status: "abierto", fecha_deteccion: today(),
    fecha_resolucion: "", resuelto_por: "",
    ...(correctivo || {}),
  });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.titulo) return alert("El título es obligatorio");
    setSaving(true);
    try {
      correctivo ? await api.actualizarCorrectivo(correctivo.id, form) : await api.crearCorrectivo(form);
      onSave();
    } catch (e) { alert("Error: " + e.message); }
    finally { setSaving(false); }
  };

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="mhdr">
          <div className="mtitle">{correctivo ? "Editar correctivo" : "Nuevo correctivo"}</div>
          <button className="mclose" onClick={onClose}>✕</button>
        </div>
        <div className="mbody">
          <div className="form-grid">
            <FG label="Título *" full><input value={form.titulo} onChange={e => set("titulo", e.target.value)} placeholder="Descripción corta de la falla" /></FG>
            <FG label="Equipo">
              <select value={form.equipo_id} onChange={e => set("equipo_id", e.target.value)}>
                <option value="">Sin asignar</option>
                {equipos.map(eq => <option key={eq.id} value={eq.id}>{eq.nombre}</option>)}
              </select>
            </FG>
            <FG label="Prioridad">
              <select value={form.prioridad} onChange={e => set("prioridad", e.target.value)}>
                <option value="baja">Baja</option><option value="normal">Normal</option>
                <option value="alta">Alta</option><option value="critica">Crítica</option>
              </select>
            </FG>
            <FG label="Status">
              <select value={form.status} onChange={e => set("status", e.target.value)}>
                <option value="abierto">Abierto</option><option value="en_proceso">En proceso</option><option value="resuelto">Resuelto</option>
              </select>
            </FG>
            <FG label="Fecha detección"><input type="date" value={form.fecha_deteccion} onChange={e => set("fecha_deteccion", e.target.value)} /></FG>
          </div>
          <FG label="Descripción" full><textarea value={form.descripcion} onChange={e => set("descripcion", e.target.value)} placeholder="Detalle de la falla..." /></FG>
          {form.status === "resuelto" && <div className="form-grid mt12">
            <FG label="Fecha resolución"><input type="date" value={form.fecha_resolucion} onChange={e => set("fecha_resolucion", e.target.value)} /></FG>
            <FG label="Resuelto por"><input value={form.resuelto_por} onChange={e => set("resuelto_por", e.target.value)} /></FG>
          </div>}
        </div>
        <div className="mftr">
          <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? "Guardando..." : "Guardar"}</button>
        </div>
      </div>
    </div>
  );
}

// ─── MODAL: TAREA ─────────────────────────────────────────────────────────────
function TareaModal({ buqueId, equipos, onClose, onSave }) {
  const [form, setForm] = useState({ equipo_id: "", codigo: "", descripcion: "", tipo_frecuencia: "horas", frecuencia_hs: "", frecuencia_texto: "", es_critica: false });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.equipo_id || !form.descripcion) return alert("Completá equipo y descripción");
    setSaving(true);
    try {
      await api.crearTarea({ ...form, frecuencia_hs: form.tipo_frecuencia === "horas" ? parseInt(form.frecuencia_hs) || null : null, frecuencia_texto: form.tipo_frecuencia !== "horas" ? form.frecuencia_texto : null });
      onSave();
    } catch (e) { alert("Error: " + e.message); }
    finally { setSaving(false); }
  };

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="mhdr"><div className="mtitle">Nueva tarea</div><button className="mclose" onClick={onClose}>✕</button></div>
        <div className="mbody">
          <div className="form-grid">
            <FG label="Equipo *">
              <select value={form.equipo_id} onChange={e => set("equipo_id", e.target.value)}>
                <option value="">Seleccionar...</option>
                {equipos.map(eq => <option key={eq.id} value={eq.id}>{eq.nombre}</option>)}
              </select>
            </FG>
            <FG label="Código"><input value={form.codigo} onChange={e => set("codigo", e.target.value)} placeholder="Ej: 10.01.09.01" /></FG>
            <FG label="Descripción *" full><input value={form.descripcion} onChange={e => set("descripcion", e.target.value)} placeholder="Ej: Cambio filtros de aceite" /></FG>
            <FG label="Tipo frecuencia">
              <select value={form.tipo_frecuencia} onChange={e => set("tipo_frecuencia", e.target.value)}>
                <option value="horas">Por horas</option><option value="tiempo">Por tiempo</option>
              </select>
            </FG>
            {form.tipo_frecuencia === "horas"
              ? <FG label="Frecuencia (hs)"><input type="number" value={form.frecuencia_hs} onChange={e => set("frecuencia_hs", e.target.value)} placeholder="Ej: 500" /></FG>
              : <FG label="Frecuencia (texto)"><input value={form.frecuencia_texto} onChange={e => set("frecuencia_texto", e.target.value)} placeholder="Ej: mensual" /></FG>
            }
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, cursor: "pointer" }}>
            <input type="checkbox" checked={form.es_critica} onChange={e => set("es_critica", e.target.checked)} style={{ accentColor: "var(--danger)" }} />
            <span>Marcar como crítica</span>
          </label>
        </div>
        <div className="mftr">
          <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? "Guardando..." : "Crear tarea"}</button>
        </div>
      </div>
    </div>
  );
}

// ─── MODAL: EQUIPO ────────────────────────────────────────────────────────────
function EquipoModal({ buqueId, onClose, onSave }) {
  const [form, setForm] = useState({ buque_id: buqueId, codigo: "", nombre: "", sistema: "", sector: "MAQ", marca: "", modelo: "", nro_serie: "", activo: true });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.nombre) return alert("El nombre es obligatorio");
    setSaving(true);
    try { await api.crearEquipo(form); onSave(); }
    catch (e) { alert("Error: " + e.message); }
    finally { setSaving(false); }
  };

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 560 }}>
        <div className="mhdr"><div className="mtitle">Nuevo equipo</div><button className="mclose" onClick={onClose}>✕</button></div>
        <div className="mbody">
          <div className="form-grid">
            <FG label="Sector">
              <select value={form.sector} onChange={e => set("sector", e.target.value)}>
                <option value="MAQ">Máquinas</option><option value="CUB">Cubierta</option><option value="PUENTE">Puente</option>
              </select>
            </FG>
            <FG label="Código"><input value={form.codigo} onChange={e => set("codigo", e.target.value)} placeholder="Ej: 10.01" /></FG>
            <FG label="Nombre *" full><input value={form.nombre} onChange={e => set("nombre", e.target.value)} placeholder="Ej: MMPP N°1 MAK 8M 453 AK" /></FG>
            <FG label="Marca"><input value={form.marca} onChange={e => set("marca", e.target.value)} /></FG>
            <FG label="Modelo"><input value={form.modelo} onChange={e => set("modelo", e.target.value)} /></FG>
            <FG label="N° de Serie"><input value={form.nro_serie} onChange={e => set("nro_serie", e.target.value)} /></FG>
            <FG label="Sistema"><input value={form.sistema} onChange={e => set("sistema", e.target.value)} placeholder="Ej: Propulsión" /></FG>
          </div>
        </div>
        <div className="mftr">
          <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? "Guardando..." : "Crear equipo"}</button>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE: DASHBOARD ──────────────────────────────────────────────────────────
function PageDashboard({ buque, notify }) {
  const [tareas, setTareas] = useState([]);
  const [horasMap, setHorasMap] = useState({});
  const [promedioMap, setPromedioMap] = useState({});
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalEj, setModalEj] = useState(null);
  const [filtro, setFiltro] = useState("todos");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [t, eq, hrs] = await Promise.all([api.getTareas(buque.id), api.getEquipos(buque.id), api.getUltimasHoras(buque.id)]);
      setTareas(t); setEquipos(eq); setHorasMap(hrs);
      // Calcular promedio por equipo
      const promMap = {};
      for (const eq of eq) {
        const prom = await api.getPromedioHorasDiarias(buque.id, eq.id);
        if (prom) promMap[eq.id] = prom;
      }
      setPromedioMap(promMap);
    } finally { setLoading(false); }
  }, [buque.id]);

  useEffect(() => { load(); }, [load]);

  const tareasConEstado = tareas
    .filter(t => t.tipo_frecuencia === "horas" && t.frecuencia_hs)
    .map(t => {
      const hs = horasMap[t.equipo_id] || 0;
      const estado = calcEstado(t, hs);
      const prom = promedioMap[t.equipo_id] || null;
      const forecastFecha = estado.restante > 0 ? calcForecastFecha(estado.restante, prom) : null;
      const hsVencimiento = (t.ultima_ejecucion_hs || 0) + t.frecuencia_hs;
      return { ...t, ...estado, horasActuales: hs, promedioHsDiarias: prom, forecastFecha, hsVencimiento };
    });

  const vencidas = tareasConEstado.filter(t => t.estado === "vencida");
  const proximas = tareasConEstado.filter(t => t.estado === "proxima");
  const ok = tareasConEstado.filter(t => t.estado === "ok");
  const filtradas = (filtro === "vencidas" ? vencidas : filtro === "proximas" ? proximas : filtro === "ok" ? ok : tareasConEstado)
    .sort((a, b) => ({ vencida: 0, proxima: 1, ok: 2, sin_datos: 3 }[a.estado] - ({ vencida: 0, proxima: 1, ok: 2, sin_datos: 3 }[b.estado])));

  if (loading) return <div className="loading"><span className="spin">◌</span> Cargando...</div>;

  return (
    <div>
      <div className="stats">
        <div className="stat"><div className="stat-label">Total tareas</div><div className="stat-value" style={{ color: "var(--blue)" }}>{tareasConEstado.length}</div></div>
        <div className="stat"><div className="stat-label">Vencidas</div><div className="stat-value" style={{ color: "var(--danger)" }}>{vencidas.length}</div></div>
        <div className="stat"><div className="stat-label">Próx. vencimiento</div><div className="stat-value" style={{ color: "var(--warn)" }}>{proximas.length}</div></div>
        <div className="stat"><div className="stat-label">Al día</div><div className="stat-value" style={{ color: "var(--accent2)" }}>{ok.length}</div></div>
      </div>

      <div className="filter-row">
        {[["todos", "Todos"], ["vencidas", "Vencidos"], ["proximas", "Próximos"], ["ok", "Al día"]].map(([k, l]) => (
          <button key={k} className={`btn btn-sm ${filtro === k ? "btn-primary" : "btn-ghost"}`} onClick={() => setFiltro(k)}>{l}</button>
        ))}
        <span style={{ marginLeft: "auto", fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)" }}>{filtradas.length} tareas</span>
      </div>

      {filtradas.length === 0
        ? <div className="empty-state"><div style={{ fontSize: 28, marginBottom: 8 }}>✅</div>{tareasConEstado.length === 0 ? "Cargá equipos, tareas y horas para ver el estado" : "Sin tareas en esta categoría"}</div>
        : filtradas.map(t => {
            const pctClass = t.estado === "vencida" ? "danger" : t.estado === "proxima" ? "warn" : "ok";
            const badgeClass = t.estado === "vencida" ? "b-red" : t.estado === "proxima" ? "b-amber" : "b-green";
            const restLabel = t.restante < 0 ? `Vencida hace ${Math.abs(Math.round(t.restante))} hs` : `Faltan ${Math.round(t.restante)} hs`;
            return (
              <div key={t.id} className={`alerta-row ${t.estado}`}>
                <div className="flex-between mb8">
                  <div className="flex-gap">
                    <span className={`badge ${badgeClass}`}>{t.estado === "vencida" ? "Vencida" : t.estado === "proxima" ? "Próxima" : "Al día"}</span>
                    {t.es_critica && <span className="badge b-red">Crítica</span>}
                  </div>
                  <div className="flex-gap">
                    <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)" }}>{restLabel}</span>
                    <button className="btn btn-success btn-sm" onClick={() => setModalEj(t)}>✓ Registrar</button>
                  </div>
                </div>
                <div style={{ fontWeight: 600, fontSize: 13, color: "var(--navy)", marginBottom: 4 }}>{t.descripcion}</div>
                <div className="flex-gap mb8">
                  <span style={{ fontSize: 11, color: "var(--muted)" }}>{t.mant_equipos?.nombre}</span>
                  <span style={{ fontSize: 10, color: "var(--muted2)" }}>·</span>
                  <span style={{ fontSize: 11, color: "var(--muted)" }}>Frec: {t.frecuencia_hs} hs</span>
                  <span style={{ fontSize: 10, color: "var(--muted2)" }}>·</span>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--blue)" }}>Actual: {t.horasActuales} hs</span>
                  {t.forecastFecha && (
                    <><span style={{ fontSize: 10, color: "var(--muted2)" }}>·</span>
                    <span style={{ fontSize: 11, color: "var(--accent2)" }}>Vence aprox: {fmtDate(t.forecastFecha)}</span>
                    {t.promedioHsDiarias && <span style={{ fontSize: 10, color: "var(--muted2)" }}>({t.promedioHsDiarias} hs/día)</span>}</>
                  )}
                </div>
                <div className="pct-bar"><div className={`pct-fill ${pctClass}`} style={{ width: `${t.pct}%` }} /></div>
              </div>
            );
          })
      }

      {modalEj && (
        <EjecucionModal
          tarea={modalEj}
          buqueId={buque.id}
          horasActuales={horasMap[modalEj.equipo_id] || 0}
          horasVencimiento={modalEj.hsVencimiento}
          onClose={() => setModalEj(null)}
          onSave={() => { setModalEj(null); notify("Ejecución registrada", "success"); load(); }}
        />
      )}
    </div>
  );
}

// ─── PAGE: CARGA DE HORAS ─────────────────────────────────────────────────────
function PageHoras({ buque, notify }) {
  const [equipos, setEquipos] = useState([]);
  const [horas, setHoras] = useState({});
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fecha, setFecha] = useState(today());
  const [tab, setTab] = useState("carga");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [eq, hrs, regs] = await Promise.all([api.getEquipos(buque.id), api.getUltimasHoras(buque.id), api.getRegistrosHoras(buque.id)]);
      setEquipos(eq); setHoras(hrs); setRegistros(regs.slice(0, 100));
    } finally { setLoading(false); }
  }, [buque.id]);

  useEffect(() => { load(); }, [load]);

  const handleGuardar = async () => {
    const regs = Object.entries(horas).filter(([, v]) => v).map(([equipo_id, v]) => ({
      buque_id: buque.id, equipo_id, horas: parseInt(v), fecha, registrado_por: USUARIO,
    }));
    if (!regs.length) return alert("Ingresá al menos un valor");
    setSaving(true);
    try { await api.registrarHoras(regs); notify("Horas registradas", "success"); load(); }
    catch (e) { notify("Error: " + e.message, "error"); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="loading"><span className="spin">◌</span> Cargando...</div>;

  return (
    <div>
      <div className="tabs-row">
        <div className={`tab ${tab === "carga" ? "active" : ""}`} onClick={() => setTab("carga")}>Cargar horas</div>
        <div className={`tab ${tab === "historial" ? "active" : ""}`} onClick={() => setTab("historial")}>Historial de cargas</div>
      </div>

      {tab === "carga" && (
        <div className="card">
          <div className="card-title">
            Registro diario de horas
            <input type="date" value={fecha} onChange={e => setFecha(e.target.value)}
              style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r)", padding: "5px 10px", fontSize: 12, fontFamily: "var(--sans)", outline: "none", color: "var(--text)" }} />
          </div>
          <div className="info-box warn mb12" style={{ fontSize: 11 }}>
            Ingresá las horas totales acumuladas de cada equipo. El sistema calcula el promedio diario automáticamente para forecastear vencimientos.
          </div>
          {equipos.length === 0
            ? <div className="empty-state">Sin equipos registrados</div>
            : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
                {equipos.filter(eq => eq.sector === "MAQ" || !eq.sector).map(eq => (
                  <div key={eq.id} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                    <label style={{ fontSize: 10, color: "var(--navy)", letterSpacing: ".5px", textTransform: "uppercase", fontWeight: 600 }}>{eq.nombre}</label>
                    <input type="number" className="hs-input" placeholder="0" value={horas[eq.id] || ""}
                      onChange={e => setHoras(h => ({ ...h, [eq.id]: e.target.value }))} />
                  </div>
                ))}
              </div>
          }
          <div className="mt16" style={{ display: "flex", justifyContent: "flex-end", borderTop: "1px solid var(--border)", paddingTop: 14 }}>
            <button className="btn btn-primary" onClick={handleGuardar} disabled={saving || !equipos.length}>
              {saving ? "Guardando..." : "Guardar registro"}
            </button>
          </div>
        </div>
      )}

      {tab === "historial" && (
        <div className="card" style={{ padding: 0 }}>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Fecha</th><th>Equipo</th><th>Horas</th><th>Registrado por</th></tr></thead>
              <tbody>
                {registros.length === 0
                  ? <tr><td colSpan={4} style={{ textAlign: "center", padding: 24, color: "var(--muted)" }}>Sin registros</td></tr>
                  : registros.map(r => (
                    <tr key={r.id}>
                      <td style={{ fontFamily: "var(--mono)", fontSize: 11 }}>{fmtDate(r.fecha)}</td>
                      <td style={{ fontSize: 12 }}>{r.mant_equipos?.nombre || "—"}</td>
                      <td className="text-mono" style={{ fontSize: 12, color: "var(--blue)", fontWeight: 600 }}>{r.horas} hs</td>
                      <td style={{ fontSize: 11, color: "var(--muted)" }}>{r.registrado_por || "—"}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PAGE: KPIs ───────────────────────────────────────────────────────────────
function PageKPIs({ buque }) {
  const [ejecuciones, setEjecuciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getEjecuciones(buque.id).then(d => { setEjecuciones(d); setLoading(false); });
  }, [buque.id]);

  if (loading) return <div className="loading"><span className="spin">◌</span> Cargando...</div>;

  const fueraTerm = ejecuciones.filter(e => e.fue_fuera_termino);
  const enTerm = ejecuciones.filter(e => !e.fue_fuera_termino);
  const pctFuera = ejecuciones.length ? Math.round(fueraTerm.length / ejecuciones.length * 100) : 0;
  const conMatriz = fueraTerm.filter(e => e.adjunto_riesgo_url);

  return (
    <div>
      <div className="stats">
        <div className="stat"><div className="stat-label">Total ejecuciones</div><div className="stat-value" style={{ color: "var(--blue)" }}>{ejecuciones.length}</div></div>
        <div className="stat"><div className="stat-label">En término</div><div className="stat-value" style={{ color: "var(--accent2)" }}>{enTerm.length}</div></div>
        <div className="stat"><div className="stat-label">Fuera de término</div><div className="stat-value" style={{ color: "var(--danger)" }}>{fueraTerm.length}</div></div>
        <div className="stat"><div className="stat-label">% fuera de término</div><div className="stat-value" style={{ color: pctFuera > 20 ? "var(--danger)" : pctFuera > 10 ? "var(--warn)" : "var(--accent2)" }}>{pctFuera}%</div></div>
      </div>

      {fueraTerm.length > 0 && (
        <div className="card">
          <div className="card-title">Ejecuciones fuera de término</div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Fecha</th><th>Tarea</th><th>Equipo</th><th>Días atraso</th><th>Realizado por</th><th>Matriz riesgo</th></tr></thead>
              <tbody>
                {fueraTerm.map(e => (
                  <tr key={e.id}>
                    <td style={{ fontFamily: "var(--mono)", fontSize: 11 }}>{fmtDate(e.fecha)}</td>
                    <td style={{ fontSize: 12, fontWeight: 500 }}>{e.mant_tareas?.descripcion}</td>
                    <td style={{ fontSize: 11, color: "var(--muted)" }}>{e.mant_tareas?.mant_equipos?.nombre}</td>
                    <td><span className="badge b-red">{e.dias_fuera_termino || "—"} días</span></td>
                    <td style={{ fontSize: 11 }}>{e.realizado_por || "—"}</td>
                    <td>
                      {e.adjunto_riesgo_url
                        ? <a href={e.adjunto_riesgo_url} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: "var(--blue)", textDecoration: "none" }}>Ver PDF</a>
                        : <span style={{ fontSize: 11, color: "var(--muted2)" }}>Sin adjunto</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {ejecuciones.length === 0 && <div className="empty-state"><div style={{ fontSize: 28, marginBottom: 8 }}>📊</div>Sin ejecuciones registradas aún</div>}
    </div>
  );
}

// ─── PAGE: PLAN ───────────────────────────────────────────────────────────────
function PagePlan({ buque, notify }) {
  const [tareas, setTareas] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalTarea, setModalTarea] = useState(false);
  const [modalEquipo, setModalEquipo] = useState(false);
  const [filtroSector, setFiltroSector] = useState("");
  const [busqueda, setBusqueda] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [t, eq] = await Promise.all([api.getTareas(buque.id), api.getEquipos(buque.id)]);
      setTareas(t); setEquipos(eq);
    } finally { setLoading(false); }
  }, [buque.id]);

  useEffect(() => { load(); }, [load]);

  const sectores = [...new Set(equipos.map(e => e.sector).filter(Boolean))].sort();
  const filtradas = tareas.filter(t => {
    if (filtroSector && t.mant_equipos?.sector !== filtroSector) return false;
    if (busqueda && !t.descripcion?.toLowerCase().includes(busqueda.toLowerCase()) && !t.codigo?.toLowerCase().includes(busqueda.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div className="filter-row">
        <input className="filter-input" placeholder="🔍 Buscar tarea..." value={busqueda} onChange={e => setBusqueda(e.target.value)} />
        <select className="filter-select" value={filtroSector} onChange={e => setFiltroSector(e.target.value)}>
          <option value="">Todos los sectores</option>
          {sectores.map(s => <option key={s}>{s}</option>)}
        </select>
        {(busqueda || filtroSector) && <button className="btn btn-ghost btn-sm" onClick={() => { setBusqueda(""); setFiltroSector(""); }}>✕ Limpiar</button>}
        <span style={{ marginLeft: "auto", fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)" }}>{filtradas.length} tareas</span>
        <button className="btn btn-ghost btn-sm" onClick={() => setModalEquipo(true)}>+ Equipo</button>
        <button className="btn btn-primary btn-sm" onClick={() => setModalTarea(true)}>+ Tarea</button>
      </div>
      {loading ? <div className="loading"><span className="spin">◌</span> Cargando...</div> :
        filtradas.length === 0 ? <div className="empty-state"><div style={{ fontSize: 28, marginBottom: 8 }}>🔧</div>Sin tareas</div> :
        <div className="card" style={{ padding: 0 }}>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Código</th><th>Equipo</th><th>Sector</th><th>Descripción</th><th>Frecuencia</th><th>Último</th><th>Crítica</th></tr></thead>
              <tbody>
                {filtradas.map(t => (
                  <tr key={t.id}>
                    <td className="text-mono" style={{ fontSize: 10, color: "var(--muted)" }}>{t.codigo || "—"}</td>
                    <td style={{ fontSize: 12, fontWeight: 500 }}>{t.mant_equipos?.nombre}</td>
                    <td style={{ fontSize: 11, color: "var(--muted)" }}>{t.mant_equipos?.sector || "—"}</td>
                    <td style={{ fontSize: 12 }}>{t.descripcion}</td>
                    <td className="text-mono" style={{ fontSize: 11, color: "var(--blue)" }}>{t.tipo_frecuencia === "horas" ? `${t.frecuencia_hs} hs` : t.frecuencia_texto}</td>
                    <td style={{ fontSize: 11, color: "var(--muted)" }}>{t.ultima_ejecucion_hs ? `${t.ultima_ejecucion_hs} hs` : fmtDate(t.ultima_ejecucion_fecha)}</td>
                    <td>{t.es_critica ? <span className="badge b-red">Sí</span> : <span style={{ color: "var(--muted2)", fontSize: 11 }}>—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      }
      {modalTarea && <TareaModal buqueId={buque.id} equipos={equipos} onClose={() => setModalTarea(false)} onSave={() => { setModalTarea(false); notify("Tarea creada", "success"); load(); }} />}
      {modalEquipo && <EquipoModal buqueId={buque.id} onClose={() => setModalEquipo(false)} onSave={() => { setModalEquipo(false); notify("Equipo creado", "success"); load(); }} />}
    </div>
  );
}

// ─── PAGE: CORRECTIVOS ────────────────────────────────────────────────────────
function PageCorrectivos({ buque, notify }) {
  const [correctivos, setCorrectivos] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [filtroStatus, setFiltroStatus] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [c, eq] = await Promise.all([api.getCorrectivos(buque.id), api.getEquipos(buque.id)]);
      setCorrectivos(c); setEquipos(eq);
    } finally { setLoading(false); }
  }, [buque.id]);

  useEffect(() => { load(); }, [load]);

  const STATUS_COLOR = { abierto: "b-red", en_proceso: "b-amber", resuelto: "b-green" };
  const STATUS_LABEL = { abierto: "Abierto", en_proceso: "En proceso", resuelto: "Resuelto" };
  const PRIO_COLOR = { critica: "b-red", alta: "b-amber", normal: "b-blue", baja: "b-gray" };
  const filtrados = correctivos.filter(c => !filtroStatus || c.status === filtroStatus);

  return (
    <div>
      <div className="filter-row">
        <select className="filter-select" value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}>
          <option value="">Todos los estados</option>
          <option value="abierto">Abierto</option><option value="en_proceso">En proceso</option><option value="resuelto">Resuelto</option>
        </select>
        {filtroStatus && <button className="btn btn-ghost btn-sm" onClick={() => setFiltroStatus("")}>✕ Limpiar</button>}
        <span style={{ marginLeft: "auto", fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)" }}>{filtrados.length} correctivos</span>
        <button className="btn btn-primary btn-sm" onClick={() => setModal({})}>+ Nuevo correctivo</button>
      </div>
      {loading ? <div className="loading"><span className="spin">◌</span> Cargando...</div> :
        filtrados.length === 0 ? <div className="empty-state"><div style={{ fontSize: 28, marginBottom: 8 }}>✅</div>Sin correctivos</div> :
        filtrados.map(c => (
          <div key={c.id} className="alerta-row" style={{ borderLeft: `4px solid ${c.status === "abierto" ? "var(--danger)" : c.status === "en_proceso" ? "var(--warn)" : "var(--accent2)"}`, cursor: "pointer" }}
            onClick={() => setModal(c)}>
            <div className="flex-between mb8">
              <div className="flex-gap">
                <span className={`badge ${STATUS_COLOR[c.status]}`}>{STATUS_LABEL[c.status]}</span>
                <span className={`badge ${PRIO_COLOR[c.prioridad]}`}>{c.prioridad}</span>
              </div>
              <span style={{ fontSize: 10, color: "var(--muted)" }}>{fmtDate(c.fecha_deteccion)}</span>
            </div>
            <div style={{ fontWeight: 600, fontSize: 13, color: "var(--navy)", marginBottom: 4 }}>{c.titulo}</div>
            <div className="flex-gap">
              {c.mant_equipos && <span style={{ fontSize: 11, color: "var(--muted)" }}>{c.mant_equipos.nombre}</span>}
              {c.descripcion && <><span style={{ color: "var(--muted2)" }}>·</span><span style={{ fontSize: 11, color: "var(--muted)" }}>{c.descripcion.slice(0, 80)}{c.descripcion.length > 80 ? "..." : ""}</span></>}
            </div>
          </div>
        ))
      }
      {modal !== null && <CorrectivoModal buqueId={buque.id} equipos={equipos} correctivo={modal?.id ? modal : null} onClose={() => setModal(null)} onSave={() => { setModal(null); notify("Correctivo guardado", "success"); load(); }} />}
    </div>
  );
}

// ─── PAGE: HISTORIAL ──────────────────────────────────────────────────────────
function PageHistorial({ buque }) {
  const [ejecuciones, setEjecuciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [desde, setDesde] = useState(""); const [hasta, setHasta] = useState("");

  useEffect(() => { api.getEjecuciones(buque.id).then(d => { setEjecuciones(d); setLoading(false); }); }, [buque.id]);

  const filtradas = ejecuciones.filter(e => {
    if (desde && e.fecha < desde) return false;
    if (hasta && e.fecha > hasta) return false;
    return true;
  });

  const dateIn = (val, set) => <input type="date" value={val} onChange={e => set(e.target.value)}
    style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r)", padding: "5px 10px", fontSize: 11, fontFamily: "var(--sans)", outline: "none", color: "var(--text)" }} />;

  return (
    <div>
      <div className="filter-row">
        <div className="flex-gap">
          <span style={{ fontSize: 11, color: "var(--muted)" }}>Desde</span>{dateIn(desde, setDesde)}
          <span style={{ fontSize: 11, color: "var(--muted)" }}>hasta</span>{dateIn(hasta, setHasta)}
        </div>
        {(desde || hasta) && <button className="btn btn-ghost btn-sm" onClick={() => { setDesde(""); setHasta(""); }}>✕ Limpiar</button>}
        <span style={{ marginLeft: "auto", fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)" }}>{filtradas.length} ejecuciones</span>
      </div>
      {loading ? <div className="loading"><span className="spin">◌</span> Cargando...</div> :
        filtradas.length === 0 ? <div className="empty-state"><div style={{ fontSize: 28, marginBottom: 8 }}>📋</div>Sin ejecuciones</div> :
        <div className="card" style={{ padding: 0 }}>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Fecha</th><th>Tarea</th><th>Equipo</th><th>Horas</th><th>Realizado por</th><th>Atraso</th><th>Matriz</th></tr></thead>
              <tbody>
                {filtradas.map(e => (
                  <tr key={e.id}>
                    <td style={{ fontFamily: "var(--mono)", fontSize: 11 }}>{fmtDate(e.fecha)}</td>
                    <td style={{ fontSize: 12, fontWeight: 500 }}>{e.mant_tareas?.descripcion}</td>
                    <td style={{ fontSize: 11, color: "var(--muted)" }}>{e.mant_tareas?.mant_equipos?.nombre}</td>
                    <td className="text-mono" style={{ fontSize: 11, color: "var(--blue)" }}>{e.horas_equipo ? `${e.horas_equipo} hs` : "—"}</td>
                    <td style={{ fontSize: 11 }}>{e.realizado_por || "—"}</td>
                    <td>{e.fue_fuera_termino ? <span className="badge b-red">{e.dias_fuera_termino || "?"} días</span> : <span className="badge b-green">En término</span>}</td>
                    <td>{e.adjunto_riesgo_url ? <a href={e.adjunto_riesgo_url} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: "var(--blue)" }}>Ver</a> : <span style={{ fontSize: 11, color: "var(--muted2)" }}>—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      }
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [buques, setBuques] = useState([]);
  const [buqueSeleccionado, setBuqueSeleccionado] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [notif, setNotif] = useState(null);
  const [loading, setLoading] = useState(true);

  const notify = useCallback((text, type = "info") => {
    setNotif({ text, type });
    setTimeout(() => setNotif(null), 4000);
  }, []);

  useEffect(() => {
    api.getBuques().then(data => {
      setBuques(data);
      if (data.length) setBuqueSeleccionado(data[0]);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const pageTitles = {
    dashboard: buqueSeleccionado ? `${buqueSeleccionado.nombre} — Dashboard` : "Dashboard",
    horas: "Carga de horas", plan: "Plan de mantenimiento",
    correctivos: "Correctivos", historial: "Historial", kpis: "KPIs",
  };

  const NI = ({ id, icon, label }) => (
    <div className={`ni ${page === id ? "active" : ""}`} onClick={() => setPage(id)}>
      <span className="ni-icon">{icon}</span><span>{label}</span>
    </div>
  );

  if (loading) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "sans-serif", color: "#6381A7" }}>Cargando...</div>;

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        <nav className="sidebar">
          <div className="sidebar-header">
            <div className="sidebar-logo-wrap">
              <div className="sidebar-logo">⚙️</div>
              <div>
                <div className="sidebar-logo-main">Mantenimiento</div>
                <div className="sidebar-logo-sub">Terra Mare Group</div>
              </div>
            </div>
          </div>
          <div className="nav-section">Buques</div>
          {buques.map(b => (
            <div key={b.id} className={`ni ${buqueSeleccionado?.id === b.id ? "active" : ""}`}
              onClick={() => { setBuqueSeleccionado(b); setPage("dashboard"); }}>
              <span className="ni-icon">🚢</span>
              <span style={{ fontSize: 11 }}>{b.nombre}</span>
            </div>
          ))}
          <div className="nav-section">Vistas</div>
          <NI id="dashboard" icon="▦" label="Dashboard" />
          <NI id="horas" icon="⏱" label="Carga de horas" />
          <NI id="plan" icon="☰" label="Plan completo" />
          <NI id="correctivos" icon="⚠" label="Correctivos" />
          <NI id="historial" icon="📋" label="Historial" />
          <NI id="kpis" icon="📊" label="KPIs" />
          <div style={{ flex: 1 }} />
          <div style={{ padding: "14px 18px", borderTop: "1px solid rgba(255,255,255,.1)" }}>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,.3)", fontFamily: "var(--mono)", letterSpacing: 1 }}>MANTENIMIENTO v1.1</div>
          </div>
        </nav>
        <div className="main">
          <div className="topbar">
            <div className="topbar-title">{pageTitles[page] || page}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#DBEAFE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "var(--blue)", fontWeight: 700 }}>JM</div>
              <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500 }}>{USUARIO}</span>
            </div>
          </div>
          <div className="content">
            {!buqueSeleccionado
              ? <div className="empty-state"><div style={{ fontSize: 28, marginBottom: 8 }}>🚢</div>Seleccioná un buque</div>
              : <>
                  {page === "dashboard" && <PageDashboard buque={buqueSeleccionado} notify={notify} />}
                  {page === "horas" && <PageHoras buque={buqueSeleccionado} notify={notify} />}
                  {page === "plan" && <PagePlan buque={buqueSeleccionado} notify={notify} />}
                  {page === "correctivos" && <PageCorrectivos buque={buqueSeleccionado} notify={notify} />}
                  {page === "historial" && <PageHistorial buque={buqueSeleccionado} />}
                  {page === "kpis" && <PageKPIs buque={buqueSeleccionado} />}
                </>
            }
          </div>
        </div>
      </div>
      <Notif msg={notif} onClose={() => setNotif(null)} />
    </>
  );
}
