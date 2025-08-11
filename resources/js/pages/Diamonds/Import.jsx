// resources/js/pages/Diamonds/Import.jsx
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';

const breadcrumbs = [
    {
        title: 'Upload Stock',
        href: '/diamonds/import',
    },
];

export default function Import() {
    const form = useForm({ file: null });

    function handleChange(e) {
        form.setData('file', e.target.files[0]);
    }

    function handleSubmit(e) {
        e.preventDefault();
        form.post(route('diamonds.import'), {
            forceFormData: true,
            onSuccess: () => form.reset('file'),
        });
    }

    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Upload Stock" />
                <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                    <div>
                        <h1>Upload Stock</h1>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input type="file" accept=".xlsx,.xls,.csv" onChange={handleChange} className="block w-full" />
                            {form.errors.file && <p className="text-red-600">{form.errors.file}</p>}
                            <button type="submit" disabled={form.processing} className="w-full rounded bg-blue-600 py-2 text-white">
                                {form.processing ? 'Importing…' : 'Upload & Import'}
                            </button>
                        </form>
                    </div>
                </div>
            </AppLayout>
        </>
    );
}
