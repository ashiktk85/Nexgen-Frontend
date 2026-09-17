import { Country, State } from "country-state-city";

export function getCountryName(code) {
  if (!code) return "";
  if (code.length > 2) return code;
  return Country.getCountryByCode(code)?.name || code;
}

export function getStateName(countryCode, stateCode) {
  if (!stateCode) return "";
  if (countryCode) {
    const found = State.getStateByCodeAndCountry(stateCode, countryCode);
    if (found?.name) return found.name;
  }
  // Custom / free-text states are stored by name (or longer codes)
  return stateCode;
}

export function formatJobLocation(job, { includeCountry = true } = {}) {
  if (!job) return "";
  const city = job.city;
  const state = getStateName(job.country, job.state);
  const country = includeCountry ? getCountryName(job.country) : "";
  return [city, state, country].filter(Boolean).join(", ");
}
