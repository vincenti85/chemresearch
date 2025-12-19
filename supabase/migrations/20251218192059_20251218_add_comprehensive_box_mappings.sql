/*
  # Add Comprehensive AP Chemistry Mappings for All Dashboard Boxes
  
  This migration adds detailed AP Chemistry curriculum mappings to cover every 
  monitoring box, calculation tool, and environmental metric displayed in the 
  Alabama Environmental Justice Dashboard.
  
  ## Additional Mappings Added
  
  These mappings provide chemistry connections for:
  - Filter Life & Adsorption - Unit 3 (Intermolecular Forces)
  - EPA Safety Limits - Unit 8 (Acids & Bases)
  - Industrial Emissions - Unit 4 (Chemical Reactions)
  - Photochemical Smog - Unit 5 (Kinetics)
  - Acid Rain Formation - Unit 4 (Acids & Bases)
  - Redox in Pollution - Unit 9 (Redox Reactions)
  - Ozone Formation - Unit 5 (Kinetics)
  - VOCs (Volatile Organic Compounds) - Unit 3 (IMF)
  - Heavy Metals - Unit 1 (Atomic Structure)
  - pH in Water Quality - Unit 8 (Acids & Bases)
  - Dissolved Oxygen - Unit 6 (Equilibrium)
  - Carbon Capture Technology - Unit 6 (Equilibrium)
  - Greenhouse Gas Effects - Unit 5 (Thermochemistry)
  - Atmospheric Chemistry - Unit 2 (Bonding)
  
  Each mapping connects real environmental monitoring to specific AP Chemistry 
  learning objectives and content standards.
*/

INSERT INTO curriculum_mapping (unit_code, topic_title, popup_content, target_metric, chemistry_concept)
VALUES
  (
    'Unit 3',
    'Adsorption and Activated Carbon Filtration',
    'Activated carbon filters remove PFAS and other contaminants through adsorption—molecules adhering to the carbon surface via intermolecular forces (London dispersion forces, dipole-dipole). The porous structure of activated carbon provides massive surface area (1000+ m²/g). Filter capacity depends on the strength of intermolecular attractions between contaminants and carbon surface. As filters saturate, fewer binding sites remain available.',
    'filter_life',
    'Intermolecular Forces'
  ),
  (
    'Unit 8',
    'Toxicology and EPA Exposure Limits',
    'EPA safety limits are based on dose-response relationships and chemical toxicity. Concentration units (ppb, ppt, ppm) represent parts per billion/trillion/million. For benzene, the EPA limit of 5 ppb in drinking water reflects carcinogenic risk assessment. Understanding molarity, concentration calculations, and dilution principles is essential for interpreting these regulatory standards.',
    'epa_limit',
    'Concentration'
  ),
  (
    'Unit 4',
    'Industrial Emissions and Combustion Chemistry',
    'Industrial facilities release pollutants through combustion reactions. Complete combustion: C₈H₁₈ + 12.5O₂ → 8CO₂ + 9H₂O. Incomplete combustion produces CO, soot, and unburned hydrocarbons. Steel production and coke plants undergo redox reactions releasing benzene and other aromatics. Stoichiometry allows calculation of emissions based on fuel consumption and process conditions.',
    'emissions',
    'Stoichiometry'
  ),
  (
    'Unit 5',
    'Photochemical Smog Formation',
    'Ground-level ozone forms through photochemical reactions: NO₂ + UV light → NO + O; then O + O₂ → O₃. This process requires sunlight, making ozone concentrations peak in afternoons. VOCs accelerate the cycle by reacting with OH radicals. Temperature affects reaction rates according to the Arrhenius equation—hot summer days in Alabama worsen photochemical smog.',
    'ozone',
    'Photochemistry'
  ),
  (
    'Unit 8',
    'Acid Rain and Atmospheric Acid-Base Chemistry',
    'Acid rain forms when SO₂ and NO₂ dissolve in atmospheric water: SO₂ + H₂O → H₂SO₃ (sulfurous acid); 2NO₂ + H₂O → HNO₃ + HNO₂. Further oxidation produces H₂SO₄ (sulfuric acid). Normal rain pH is 5.6 due to dissolved CO₂; acid rain can reach pH 4.0 or lower. Understanding pH calculations and acid strength helps predict environmental damage to lakes, forests, and buildings.',
    'acid_rain',
    'Acids and Bases'
  ),
  (
    'Unit 9',
    'Redox Reactions in Pollution Control',
    'Many air pollutants undergo redox transformations. Catalytic converters use platinum/palladium catalysts for redox reactions: 2CO + O₂ → 2CO₂ (oxidation); 2NO → N₂ + O₂ (reduction). In water treatment, chlorine oxidizes contaminants: Cl₂ + H₂O → HOCl + HCl. Iron oxidation creates rust-colored water: Fe²⁺ → Fe³⁺ + e⁻. Assigning oxidation states helps track electron transfer.',
    'redox',
    'Oxidation-Reduction'
  ),
  (
    'Unit 3',
    'Volatile Organic Compounds (VOCs)',
    'VOCs like benzene, toluene, and formaldehyde evaporate easily due to weak intermolecular forces. Molecules with strong London dispersion forces (larger, more electrons) have higher boiling points. Benzene (C₆H₆) is aromatic with delocalized π electrons, making it stable but volatile. Temperature increases vapor pressure exponentially (Clausius-Clapeyron equation), explaining why VOC emissions surge on hot days.',
    'voc',
    'Vapor Pressure'
  ),
  (
    'Unit 1',
    'Heavy Metal Contamination',
    'Heavy metals (lead, mercury, cadmium, arsenic) are toxic at low concentrations due to their atomic properties. Lead (Pb, atomic number 82) displaces calcium in bones because of similar ionic radii. Mercury exists in multiple oxidation states (Hg⁰, Hg⁺, Hg²⁺) with different toxicities. Electron configuration determines chemical behavior—transition metals form colored compounds and multiple oxidation states.',
    'heavy_metals',
    'Periodic Trends'
  ),
  (
    'Unit 8',
    'pH and Water Quality Standards',
    'pH measures hydrogen ion concentration: pH = -log[H⁺]. Drinking water pH should be 6.5-8.5. Low pH (<6) corrodes pipes, leaching lead and copper. High pH (>8.5) causes scaling. pH affects chemical speciation—at low pH, metals like Pb²⁺ are more soluble. Buffer systems (carbonate/bicarbonate) resist pH changes. Understanding Ka, Kb, and Henderson-Hasselbalch equation explains natural water chemistry.',
    'ph',
    'pH Calculations'
  ),
  (
    'Unit 6',
    'Dissolved Oxygen and Aquatic Equilibrium',
    'Dissolved oxygen (DO) in water follows Henry''s Law: [O₂(aq)] = kH × P(O₂). Warmer water holds less oxygen—temperature inversely affects gas solubility. Aquatic life requires DO >5 mg/L. Organic pollution depletes oxygen through aerobic decomposition. Eutrophication creates oxygen-depleted "dead zones." Le Chatelier''s Principle predicts how temperature, pressure, and biological activity affect DO equilibrium.',
    'dissolved_oxygen',
    'Gas Solubility'
  ),
  (
    'Unit 6',
    'Carbon Capture and Sequestration Chemistry',
    'Carbon capture technology removes CO₂ from flue gases using chemical absorption. Amines (like MEA) react reversibly with CO₂: 2RNH₂ + CO₂ ⇌ RNHCOO⁻ + RNH₃⁺. Heating regenerates the amine and releases pure CO₂ for geological storage. This equilibrium-driven process demonstrates Le Chatelier''s Principle—temperature changes shift the equilibrium to capture or release CO₂ efficiently.',
    'carbon_capture',
    'Chemical Equilibrium'
  ),
  (
    'Unit 5',
    'Greenhouse Gases and Thermochemistry',
    'CO₂ and CH₄ trap infrared radiation through molecular vibrations. Molecules with three or more atoms absorb IR when their dipole moment changes during vibration. CO₂ has asymmetric stretch vibrations that absorb at specific wavelengths. Bond energy and molecular structure determine absorption spectra. Thermochemistry explains Earth''s energy balance—greenhouse gases increase atmospheric enthalpy by trapping heat.',
    'greenhouse_gas',
    'Thermochemistry'
  ),
  (
    'Unit 2',
    'Atmospheric Chemistry and Molecular Structure',
    'Earth''s atmosphere is 78% N₂, 21% O₂, 0.04% CO₂, with trace gases. N₂ has a triple bond (N≡N) with bond energy of 941 kJ/mol, making it highly unreactive. O₂ is paramagnetic with two unpaired electrons in π* orbitals (molecular orbital theory). Atmospheric pollutants like NO, NO₂, and O₃ have different molecular geometries and bond strengths, affecting their reactivity and atmospheric lifetime.',
    'atmospheric',
    'Molecular Structure'
  ),
  (
    'Unit 4',
    'Particulate Matter and Aerosol Chemistry',
    'PM2.5 particles form through nucleation (gas→particle) and coagulation. Primary particles are emitted directly (soot, dust). Secondary particles form from atmospheric reactions: SO₂ + oxidants → sulfate aerosols; NOx + VOCs → nitrate aerosols. Particle size affects lung deposition—PM2.5 reaches deep alveoli. Chemical composition (sulfates, nitrates, organics, metals) determines health impacts and optical properties.',
    'pm25',
    'Phase Changes'
  )
ON CONFLICT DO NOTHING;