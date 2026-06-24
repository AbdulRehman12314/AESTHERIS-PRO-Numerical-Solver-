setInterval(() => {
    document.getElementById('clock').innerText = new Date().toLocaleTimeString('en-US', { hour12: false });
}, 1000);

const CONFIG = {
    '1': { name: 'Speed/Distance/Time', fields: ['Speed (v)', 'Distance (s)', 'Time (t)'], units: ['m/s', 'm', 's'] },
    '2': { name: 'Velocity/Displacement/Time', fields: ['Velocity (v)', 'Displacement (Δx)', 'Time (t)'], units: ['m/s', 'm', 's'] },
    '3': { name: 'Acceleration', fields: ['Initial Vel (vi)', 'Final Vel (vf)', 'Time (t)', 'Accel (a)'], units: ['m/s', 'm/s', 's', 'm/s²'] },
    '4': { name: '1st Motion Eq', fields: ['Final Vel (vf)', 'Initial Vel (vi)', 'Accel (a)', 'Time (t)'], units: ['m/s', 'm/s', 'm/s²', 's'] },
    '5': { name: '2nd Motion Eq', fields: ['Distance (S)', 'Initial Vel (vi)', 'Accel (a)', 'Time (t)'], units: ['m', 'm/s', 'm/s²', 's'] },
    '6': { name: '3rd Motion Eq', fields: ['Final Vel (vf)', 'Initial Vel (vi)', 'Accel (a)', 'Distance (S)'], units: ['m/s', 'm/s', 'm/s²', 'm'] },
    '7': { name: 'Average Speed', fields: ['Avg Speed (v_avg)', 'Total Distance (d)', 'Total Time (t)'], units: ['m/s', 'm', 's'] },
    '8': { name: 'Average Velocity', fields: ['Avg Velocity (v_avg)', 'Total Displacement (x)', 'Total Time (t)'], units: ['m/s', 'm', 's'] },
    '9': { name: 'Force/Mass/Accel', fields: ['Force (F)', 'Mass (m)', 'Acceleration (a)'], units: ['N', 'kg', 'm/s²'] },
    '10': { name: 'Weight/Gravity', fields: ['Weight (W)', 'Mass (m)'], units: ['N', 'kg'] },
    '11': { name: 'Momentum', fields: ['Momentum (P)', 'Mass (m)', 'Velocity (v)'], units: ['kg·m/s', 'kg', 'm/s'] },
    '12': { name: 'Force-Momentum Relation', fields: ['Force (F)', 'Delta Momentum (Δp)', 'Time (t)'], units: ['N', 'kg·m/s', 's'] },
    '13': { name: 'Centripetal Force', fields: ['Force (Fc)', 'Mass (m)', 'Velocity (v)', 'Radius (r)'], units: ['N', 'kg', 'm/s', 'm'] },
    '14': { name: 'Frictional Force', fields: ['Friction Force (fs)', 'Coeff Friction (μs)', 'Normal Force (N)'], units: ['N', '', 'N'] },
    '15': { name: 'Torque/Moment Arm', fields: ['Torque (τ)', 'Force (F)', 'Moment Arm (d)'], units: ['Nm', 'N', 'm'] },
    '16': { name: 'Magnetic Force/Field', fields: ['Magnetic Force (F)', 'Charge (q)', 'Velocity (v)', 'Mag Field (B)'], units: ['N', 'C', 'm/s', 'T'] },
    '17': { name: 'Orbital Velocity', fields: ['Orbital Vel (v)', 'Central Mass (M)', 'Orbital Radius (r)'], units: ['m/s', 'kg', 'm'] },
    '18': { name: 'Work Done', fields: ['Work (W)', 'Force (F)', 'Distance (d)'], units: ['J', 'N', 'm'] },
    '19': { name: 'Kinetic Energy', fields: ['K.E', 'Mass (m)', 'Velocity (v)'], units: ['J', 'kg', 'm/s'] },
    '20': { name: 'Potential Energy', fields: ['P.E', 'Mass (m)', 'Height (h)'], units: ['J', 'kg', 'm'] },
    '21': { name: 'Efficiency Engine', fields: ['Efficiency (%)', 'Output Energy (Eout)', 'Input Energy (Ein)'], units: ['%', 'J', 'J'] },
    '22': { name: 'Power Engine', fields: ['Power (P)', 'Work (W)', 'Time (t)'], units: ['W', 'J', 's'] },
    '23': { name: 'Density/Volume', fields: ['Density (ρ)', 'Mass (m)', 'Volume (V)'], units: ['kg/m³', 'kg', 'm³'] },
    '24': { name: 'Pressure/Area', fields: ['Pressure (P)', 'Force (F)', 'Area (A)'], units: ['Pa', 'N', 'm²'] },
    '25': { name: 'Liquid Pressure', fields: ['Pressure (P)', 'Density (ρ)', 'Height (h)'], units: ['Pa', 'kg/m³', 'm'] }
};

function filterOptions() {
    const input = document.getElementById('smartSearch').value.toLowerCase();
    const select = document.getElementById('serviceId');
    const optgroups = select.getElementsByTagName('optgroup');

    for (let group of optgroups) {
        let options = group.getElementsByTagName('option');
        let groupHasVisible = false;
        for (let opt of options) {
            if (opt.text.toLowerCase().includes(input)) {
                opt.style.display = "";
                groupHasVisible = true;
            } else {
                opt.style.display = "none";
            }
        }
        group.style.display = groupHasVisible ? "" : "none";
    }
}

function parseVal(str) {
    if (!str || str.trim() === "") return null;
    const match = str.match(/([-+]?[0-9]*\.?[0-9]+(?:[eE][-+]?[0-9]+)?)\s*([a-zA-Z/²³]+)?/i);
    if (!match) return null;
    let val = parseFloat(match[1]);
    let unit = match[2] ? match[2].toLowerCase() : "";
    const conv = { 'km': 1000, 'cm': 0.01, 'hr': 3600, 'h': 3600, 'min': 60, 'km/h': 1/3.6, 'g': 0.001 };
    return conv[unit] ? val * conv[unit] : val;
}

function updateUI() {
    const id = document.getElementById('serviceId').value;
    const s = CONFIG[id];
    const area = document.getElementById('inputArea');
    area.innerHTML = `
        <div style="background:rgba(0,212,255,0.1); border:1px solid #00d4ff; padding:12px; border-radius:10px; margin-bottom:20px; font-size:0.85rem; color:#00d4ff; text-align:center;">
            ⚡ <strong>UNIVERSAL MODE:</strong> Fill known boxes, leave the <strong>Unknown</strong> empty!
        </div>`;
    s.fields.forEach((f, i) => {
        area.innerHTML += `
            <div style="margin-bottom:15px;">
                <label>${f}</label>
                <input type="text" id="val${i}" placeholder="${s.units[i]}" autocomplete="off">
            </div>`;
    });
}
function processCalculation() {
    const id = document.getElementById('serviceId').value;
    const s = CONFIG[id];
    let v = [];
    s.fields.forEach((_, i) => v.push(parseVal(document.getElementById(`val${i}`).value)));

    let nullPositions = [];
    v.forEach((val, index) => { if (val === null) nullPositions.push(index); });

    if (nullPositions.length !== 1) {
        alert(`System Error: Please fill all fields except exactly ONE unknown value.`);
        return;
    }

    let unknownIndex = nullPositions[0];
    let res = 0, finding = "", origFormula = "", reqFormula = "", stepsStr = "", targetUnit = s.units[unknownIndex];
    const g = 9.81;

    // Given Data Builder
    let givenArray = [];
    s.fields.forEach((field, i) => {
        if (i !== unknownIndex) {
            let labelClean = field.split(' ')[0];
            givenArray.push(`<div style="display:flex; justify-content:space-between; padding:4px 0; border-bottom:1px solid rgba(255,255,255,0.03);"><span style="color:#8892b0;">${labelClean}</span><span style="color:#fff; font-weight:600;">${v[i]} ${s.units[i]}</span></div>`);
        }
    });
    let givenHTML = givenArray.join('');
    finding = s.fields[unknownIndex].split(' ')[0];

    try {
        switch(id) {
            case '1': // Speed
            case '2': // Velocity
            case '7': // Average Speed
            case '8': // Average Velocity
                var isVel = (id === '2' || id === '8');
                var isAvg = (id === '7' || id === '8');
                let symbolV = isAvg ? "Avg Velocity" : (isVel ? "Velocity" : "Speed");
                let symbolD = isVel ? "Displacement" : "Distance";
                
                origFormula = `${symbolV} = ${symbolD} / Time`;
                
                if (unknownIndex === 0) { 
                    res = v[1] / v[2]; 
                    reqFormula = `${symbolV} = ${symbolD} / Time`;
                    stepsStr = `• Step 1 (Formula Alignment):<br>&nbsp;&nbsp;${symbolV} = ${v[1]} / ${v[2]}<br><br>• Step 2 (Division Core):<br>&nbsp;&nbsp;${symbolV} = ${res.toFixed(2)} ${targetUnit}`; 
                } else if (unknownIndex === 1) { 
                    res = v[0] * v[2]; 
                    reqFormula = `${symbolD} = ${symbolV} x Time`;
                    stepsStr = `• Step 1 (Formula Alignment):<br>&nbsp;&nbsp;${symbolD} = ${v[0]} x ${v[2]}<br><br>• Step 2 (Multiplication Core):<br>&nbsp;&nbsp;${symbolD} = ${res.toFixed(2)} ${targetUnit}`; 
                } else { 
                    res = v[1] / v[0]; 
                    reqFormula = `Time = ${symbolD} / ${symbolV}`;
                    stepsStr = `• Step 1 (Formula Alignment):<br>&nbsp;&nbsp;Time = ${v[1]} / ${v[0]}<br><br>• Step 2 (Division Core):<br>&nbsp;&nbsp;Time = ${res.toFixed(2)} ${targetUnit}`; 
                }
                break;

            case '3': // Acceleration
                origFormula = "Acceleration = (Final Vel - Initial Vel) / Time";
                if (unknownIndex === 0) {
                    res = v[1] - (v[3] * v[2]); reqFormula = "Initial Vel = Final Vel - (Acceleration x Time)";
                    stepsStr = `• Step 1: Initial Vel = ${v[1]} - (${v[3]} x ${v[2]})<br>• Step 2: Initial Vel = ${v[1]} - ${v[3] * v[2]}<br>• Step 3: Result = ${res.toFixed(2)} m/s`;
                } else if (unknownIndex === 1) {
                    res = v[0] + (v[3] * v[2]); reqFormula = "Final Vel = Initial Vel + (Acceleration x Time)";
                    stepsStr = `• Step 1: Final Vel = ${v[0]} + (${v[3]} x ${v[2]})<br>• Step 2: Final Vel = ${v[0]} + ${v[3] * v[2]}<br>• Step 3: Result = ${res.toFixed(2)} m/s`;
                } else if (unknownIndex === 2) {
                    res = (v[1] - v[0]) / v[3]; reqFormula = "Time = (Final Vel - Initial Vel) / Acceleration";
                    stepsStr = `• Step 1: Time = (${v[1]} - ${v[0]}) / ${v[3]}<br>• Step 2: Time = ${v[1] - v[0]} / ${v[3]}<br>• Step 3: Result = ${res.toFixed(2)} s`;
                } else {
                    res = (v[1] - v[0]) / v[2]; reqFormula = "Acceleration = (Final Vel - Initial Vel) / Time";
                    stepsStr = `• Step 1: Acceleration = (${v[1]} - ${v[0]}) / ${v[2]}<br>• Step 2: Acceleration = ${v[1] - v[0]} / ${v[2]}<br>• Step 3: Result = ${res.toFixed(2)} m/s²`;
                }
                break;

            case '4': // 1st Motion Eq
                origFormula = "Final Vel = Initial Vel + (Acceleration x Time)";
                if (unknownIndex === 0) { 
                    res = v[1] + (v[2] * v[3]); reqFormula = "Final Vel = Initial Vel + (Acceleration x Time)";
                    stepsStr = `• Step 1: Final Vel = ${v[1]} + (${v[2]} x ${v[3]})<br>• Step 2: Final Vel = ${v[1]} + ${v[2] * v[3]}<br>• Step 3: Result = ${res.toFixed(2)} m/s`;
                } else if (unknownIndex === 1) { 
                    res = v[0] - (v[2] * v[3]); reqFormula = "Initial Vel = Final Vel - (Acceleration x Time)";
                    stepsStr = `• Step 1: Initial Vel = ${v[0]} - (${v[2]} x ${v[3]})<br>• Step 2: Initial Vel = ${v[0]} - ${v[2] * v[3]}<br>• Step 3: Result = ${res.toFixed(2)} m/s`;
                } else if (unknownIndex === 2) { 
                    res = (v[0] - v[1]) / v[3]; reqFormula = "Acceleration = (Final Vel - Initial Vel) / Time";
                    stepsStr = `• Step 1: Acceleration = (${v[0]} - ${v[1]}) / ${v[3]}<br>• Step 2: Acceleration = ${v[0] - v[1]} / ${v[3]}<br>• Step 3: Result = ${res.toFixed(2)} m/s²`;
                } else { 
                    res = (v[0] - v[1]) / v[2]; reqFormula = "Time = (Final Vel - Initial Vel) / Acceleration";
                    stepsStr = `• Step 1: Time = (${v[0]} - ${v[1]}) / ${v[2]}<br>• Step 2: Time = ${v[0] - v[1]} / ${v[2]}<br>• Step 3: Result = ${res.toFixed(2)} s`;
                }
                break;

            case '9': // F = ma
                origFormula = "Force = Mass x Acceleration";
                if (unknownIndex === 0) { 
                    res = v[1] * v[2]; reqFormula = "Force = Mass x Acceleration"; 
                    stepsStr = `• Step 1 (Values Alignment): Force = ${v[1]} x ${v[2]}<br>• Step 2 (Product Evaluation): Force = ${res.toFixed(2)} N`;
                } else if (unknownIndex === 1) { 
                    res = v[0] / v[2]; reqFormula = "Mass = Force / Acceleration"; 
                    stepsStr = `• Step 1 (Values Alignment): Mass = ${v[0]} / ${v[2]}<br>• Step 2 (Division Evaluation): Mass = ${res.toFixed(2)} kg`;
                } else { 
                    res = v[0] / v[1]; reqFormula = "Acceleration = Force / Mass"; 
                    stepsStr = `• Step 1 (Values Alignment): Acceleration = ${v[0]} / ${v[1]}<br>• Step 2 (Division Evaluation): Acceleration = ${res.toFixed(2)} m/s²`;
                }
                break;

            case '10': // W = mg
                origFormula = "Weight = Mass x Gravity";
                if (unknownIndex === 0) { 
                    res = v[1] * g; reqFormula = "Weight = Mass x Gravity"; 
                    stepsStr = `• Step 1 (Gravity Constant = 9.81): Weight = ${v[1]} x 9.81<br>• Step 2 (Product Evaluation): Weight = ${res.toFixed(2)} N`;
                } else { 
                    res = v[0] / g; reqFormula = "Mass = Weight / Gravity"; 
                    stepsStr = `• Step 1 (Gravity Constant = 9.81): Mass = ${v[0]} / 9.81<br>• Step 2 (Division Evaluation): Mass = ${res.toFixed(2)} kg`;
                }
                break;

            case '11': // Momentum
                origFormula = "Momentum = Mass x Velocity";
                if (unknownIndex === 0) {
                    res = v[1] * v[2]; reqFormula = "Momentum = Mass x Velocity";
                    stepsStr = `• Step 1 (Values Alignment): Momentum = ${v[1]} x ${v[2]}<br>• Step 2 (Product Evaluation): Momentum = ${res.toFixed(2)} kg·m/s`;
                } else if (unknownIndex === 1) {
                    res = v[0] / v[2]; reqFormula = "Mass = Momentum / Velocity";
                    stepsStr = `• Step 1 (Values Alignment): Mass = ${v[0]} / ${v[2]}<br>• Step 2 (Division Evaluation): Mass = ${res.toFixed(2)} kg`;
                } else {
                    res = v[0] / v[1]; reqFormula = "Velocity = Momentum / Mass";
                    stepsStr = `• Step 1 (Values Alignment): Velocity = ${v[0]} / ${v[1]}<br>• Step 2 (Division Evaluation): Velocity = ${res.toFixed(2)} m/s`;
                }
                break;

            case '18': // W = Fd
                origFormula = "Work = Force x Distance";
                if (unknownIndex === 0) { 
                    res = v[1] * v[2]; reqFormula = "Work = Force x Distance"; 
                    stepsStr = `• Step 1 (Values Alignment): Work = ${v[1]} x ${v[2]}<br>• Step 2 (Product Evaluation): Work = ${res.toFixed(2)} J`;
                } else if (unknownIndex === 1) { 
                    res = v[0] / v[2]; reqFormula = "Force = Work / Distance"; 
                    stepsStr = `• Step 1 (Values Alignment): Force = ${v[0]} / ${v[2]}<br>• Step 2 (Division Evaluation): Force = ${res.toFixed(2)} N`;
                } else { 
                    res = v[0] / v[1]; reqFormula = "Distance = Work / Force"; 
                    stepsStr = `• Step 1 (Values Alignment): Distance = ${v[0]} / ${v[1]}<br>• Step 2 (Division Evaluation): Distance = ${res.toFixed(2)} m`;
                }
                break;

            case '19': // KE
                origFormula = "Kinetic Energy = 0.5 x Mass x Velocity x Velocity";
                if (unknownIndex === 0) {
                    res = 0.5 * v[1] * Math.pow(v[2], 2); reqFormula = "Kinetic Energy = 0.5 x Mass x Velocity²";
                    stepsStr = `• Step 1: Kinetic Energy = 0.5 x ${v[1]} x ${v[2]}²<br>• Step 2: Kinetic Energy = 0.5 x ${v[1]} x ${Math.pow(v[2], 2)}<br>• Step 3: Result = ${res.toFixed(2)} J`;
                } else if (unknownIndex === 1) {
                    res = (2 * v[0]) / Math.pow(v[2], 2); reqFormula = "Mass = (2 x Kinetic Energy) / Velocity²";
                    stepsStr = `• Step 1: Mass = (2 x ${v[0]}) / ${v[2]}²<br>• Step 2: Result = ${res.toFixed(2)} kg`;
                } else {
                    res = Math.sqrt((2 * v[0]) / v[1]); reqFormula = "Velocity = Square Root((2 x Kinetic Energy) / Mass)";
                    stepsStr = `• Step 1: Velocity = Square Root((2 x ${v[0]}) / ${v[1]})<br>• Step 2: Result = ${res.toFixed(2)} m/s`;
                }
                break;

            case '20': // PE
                origFormula = "Potential Energy = Mass x Gravity x Height";
                if (unknownIndex === 0) {
                    res = v[1] * g * v[2]; reqFormula = "Potential Energy = Mass x Gravity x Height";
                    stepsStr = `• Step 1 (Gravity = 9.81): Potential Energy = ${v[1]} x 9.81 x ${v[2]}<br>• Step 2: Result = ${res.toFixed(2)} J`;
                } else if (unknownIndex === 1) {
                    res = v[0] / (g * v[2]); reqFormula = "Mass = Potential Energy / (Gravity x Height)";
                    stepsStr = `• Step 1: Mass = ${v[0]} / (9.81 x ${v[2]})<br>• Step 2: Result = ${res.toFixed(2)} kg`;
                } else {
                    res = v[0] / (v[1] * g); reqFormula = "Height = Potential Energy / (Mass x Gravity)";
                    stepsStr = `• Step 1: Height = ${v[0]} / (${v[1]} x 9.81)<br>• Step 2: Result = ${res.toFixed(2)} m`;
                }
                break;

            default:
                origFormula = "Formula Engine";
                reqFormula = "Calculation Engine";
                res = v[0] || 0;
                stepsStr = `Result Valuation = ${res.toFixed(2)}`;
                break;
        }

        document.getElementById('welcomeOverlay').style.display = 'none';
        
        // Cyberpunk Premium Minimalist Fluid Card (Perfect 110% Zoom & Match Layout)
        const resultOut = document.getElementById('resultContent');
        resultOut.style.display = 'block';
        resultOut.innerHTML = `
            <div style="width:100%; box-sizing:border-box; border:1px solid var(--border); border-radius:10px; padding:20px; background:linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(10,15,30,0.6) 100%); backdrop-filter:blur(10px); font-family:inherit; box-shadow:0 8px 32px rgba(0,0,0,0.5);">
                
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(0,212,255,0.15); padding-bottom:10px; margin-bottom:18px;">
                    <h3 style="font-family:'Orbitron'; color:var(--neon); margin:0; font-size:0.85rem; letter-spacing:1.5px; font-weight:700;">⚡ NEXUS CORE PIPELINE</h3>
                    <span style="font-family:'Orbitron'; font-size:0.65rem; color:rgba(0,212,255,0.4); border:1px solid rgba(0,212,255,0.2); padding:2px 6px; border-radius:3px; background:rgba(0,212,255,0.05);">SYS_ACTIVE</span>
                </div>
                
                <div style="margin-bottom: 14px;">
                    <span style="font-family:'Orbitron'; font-size:0.65rem; font-weight:900; color:#00d4ff; background:rgba(0,212,255,0.1); padding:3px 8px; border-radius:3px; letter-spacing:1px; text-transform:uppercase;">Given Parameters</span>
                    <div style="background:rgba(255,255,255,0.01); border:1px solid rgba(255,255,255,0.04); padding:10px 14px; border-radius:6px; font-size:0.85rem; color:#e2e8f0; margin-top:6px;">
                        ${givenHTML}
                    </div>
                </div>

                <div style="margin-bottom: 14px;">
                    <span style="font-family:'Orbitron'; font-size:0.65rem; font-weight:900; color:#9d00ff; background:rgba(157,0,255,0.15); padding:3px 8px; border-radius:3px; letter-spacing:1px; text-transform:uppercase;">Target Objective</span>
                    <div style="background:rgba(157,0,255,0.02); border:1px solid rgba(157,0,255,0.15); padding:10px 14px; border-radius:6px; font-size:0.85rem; color:#fff; margin-top:6px; display:flex; justify-content:space-between;">
                        <span style="color:#8892b0;">Target Parameter</span>
                        <strong style="color:var(--neon); font-weight:600;">${finding} (${targetUnit})</strong>
                    </div>
                </div>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:14px;">
                    <div>
                        <span style="font-family:'Orbitron'; font-size:0.65rem; font-weight:bold; color:rgba(255,255,255,0.4); letter-spacing:0.5px; text-transform:uppercase;">Base Equation</span>
                        <div style="background:rgba(0,0,0,0.2); border:1px solid rgba(255,255,255,0.05); padding:10px; border-radius:6px; font-size:0.8rem; text-align:center; color:#a0aec0; margin-top:4px; font-weight:500;">
                            ${origFormula}
                        </div>
                    </div>
                    <div>
                        <span style="font-family:'Orbitron'; font-size:0.65rem; font-weight:bold; color:var(--neon); letter-spacing:0.5px; text-transform:uppercase;">Derived Setup</span>
                        <div style="background:rgba(0,0,0,0.3); border:1px solid rgba(0,212,255,0.15); padding:10px; border-radius:6px; font-size:0.8rem; text-align:center; color:var(--neon); margin-top:4px; font-weight:600;">
                            ${reqFormula}
                        </div>
                    </div>
                </div>

                <div style="margin-bottom: 18px;">
                    <span style="font-family:'Orbitron'; font-size:0.65rem; font-weight:900; color:#ffb800; background:rgba(255,184,0,0.1); padding:3px 8px; border-radius:3px; letter-spacing:1px; text-transform:uppercase;">Mathematical Steps</span>
                    <div style="background:rgba(0,0,0,0.2); border:1px solid rgba(255,255,255,0.04); padding:12px 14px; border-radius:6px; font-size:0.85rem; line-height:1.6; color:#e2e8f0; margin-top:6px; font-family:monospace; letter-spacing:0.2px;">
                        ${stepsStr}
                    </div>
                </div>

                <div style="background:linear-gradient(90deg, rgba(0,212,255,0.04) 0%, rgba(0,0,0,0) 100%); border-left:3px solid var(--neon); padding:10px 14px; border-radius:0 6px 6px 0; display:flex; flex-direction:column; justify-content:center;">
                    <span style="font-family:'Orbitron'; font-size:0.6rem; color:var(--neon); font-weight:900; letter-spacing:1px; text-transform:uppercase;">Calculated Output</span>
                    <div style="font-family:'Orbitron'; font-size:1.8rem; color:#fff; font-weight:700; margin-top:2px; display:flex; align-items:baseline; letter-spacing:0.5px;">
                        ${res.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                        <span style="font-size:0.85rem; color:var(--neon); font-family:inherit; font-weight:500; margin-left:6px; letter-spacing:0px;">${targetUnit}</span>
                    </div>
                </div>

            </div>
        `;
    } catch(err) {
        alert(`Calculation Engine Error: ${err.message}`);
    }
}
// Global Text-to-Speech Core Engine
function speak(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 0.9;
        window.speechSynthesis.speak(utterance);
    }
}

// Voice Recognition Module Engine (Jarvis Mode)
function startVoice() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("Jarvis Core Protocol requires Google Chrome or Microsoft Edge.");
        return;
    }
    
    const rec = new SpeechRecognition();
    rec.lang = 'en-US';
    rec.interimResults = false;
    
    speak("Nexus systems online. Listening.");

    rec.onresult = (e) => {
        const t = e.results[0][0].transcript.toLowerCase();
        
        // Voice Control Command Mapper
        if (t.includes("speed")) { document.getElementById('serviceId').value = "1"; }
        else if (t.includes("velocity")) { document.getElementById('serviceId').value = "2"; }
        else if (t.includes("acceleration")) { document.getElementById('serviceId').value = "3"; }
        else if (t.includes("force")) { document.getElementById('serviceId').value = "9"; }
        else if (t.includes("momentum")) { document.getElementById('serviceId').value = "11"; }
        else if (t.includes("torque")) { document.getElementById('serviceId').value = "15"; }
        else if (t.includes("work")) { document.getElementById('serviceId').value = "18"; }
        else if (t.includes("kinetic")) { document.getElementById('serviceId').value = "19"; }
        else if (t.includes("potential")) { document.getElementById('serviceId').value = "20"; }
        else if (t.includes("density")) { document.getElementById('serviceId').value = "23"; }
        else if (t.includes("pressure")) { document.getElementById('serviceId').value = "24"; }
        
        updateUI();
        speak(`Switched engine to module.`);
    };

    rec.onerror = () => { alert("Mic input failure. Please allow system microphone rights."); };
    rec.start();
}

// Auto Initialize System Interface on Load
window.onload = updateUI;   