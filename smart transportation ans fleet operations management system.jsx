import { useState, useEffect } from "react";

// Vehicle data: added more over time so structure got a bit messy

const vehicles = [
  { id: 1, vehicle_id: "TRK-001", type: "Truck", make: "Volvo", model: "FH16", year: 2022, plate_number: "MH-12-AB-4521", capacity: 25, fuel_level: 82, fuel_status: "Full", mileage: 45230, maintenance_status: "Operational", is_active: true },
  { id: 2, vehicle_id: "BUS-007", type: "Bus", make: "Mercedes", model: "Citaro", year: 2021, plate_number: "DL-03-CD-7812", capacity: 52, fuel_level: 38, fuel_status: "Low", mileage: 102450, maintenance_status: "Due Soon", is_active: true },
  { id: 3, vehicle_id: "VAN-003", type: "Van", make: "Ford", model: "Transit", year: 2023, plate_number: "KA-05-EF-2233", capacity: 3.5, fuel_level: 12, fuel_status: "Critical", mileage: 18900, maintenance_status: "Overdue", is_active: true },
  { id: 4, vehicle_id: "TRK-005", type: "Truck", make: "Scania", model: "R500", year: 2020, plate_number: "TN-07-GH-9901", capacity: 30, fuel_level: 65, fuel_status: "Adequate", mileage: 78340, maintenance_status: "Operational", is_active: true },
  { id: 5, vehicle_id: "VAN-009", type: "Van", make: "Mercedes", model: "Sprinter", year: 2022, plate_number: "MH-01-IJ-3345", capacity: 2, fuel_level: 91, fuel_status: "Full", mileage: 22100, maintenance_status: "Operational", is_active: true },
];

const drivers = [
  { id: 1, full_name: "Rajesh Sharma", role: "driver", email: "r.sharma@fleetops.in", phone: "+91 98201 12345", license_no: "DL-04-20190042312" },
  { id: 2, full_name: "Priya Nair", role: "driver", email: "p.nair@fleetops.in", phone: "+91 90876 54321", license_no: "KA-19-20200056421" },
  { id: 3, full_name: "Arjun Verma", role: "driver", email: "a.verma@fleetops.in", phone: "+91 88123 99876", license_no: "MH-02-20210078901" },
  { id: 4, full_name: "Sneha Reddy", role: "driver", email: "s.reddy@fleetops.in", phone: "+91 77543 22109", license_no: "TN-09-20180034567" },
];

const routes = [
  { id: 1, route_code: "RT-MUM-PUN", name: "Mumbai – Pune Express", origin: "Mumbai", destination: "Pune", distance_km: 148, estimated_hours: 2.5, waypoints: ["Khopoli", "Lonavala"] },
  { id: 2, route_code: "RT-DEL-AGR", name: "Delhi – Agra NH2", origin: "Delhi", destination: "Agra", distance_km: 233, estimated_hours: 4, waypoints: ["Faridabad", "Mathura"] },
  { id: 3, route_code: "RT-BLR-CHN", name: "Bangalore – Chennai", origin: "Bangalore", destination: "Chennai", distance_km: 346, estimated_hours: 6, waypoints: ["Vellore", "Ambur"] },
  { id: 4, route_code: "RT-HYD-VJA", name: "Hyderabad – Vijayawada", origin: "Hyderabad", destination: "Vijayawada", distance_km: 274, estimated_hours: 4.5, waypoints: ["Nalgonda"] },
];

// Initial trip data: real data will come from API eventually

const initialTrips = [
  { id: 1, trip_code: "TRP-A4X2F1", vehicle_id: 1, driver_id: 1, route_id: 1, status: "In Progress", scheduled_start: "2026-02-22T07:00", scheduled_end: "2026-02-22T10:30", cargo_type: "Electronics", cargo_weight: 18, fuel_used: 22.5, delay_minutes: 0 },
  { id: 2, trip_code: "TRP-B7K9P3", vehicle_id: 2, driver_id: 2, route_id: 2, status: "Scheduled", scheduled_start: "2026-02-22T14:00", scheduled_end: "2026-02-22T18:00", cargo_type: "Passengers", cargo_weight: 0, fuel_used: 0, delay_minutes: 0 },
  { id: 3, trip_code: "TRP-C2M5Q8", vehicle_id: 3, driver_id: 3, route_id: 3, status: "Delayed", scheduled_start: "2026-02-21T09:00", scheduled_end: "2026-02-21T16:00", cargo_type: "Pharma", cargo_weight: 2.1, fuel_used: 45, delay_minutes: 85 },
  { id: 4, trip_code: "TRP-D9R1S4", vehicle_id: 4, driver_id: 4, route_id: 4, status: "Completed", scheduled_start: "2026-02-21T06:00", scheduled_end: "2026-02-21T11:00", cargo_type: "FMCG", cargo_weight: 22, fuel_used: 68, delay_minutes: 12 },
  { id: 5, trip_code: "TRP-E3T6U7", vehicle_id: 5, driver_id: 1, route_id: 1, status: "Scheduled", scheduled_start: "2026-02-23T08:00", scheduled_end: "2026-02-23T11:00", cargo_type: "Courier", cargo_weight: 1.8, fuel_used: 0, delay_minutes: 0 },
];

const initialAlerts = [
  { id: 1, trip_id: 3, alert_type: "Delay", message: "TRP-C2M5Q8 delayed 85 min due to highway congestion on NH44.", created_at: "2026-02-21T11:25" },
  { id: 2, trip_id: null, alert_type: "Fuel", message: "VAN-003 fuel critically low (12%). Immediate refuelling required.", created_at: "2026-02-22T06:10" },
  { id: 3, trip_id: null, alert_type: "Maintenance", message: "VAN-003 maintenance overdue by 3,200 km. Schedule service immediately.", created_at: "2026-02-20T09:00" },
  { id: 4, trip_id: null, alert_type: "Maintenance", message: "BUS-007 scheduled maintenance due within 500 km.", created_at: "2026-02-22T07:30" },
  { id: 5, trip_id: 4, alert_type: "Delay", message: "TRP-D9R1S4 arrived 12 min late due to minor traffic at Nalgonda.", created_at: "2026-02-21T11:12" },
];

// Used for the chart on the dashboard

const weeklyData = [
  { date: "Feb 16", t: 8, completed: 7, delayed: 1, cancelled: 0, inProgress: 0, fuel: 342, avgDelay: 8, utilization: 60 },
  { date: "Feb 17", t: 11, completed: 9, delayed: 2, cancelled: 1, inProgress: 0, fuel: 498, avgDelay: 22, utilization: 80 },
  { date: "Feb 18", t: 6, completed: 6, delayed: 0, cancelled: 0, inProgress: 0, fuel: 210, avgDelay: 0, utilization: 40 },
  { date: "Feb 19", t: 9, completed: 7, delayed: 1, cancelled: 0, inProgress: 1, fuel: 388, avgDelay: 14, utilization: 60 },
  { date: "Feb 20", t: 12, completed: 10, delayed: 2, cancelled: 1, inProgress: 0, fuel: 560, avgDelay: 31, utilization: 80 },
  { date: "Feb 21", t: 10, completed: 8, delayed: 1, cancelled: 0, inProgress: 1, fuel: 415, avgDelay: 19, utilization: 80 },
  { date: "Feb 22", t: 5, completed: 1, delayed: 1, cancelled: 0, inProgress: 2, fuel: 90, avgDelay: 17, utilization: 60 },
];

// Color palette: keeping it all in one place makes it easier to tweak

const colors = {
  bg: "#080e18",
  surface: "#0e1521",
  surfaceAlt: "#09101a",
  border: "#1a2a3a",
  borderAccent: "#2a5a8a",
  primary: "#60c8ff",
  muted: "#2a5a7a",
  faint: "#1a3a5a",
  text: "#c5d8e8",
  textMid: "#6a8a9a",
  textDim: "#2a4a5a",
  green: "#4ade80",
  orange: "#fb923c",
  red: "#f87171",
  purple: "#a78bfa",
  yellow: "#fbbf24",
};

// Maps status strings to [textColor, bgColor, borderColor]

const statusColors = {
  "In Progress": [colors.green, "#1a3a2a", "#2a5a3a"],
  "Scheduled": [colors.primary, "#1a2a3a", "#2a4a6a"],
  "Completed": [colors.green, "#1a3a1a", "#2a5a2a"],
  "Delayed": [colors.orange, "#3a1a0a", "#5a2a1a"],
  "Cancelled": [colors.red, "#2a1a1a", "#4a2a2a"],
  "Full": [colors.green, "#1a3a1a", "#2a5a2a"],
  "Adequate": ["#86efac", "#1a3a1a", "#2a5a2a"],
  "Low": [colors.yellow, "#2a2a0a", "#3a3a1a"],
  "Critical": [colors.red, "#2a0a0a", "#4a1a1a"],
  "Operational": [colors.green, "#1a3a1a", "#2a5a2a"],
  "Due Soon": [colors.yellow, "#2a2a0a", "#3a3a1a"],
  "Overdue": [colors.red, "#2a0a0a", "#4a1a1a"],
  "In Service": [colors.purple, "#1a1a3a", "#2a2a5a"],
  "Delay": [colors.orange, "#3a1a0a", "#5a2a1a"],
  "Breakdown": [colors.red, "#2a0a0a", "#4a1a1a"],
  "Fuel": [colors.yellow, "#2a2a0a", "#3a3a1a"],
  "Maintenance": [colors.purple, "#1a1a3a", "#2a2a5a"],
  "Info": [colors.primary, "#0a1a2a", "#1a3a5a"],
};

const monoFont = { fontFamily: "'DM Mono', monospace" };

function Badge({ label }) {
  const entry = statusColors[label];
  const textColor = entry ? entry[0] : colors.muted;
  const bg = entry ? entry[1] : colors.surface;
  const border = entry ? entry[2] : colors.border;
  
  return (
    <span style={{
      ...monoFont,
      background: bg,
      color: textColor,
      border: `1px solid ${border}`,
      padding: "3px 10px",
      borderRadius: 4,
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: "0.06em",
      whiteSpace: "nowrap"
    }}>
      {label}
    </span>
  );
}

function KpiCard({ icon, label, value, sub, accentColor, pulse }) {
  return (
    <div style={{
      background: `linear-gradient(135deg, ${colors.surface} 0%, #111927 100%)`,
      border: `1px solid ${accentColor}22`,
      borderTop: `2px solid ${accentColor}`,
      borderRadius: 10,
      padding: "18px 20px",
      flex: 1,
      minWidth: 140,
      position: "relative",
      overflow: "hidden"
    }}>
      <div style={{ position: "absolute", right: 14, top: 14, fontSize: 20, opacity: 0.12 }}>{icon}</div>
      <div style={{
        ...monoFont,
        color: colors.textDim,
        fontSize: 10,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        marginBottom: 5
      }}>
        {label}
      </div>
      <div style={{
        ...monoFont,
        color: accentColor,
        fontSize: 34,
        fontWeight: 900,
        lineHeight: 1,
        animation: pulse ? "pulse 2s ease-in-out infinite" : undefined
      }}>
        {value}
      </div>
      {sub && <div style={{ ...monoFont, color: "#1e3e50", fontSize: 10, marginTop: 5 }}>{sub}</div>}
    </div>
  );
}

function FuelBar({ level }) {
  let barColor = colors.red;
  
  if (level >= 75) barColor = colors.green;
  else if (level >= 40) barColor = "#86efac";
  else if (level >= 15) barColor = colors.yellow;
  
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, background: "#1a2030", borderRadius: 3, height: 5 }}>
        <div style={{ width: `${level}%`, background: barColor, height: 5, borderRadius: 3, transition: "width 0.5s" }} />
      </div>
      <span style={{ ...monoFont, color: barColor, fontSize: 11, width: 34, textAlign: "right" }}>{level}%</span>
    </div>
  );
}

// Mini bar chart for the dashboard: not the prettiest but gets the job done

function TripChart({ data }) {
  const maxVal = Math.max(...data.map(d => d.t), 1);
  
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 90, padding: "0 2px" }}>
      {data.map((d, i) => {
        const completedH = Math.max(2, Math.round((d.completed / maxVal) * 60));
        const delayedH = Math.max(2, Math.round((d.delayed / maxVal) * 60));
        
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, height: "100%" }}>
            <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end", flexDirection: "column", justifyContent: "flex-end", gap: 1 }}>
              {d.delayed > 0 && (
                <div style={{ width: "100%", height: delayedH, background: colors.orange + "70", borderRadius: "2px 2px 0 0" }} />
              )}
              <div style={{ width: "100%", height: completedH, background: colors.primary + "55", borderRadius: d.delayed > 0 ? "0" : "2px 2px 0 0" }} />
            </div>
            <div style={{ ...monoFont, color: colors.textDim, fontSize: 9 }}>{d.date.slice(-2)}</div>
          </div>
        );
      })}
    </div>
  );
}

// Shared input/label styles

const inputStyle = {
  width: "100%",
  background: "#0a111d",
  border: `1px solid ${colors.faint}`,
  borderRadius: 6,
  color: colors.text,
  padding: "9px 13px",
  fontSize: 13,
  outline: "none",
  boxSizing: "border-box",
  ...monoFont
};

const labelStyle = {
  ...monoFont,
  display: "block",
  color: colors.textMid,
  fontSize: 10,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  marginBottom: 5
};

function FormField({ label, children }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function TwoCol({ children }) {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>{children}</div>;
}

// Generic modal: reused everywhere

function Modal({ title, children, onClose, wide }) {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };
  
  return (
    <div onClick={handleBackdropClick} style={{
      position: "fixed", inset: 0, background: "#000b", zIndex: 9999,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20
    }}>
      <div style={{
        background: colors.surface,
        border: `1px solid ${colors.borderAccent}`,
        borderRadius: 12,
        width: wide ? 700 : 520,
        maxWidth: "100%",
        maxHeight: "90vh",
        overflow: "auto",
        boxShadow: "0 24px 80px #00000099"
      }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "18px 24px", borderBottom: `1px solid ${colors.border}`
        }}>
          <span style={{ ...monoFont, color: colors.primary, fontWeight: 800 }}>
```
