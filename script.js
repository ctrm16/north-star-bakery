"use strict";
// Two data structures keep product labels and validation rules organized.
const categoryLabels = {all: "all products", breads: "breads", pastries: "pastries", cakes: "cakes"};
const validationRules = {
  name: value => value.length >= 2 ? "" : "Please enter your name (at least 2 characters).",
  email: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : "Please enter a valid email address.",
  "pickup-date": value => { if (!value) return "Please choose a pickup date."; const today = new Date(); today.setHours(0,0,0,0); const selected = new Date(value + "T00:00:00"); return selected >= today ? "" : "Pickup date cannot be in the past."; },
  "request-type": value => ["pre-order", "general-question"].includes(value) ? "" : "Please select a request type.",
  "item-details": value => value.length >= 10 ? "" : "Please enter at least 10 characters describing your request."
};
const storageKeys = {category: "northStarCategory", customerName: "northStarCustomerName"};
function readStored(key) {try {return localStorage.getItem(key);} catch {return null;}}
function saveStored(key, value) {try {localStorage.setItem(key,value);} catch { /* Storage may be blocked. */ }}
function setupProductFilter() {
  const selector = document.getElementById("category-filter"); if (!selector) return;
  const saved = readStored(storageKeys.category);
  if (Object.hasOwn(categoryLabels, saved)) selector.value = saved;
  function updateProducts() {
    const selected = selector.value;
    document.querySelectorAll(".product-category").forEach(section => {section.hidden = selected !== "all" && section.dataset.category !== selected;});
    document.getElementById("filter-status").textContent = `Showing ${categoryLabels[selected]}.`;
    saveStored(storageKeys.category, selected);
  }
  selector.addEventListener("change", updateProducts); updateProducts();
}
function showFieldError(field, message) {
  document.getElementById(`${field.id}-error`).textContent = message;
  field.setAttribute("aria-invalid", message ? "true" : "false");
}
function validateField(field) {
  const message = validationRules[field.id](field.value.trim());
  showFieldError(field, message); return !message;
}
function setupForm() {
  const form = document.getElementById("bakery-form"); if (!form) return;
  const name = document.getElementById("name"); name.value = readStored(storageKeys.customerName) || "";
  name.addEventListener("input", () => saveStored(storageKeys.customerName, name.value));
  const fields = Object.keys(validationRules).map(id => document.getElementById(id));
  fields.forEach(field => {field.addEventListener("input", () => {if (field.getAttribute("aria-invalid") === "true") validateField(field);});field.addEventListener("change", () => {if (field.getAttribute("aria-invalid") === "true") validateField(field);});});
  form.addEventListener("submit", event => {
    event.preventDefault();
    const valid = fields.map(validateField).every(Boolean);
    const status = document.getElementById("form-status");
    if (!valid) {status.textContent = "Please correct the highlighted fields before continuing."; fields.find(field => field.getAttribute("aria-invalid") === "true").focus();return;}
    status.textContent = "Your request details are valid. This is a demonstration form; no request has been sent. Please contact the bakery directly to place an order.";
  });
}
document.addEventListener("DOMContentLoaded", () => {setupProductFilter();setupForm();});
