import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'toys141_wishlist';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
    const [items, setItems] = useState(() => {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
        catch { return []; }
    });
    const [open, setOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    const has = useCallback((productId) => items.some(i => i.id === productId), [items]);

    const toggle = useCallback((product) => {
        setItems(prev => {
            if (prev.some(i => i.id === product.id)) return prev.filter(i => i.id !== product.id);
            return [...prev, { id: product.id, name: product.name, image: product.image, price: product.price }];
        });
    }, []);

    const remove = useCallback((productId) => {
        setItems(prev => prev.filter(i => i.id !== productId));
    }, []);

    return (
        <WishlistContext.Provider value={{ items, has, toggle, remove, count: items.length, open, setOpen }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const ctx = useContext(WishlistContext);
    if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
    return ctx;
}
