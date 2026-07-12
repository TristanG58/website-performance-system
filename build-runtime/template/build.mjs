#!/usr/bin/env node
/**
 * build.mjs — Alias auf render-all.mjs.
 * Der Renderer faltet die früheren build.mjs-Aufgaben ein
 * (Theme-/Domain-Injektion, robots, sitemap) und rendert zusätzlich die
 * 5 tokenisierten Seiten aus config/site.js. Aufruf identisch: `node build.mjs`.
 */
import "./render-all.mjs";
