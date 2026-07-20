import { useState, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import { Button } from '../../Components/UI';
import axios from 'axios';

export default function Products({ products, categories, search }) {
    const [searchTerm, setSearchTerm] = useState(search || '');
    const [list, setList] = useState(products);
    const dragItem = useRef(null);
    const dragOverItem = useRef(null);

    function handleSearch(e) {
        e.preventDefault();
        window.location.href = route('admin.products.index', { search: searchTerm });
    }

    function handleDragStart(index) { dragItem.current = index; }
    function handleDragEnter(index) { dragOverItem.current = index; }

    function handleDrop() {
        const newList = [...list];
        const draggedItem = newList.splice(dragItem.current, 1)[0];
        newList.splice(dragOverItem.current, 0, draggedItem);
        setList(newList);
        axios.post(route('admin.products.reorder'), { order: newList.map(p => p.id) });
    }

    function destroy(product) {
        if (!confirm(`حذف "${product.name}"؟`)) return;
        router.delete(route('admin.products.destroy', product.id));
    }

    return (
        <>
            <Head title="المنتجات" />
            <AdminLayout title="📦 المنتجات">
                <div className="flex items-center justify-between mb-5 gap-3">
                    <form onSubmit={handleSearch} className="flex-1 max-w-sm">
                        <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                            placeholder="ابحث عن منتج..."
                            className="w-full border border-cream-3 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:border-accent" />
                    </form>
                    <Link href={route('admin.products.create')}>
                        <Button variant="accent">➕ إضافة منتج</Button>
                    </Link>
                </div>

                <div className="bg-white rounded-2xl border border-cream-3 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-cream-2 text-muted text-xs">
                            <tr>
                                <th className="p-3 text-right w-8"></th>
                                <th className="p-3 text-right">المنتج</th>
                                <th className="p-3 text-right">الصنف</th>
                                <th className="p-3 text-right">الماركة</th>
                                <th className="p-3 text-right">السعر</th>
                                <th className="p-3 text-right">الحالة</th>
                                <th className="p-3 text-right"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.map((p, i) => (
                                <tr key={p.id}
                                    draggable
                                    onDragStart={() => handleDragStart(i)}
                                    onDragEnter={() => handleDragEnter(i)}
                                    onDragEnd={handleDrop}
                                    onDragOver={e => e.preventDefault()}
                                    className="border-t border-cream-3 hover:bg-cream-2/40 cursor-move">
                                    <td className="p-3 text-muted">⠿</td>
                                    <td className="p-3 font-bold text-ink">
                                        <div className="flex items-center gap-2">
                                            {p.image
                                                ? <img src={`/storage/${p.image}`} className="w-8 h-8 rounded-lg object-cover" />
                                                : <span className="w-8 h-8 rounded-lg bg-cream-2 flex items-center justify-center">🧸</span>}
                                            {p.name}
                                            {p.badge && <span className="text-xs bg-accent-pale text-accent px-1.5 py-0.5 rounded-full">{p.badge}</span>}
                                            {!p.is_active && <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">مخفي</span>}
                                        </div>
                                    </td>
                                    <td className="p-3 text-muted">{p.category?.name}</td>
                                    <td className="p-3 text-muted">{p.brand?.name || '—'}</td>
                                    <td className="p-3 font-bold">
                                        {p.compare_price && <span className="text-xs text-muted line-through ml-1">{p.compare_price}₪</span>}
                                        {p.price}₪
                                    </td>
                                    <td className="p-3">{p.is_active ? '✅' : '❌'}</td>
                                    <td className="p-3 flex gap-2 justify-end">
                                        <Link href={route('admin.products.edit', p.id)} className="text-accent hover:text-accent-dark font-bold">تعديل</Link>
                                        <button onClick={() => destroy(p)} className="text-red-400 hover:text-red-600 font-bold">حذف</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </AdminLayout>
        </>
    );
}
