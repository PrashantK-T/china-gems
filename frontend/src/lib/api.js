import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
const API = `${BACKEND_URL}/api`;

export const api = axios.create({
    baseURL: API,
    headers: { 'Content-Type': 'application/json' },
});

// Attach admin token if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('hg_admin_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Public
export const fetchGemstones = (params = {}) => api.get('/gemstones', { params }).then((r) => r.data);
export const fetchGemstone = (id) => api.get(`/gemstones/${id}`).then((r) => r.data);
export const fetchJewelry = (params = {}) => api.get('/jewelry', { params }).then((r) => r.data);
export const fetchJewelryItem = (id) => api.get(`/jewelry/${id}`).then((r) => r.data);
export const fetchOffers = () => api.get('/offers').then((r) => r.data);
export const fetchTestimonials = () => api.get('/testimonials').then((r) => r.data);
export const fetchCertifications = () => api.get('/certifications').then((r) => r.data);
export const fetchContactInfo = () => api.get('/contact-info').then((r) => r.data);
export const submitInquiry = (data) => api.post('/inquiries', data).then((r) => r.data);

// Admin
export const adminLogin = (email, password) =>
    api.post('/admin/login', { email, password }).then((r) => r.data);
export const adminMe = () => api.get('/admin/me').then((r) => r.data);
export const adminStats = () => api.get('/admin/stats').then((r) => r.data);

export const adminCreateGemstone = (data) => api.post('/admin/gemstones', data).then((r) => r.data);
export const adminUpdateGemstone = (id, data) => api.put(`/admin/gemstones/${id}`, data).then((r) => r.data);
export const adminDeleteGemstone = (id) => api.delete(`/admin/gemstones/${id}`).then((r) => r.data);

export const adminCreateJewelry = (data) => api.post('/admin/jewelry', data).then((r) => r.data);
export const adminUpdateJewelry = (id, data) => api.put(`/admin/jewelry/${id}`, data).then((r) => r.data);
export const adminDeleteJewelry = (id) => api.delete(`/admin/jewelry/${id}`).then((r) => r.data);

export const adminListInquiries = (status) =>
    api.get('/admin/inquiries', { params: status ? { status } : {} }).then((r) => r.data);
export const adminUpdateInquiry = (id, status) =>
    api.patch(`/admin/inquiries/${id}`, { status }).then((r) => r.data);
export const adminDeleteInquiry = (id) => api.delete(`/admin/inquiries/${id}`).then((r) => r.data);

export const adminCreateOffer = (data) => api.post('/admin/offers', data).then((r) => r.data);
export const adminUpdateOffer = (id, data) => api.put(`/admin/offers/${id}`, data).then((r) => r.data);
export const adminDeleteOffer = (id) => api.delete(`/admin/offers/${id}`).then((r) => r.data);

export default api;
