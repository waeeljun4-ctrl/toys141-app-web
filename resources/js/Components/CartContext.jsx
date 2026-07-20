import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'toys141_cart';

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const [items, setItems] = useState(() => {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
        catch { return []; }
    });
    const [open, setOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    // product: {id, name, image, price}, variant: {size, color} (either may be null), qty
    const addItem = useCallback((product, variant = {}, qty = 1) => {
        const size = variant.size || null;
        const color = variant.color || null;
        const key = `${product.id}::${size || ''}::${color || ''}`;

        setItems(prev => {
            const existing = prev.find(i => i.key === key);
            if (existing) return prev.map(i => i.key === key ? { ...i, qty: i.qty + qty } : i);
            return [...prev, {
                key,
                productId: product.id,
                name: product.name,
                image: product.image,
                price: product.price,
                size,
                color,
                qty,
            }];
        });
    }, []);

    const removeItem = useCallback((key) => {
        setItems(prev => prev.filter(i => i.key !== key));
    }, []);

    const changeQty = useCallback((key, qty) => {
        setItems(prev => prev.map(i => i.key === key ? { ...i, qty: Math.max(1, qty) } : i));
    }, []);

    const clear = useCallback(() => setItems([]), []);

    const total = items.reduce((s, i) => s + i.price * i.qty, 0);
    const count = items.reduce((s, i) => s + i.qty, 0);

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, changeQty, clear, total, count, open, setOpen }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within CartProvider');
    return ctx;
}
