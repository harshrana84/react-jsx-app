import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react'; // Import Link

const breadcrumbs = [
    {
        title: 'On Hand',
        href: '/stocks',
    },
];

const fields = [
    'id',
    'stock_id',
    'availability',
    'report_no',
    'shape',
    'carat',
    'color',
    'clarity',
    'cut',
    'polish',
    'symmetry',
    'fluorescence',
    'rap_price',
    'discount',
    'per_ct',
    'total',
    'sale_discount_percent',
    'sale_per_ct',
    'sale_total',
    'hold_name',
    'h_and_a',
    'remark',
    'lab',
    'cut_no',
    'country',
    'state',
    'city',
    'bgm',
    'eye_clean',
    'treatment',
    'growth_type',
    'company',
    'laser_inscription',
    'measurement',
    'table',
    'depth',
    'cr_ang',
    'cr_ht',
    'pv_ang',
    'pv_ht',
    'ratio',
    'girdle%',
    'length',
    'width',
    'height',
    'girdle_condition',
    'culet',
    'video_link',
    'image_link',
    'cert_pdf_link',
    'origin',
    'digital_report',
    'r1',
    'r2',
    'seagoma',
    'full_fancy_color',
    'fancy_color',
    'fancy_overtone',
    'fancy_intensity',
    'comment',
    'export_inv_no',
    'export_total_usd',
    'export_date',
    'import_date',
    'created_at',
    'updated_at',
];

function formatHeader(field) {
    // Convert snake_case or camelCase to readable header
    return field
        .replace(/_/g, ' ')
        .replace(/%/g, ' %')
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function Index({ stocks }) {
    console.log('stocks', stocks);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Orders" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="">
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className=" min-w-max table-auto divide-y divide-gray-800">
                            <thead className="bg-indigo-700">
                                <tr>
                                    {fields.map((field) => (
                                        <th key={field} className="px-3 py-2 text-left text-xs font-medium whitespace-nowrap text-white uppercase">
                                            {formatHeader(field)}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {stocks.map((stock) => (
                                    <tr key={stock.id} className="hover:bg-purple-50">
                                        {fields.map((field) => {
                                            if (field === 'image_link') return null; // skip image_link here

                                            let value = stock[field];

                                            // Fix for 'girdle%' property with % sign in key
                                            if (field === 'girdle%') {
                                                value = stock['girdle%'] ?? stock['girdle_percent'] ?? '';
                                            }

                                            // Fallback for empty/null values
                                            if (value === null || value === undefined || value === '') {
                                                value = '-';
                                            }

                                            // Render stock_id with image after it
                                            if (field === 'stock_id') {
                                                return (
                                                    <>
                                                        <td className="px-3 py-2 font-semibold whitespace-nowrap">{value}</td>
                                                        <td className="px-3 py-2 whitespace-nowrap">
                                                            {stock.image_link ? (
                                                                <img
                                                                    src={stock.image_link}
                                                                    alt={stock.stock_id}
                                                                    className="h-12 w-12 rounded object-cover"
                                                                />
                                                            ) : (
                                                                '-'
                                                            )}
                                                        </td>
                                                    </>
                                                );
                                            }

                                            // Render links nicely for certain fields
                                            if (field === 'video_link' || field === 'cert_pdf_link') {
                                                return (
                                                    <td key={field} className="px-3 py-2 whitespace-nowrap">
                                                        {value !== '-' ? (
                                                            <a
                                                                href={value}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-600 underline"
                                                            >
                                                                {formatHeader(field).replace(' Link', '')}
                                                            </a>
                                                        ) : (
                                                            '-'
                                                        )}
                                                    </td>
                                                );
                                            }

                                            return (
                                                <td key={field} className="px-3 py-2 whitespace-nowrap">
                                                    {value}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
