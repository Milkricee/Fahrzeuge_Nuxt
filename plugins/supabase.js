import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// Supabase-Client initialisieren
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Fehlerbehandlung für alle Supabase-Abfragen
export const handleSupabaseRequest = async (callback) => {
  try {
    const result = await callback();
    if (result.error) {
      console.error("Supabase Error:", result.error.message); // Fehler in der Konsole anzeigen
      throw new Error(result.error.message); // Fehler weiterwerfen
    }
    return result.data;
  } catch (error) {
    console.error("Unerwarteter Fehler:", error.message); // Unerwarteten Fehler loggen
    throw error; // Fehler weitergeben, falls im UI benötigt
  }
};

// Fahrzeuge abrufen
export const fetchVehicles = async () => {
  return await handleSupabaseRequest(() =>
    supabase.from('fahrzeuge').select('*').order('marke', { ascending: true })
  );
};

// Versicherungen abrufen
export const fetchInsurances = async () => {
  return await handleSupabaseRequest(() =>
    supabase.from('versicherungen').select('*').order('beginn', { ascending: true })
  );
};

// Fahrzeug hinzufügen
export const addVehicle = async (vehicle) => {
  return await handleSupabaseRequest(() =>
    supabase.from('fahrzeuge').insert(vehicle)
  );
};

// Versicherung hinzufügen
export const addInsurance = async (insurance) => {
  return await handleSupabaseRequest(() =>
    supabase.from('versicherungen').insert(insurance)
  );
};

// Versicherung aktualisieren
export const updateInsurance = async (insuranceId, updatedData) => {
  return await handleSupabaseRequest(() =>
    supabase.from('versicherungen').update(updatedData).eq('id', insuranceId)
  );
};

// Fahrzeug löschen
export const deleteVehicle = async (fin) => {
  return await handleSupabaseRequest(() =>
    supabase.from('fahrzeuge').delete().eq('fin', fin)
  );
};

// Versicherung löschen
export const deleteInsurance = async (insuranceId) => {
  return await handleSupabaseRequest(() =>
    supabase.from('versicherungen').delete().eq('id', insuranceId)
  );
};

// Versicherung-Fahrzeug-Zuordnung hinzufügen
export const addInsuranceVehicleAssociation = async (associations) => {
  return await handleSupabaseRequest(() =>
    supabase.from('versicherung_fahrzeuge').insert(associations)
  );
};

// Versicherung-Fahrzeug-Zuordnung löschen
export const deleteInsuranceVehicleAssociation = async (insuranceId) => {
  return await handleSupabaseRequest(() =>
    supabase.from('versicherung_fahrzeuge').delete().eq('versicherung_id', insuranceId)
  );
};

// Versicherung-Fahrzeug-Zuordnungen abrufen
export const fetchInsuranceVehicleAssociations = async (insuranceId) => {
  return await handleSupabaseRequest(() =>
    supabase
      .from('versicherung_fahrzeuge')
      .select('fahrzeug_fin, fahrzeuge(modell, kennzeichen)')
      .eq('versicherung_id', insuranceId)
  );
};

// Fehlerbehandlung in Nuxt-Plugin einbinden
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('supabase', supabase);
});
