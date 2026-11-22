import type { APIRoute } from 'astro';
import {projects} from '../data/projects';
import {getPosts} from '../data/blog';
export const GET:APIRoute=async()=>{const posts=await getPosts();return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['','work/','services/','about/','contact/','resume/','aviation/','blog/',...posts.map(p=>`blog/${p.id}/`),...projects.map(p=>`work/${p.id}/`)].map(path=>`<url><loc>https://marvpacinabao.com/${path}</loc></url>`).join('')}</urlset>`,{headers:{'Content-Type':'application/xml'}});};
