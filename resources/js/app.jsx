import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { route } from 'ziggy-js';
import axios from 'axios';
import '../css/app.css';

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
if (csrfToken) axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;

createInertiaApp({
    title: (title) => `${title} — TOYS 141`,
    resolve: (name) => {
        const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });
        return pages[`./Pages/${name}.jsx`];
    },
    setup({ el, App, props }) {
        window.route = (name, params, absolute) =>
            route(name, params, absolute, props.initialPage.props.ziggy);
        createRoot(el).render(<App {...props} />);
    },
    progress: {
        color: '#B67D62',
    },
});
