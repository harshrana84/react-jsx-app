import AppLayout from '@/layouts/app-layout';
import { Inertia } from '@inertiajs/inertia';
import { Head, Link } from '@inertiajs/react'; // Import Link

const breadcrumbs = [
    {
        title: 'Orders',
        href: '/orders',
    },
];

export default function Index({ orders }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Orders" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div>
                    <h1>Orders</h1>
                    <Link href="/orders/create" className="text-green-700 hover:underline">Create Order</Link>
                    <table border="1" cellPadding="8">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id}>
                                    <td>{order.id}</td>
                                    <td>{order.product}</td>
                                    <td>{order.quantity}</td>
                                    <td>{order.price}</td>
                                    <td>
                                        <Link href={`/orders/${order.id}/edit`} className="text-blue-700 hover:underline mr-2">Edit</Link>
                                        <button onClick={() => Inertia.delete(`/orders/${order.id}`)} className="text-red-700 hover:underline">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
