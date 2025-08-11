import { Inertia } from '@inertiajs/inertia';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

const breadcrumbs = [
    {
        title: 'Create Orders',
        href: 'orders/orders',
    },
];

export default function Create() {
    const [values, setValues] = useState({ product: '', quantity: '', price: '' });

    function handleChange(e) {
        setValues({ ...values, [e.target.name]: e.target.value });
    }

    function handleSubmit(e) {
        e.preventDefault();
        Inertia.post('/orders', values);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Orders" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div>
                    <h1>Create Order</h1>
                    <form onSubmit={handleSubmit}>
                        <input name="product" value={values.product} onChange={handleChange} placeholder="Product" />
                        <br />
                        <input name="quantity" value={values.quantity} onChange={handleChange} placeholder="Quantity" type="number" />
                        <br />
                        <input name="price" value={values.price} onChange={handleChange} placeholder="Price" type="number" step="0.01" />
                        <br />
                        <button type="submit" className='bg-green-800 p-4'>Save</button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
