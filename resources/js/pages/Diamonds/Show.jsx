import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function Show({ diamond }) {
    const breadcrumbs = [
        {
            title: `Diamonds`,
            href: '/diamonds',
        },
        {
            title: `${diamond.stock_id}`,
            href: '/orders',
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Diamond #${diamond.stock_id}`} />
            <div className="space-y-4 p-4">
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Image + Video */}
                    <div className="rounded-lg bg-gray-800 p-4 shadow-lg">
                        <img src={diamond.image_link} alt={diamond.stock_id} className="w-full rounded-lg" />
                        {diamond.video_link && (
                            <div className="mt-2">
                                <iframe src={diamond.video_link} className="aspect-video w-full rounded-lg" allowFullScreen></iframe>
                            </div>
                        )}
                        {diamond.cert_pdf_link && (
                            <div className="rounded-lg bg-gray-800 p-4 shadow-lg">
                                <iframe
                                    src={diamond.cert_pdf_link}
                                    className="w-full"
                                    height="500px"
                                    style={{ border: 'none' }}
                                    title="Certificate PDF"
                                ></iframe>
                            </div>
                        )}
                    </div>

                    {/* Combined Table for General Info, Pricing, and Measurements */}
                    <div className="rounded-lg sticky top-0">
                        {/* Summary Bar */}
                        <div className="grid grid-cols-2 gap-1 md:grid-cols-4 mb-10">
                            <div className="rounded bg-emerald-900 p-3 text-center shadow-lg">
                                <p className="text-xs text-zinc-300">Carat</p>
                                <p className="text-xl font-semibold text-white">{diamond.carat}</p>
                            </div>
                            <div className="rounded bg-emerald-900 p-3 text-center shadow-lg">
                                <p className="text-xs text-zinc-300">Color</p>
                                <p className="text-xl font-semibold text-white">{diamond.color}</p>
                            </div>
                            <div className="rounded bg-emerald-900 p-3 text-center shadow-lg">
                                <p className="text-xs text-zinc-300">Clarity</p>
                                <p className="text-xl font-semibold text-white">{diamond.clarity}</p>
                            </div>
                            <div className="rounded bg-emerald-900 p-3 text-center shadow-lg">
                                <p className="text-xs text-zinc-300">Sale Total</p>
                                <p className="text-xl font-semibold text-white">${Number(diamond.sale_total).toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr>
                                        <th className="border-b border-gray-700 px-2 py-1 text-left text-sm text-gray-400">Attribute</th>
                                        <th className="border-b border-gray-700 px-2 py-1 text-left text-sm text-gray-400">Value</th>
                                        <th className="border-b border-gray-700 px-2 py-1 text-left text-sm text-gray-400">Attribute</th>
                                        <th className="border-b border-gray-700 px-2 py-1 text-left text-sm text-gray-400">Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="px-2 py-1 text-sm text-gray-400">Stock ID</td>
                                        <td className="px-2 py-1 text-sm text-white">{diamond.stock_id}</td>
                                        <td className="px-2 py-1 text-sm text-gray-400">Rap Price</td>
                                        <td className="px-2 py-1 text-sm text-white">${diamond.rap_price}</td>
                                    </tr>
                                    <tr>
                                        <td className="px-2 py-1 text-sm text-gray-400">Report No</td>
                                        <td className="px-2 py-1 text-sm text-white">{diamond.report_no}</td>
                                        <td className="px-2 py-1 text-sm text-gray-400">Discount</td>
                                        <td className="px-2 py-1 text-sm text-white">{diamond.discount}%</td>
                                    </tr>
                                    <tr>
                                        <td className="px-2 py-1 text-sm text-gray-400">Shape</td>
                                        <td className="px-2 py-1 text-sm text-white">{diamond.shape}</td>
                                        <td className="px-2 py-1 text-sm text-gray-400">Per Carat</td>
                                        <td className="px-2 py-1 text-sm text-white">${diamond.per_ct}</td>
                                    </tr>
                                    <tr>
                                        <td className="px-2 py-1 text-sm text-gray-400">Cut</td>
                                        <td className="px-2 py-1 text-sm text-white">{diamond.cut || '—'}</td>
                                        <td className="px-2 py-1 text-sm text-gray-400">Total</td>
                                        <td className="px-2 py-1 text-sm text-white">${diamond.total}</td>
                                    </tr>
                                    <tr>
                                        <td className="px-2 py-1 text-sm text-gray-400">Polish</td>
                                        <td className="px-2 py-1 text-sm text-white">{diamond.polish}</td>
                                        <td className="px-2 py-1 text-sm text-gray-400">Sale Discount %</td>
                                        <td className="px-2 py-1 text-sm text-white">{diamond.sale_discount_percent}%</td>
                                    </tr>
                                    <tr>
                                        <td className="px-2 py-1 text-sm text-gray-400">Symmetry</td>
                                        <td className="px-2 py-1 text-sm text-white">{diamond.symmetry}</td>
                                        <td className="px-2 py-1 text-sm text-gray-400">Sale Per Carat</td>
                                        <td className="px-2 py-1 text-sm text-white">${diamond.sale_per_ct}</td>
                                    </tr>
                                    <tr>
                                        <td className="px-2 py-1 text-sm text-gray-400">Fluorescence</td>
                                        <td className="px-2 py-1 text-sm text-white">{diamond.fluorescence}</td>
                                        <td className="px-2 py-1 text-sm text-gray-400">Sale Total</td>
                                        <td className="px-2 py-1 text-sm text-white">${diamond.sale_total}</td>
                                    </tr>
                                    <tr>
                                        <td className="px-2 py-1 text-sm text-gray-400">Origin</td>
                                        <td className="px-2 py-1 text-sm text-white">{diamond.origin}</td>
                                        <td className="px-2 py-1 text-sm text-gray-400">Measurement</td>
                                        <td className="px-2 py-1 text-sm text-white">{diamond.measurement}</td>
                                    </tr>
                                    <tr>
                                        <td className="px-2 py-1 text-sm text-gray-400">Lab</td>
                                        <td className="px-2 py-1 text-sm text-white">{diamond.lab}</td>
                                        <td className="px-2 py-1 text-sm text-gray-400">Table</td>
                                        <td className="px-2 py-1 text-sm text-white">{diamond.table}%</td>
                                    </tr>
                                    <tr>
                                        <td className="px-2 py-1 text-sm text-gray-400">Eye Clean</td>
                                        <td className="px-2 py-1 text-sm text-white">{diamond.eye_clean}</td>
                                        <td className="px-2 py-1 text-sm text-gray-400">Depth</td>
                                        <td className="px-2 py-1 text-sm text-white">{diamond.depth}%</td>
                                    </tr>
                                    <tr>
                                        <td className="px-2 py-1 text-sm text-gray-400">Treatment</td>
                                        <td className="px-2 py-1 text-sm text-white">{diamond.treatment}</td>
                                        <td className="px-2 py-1 text-sm text-gray-400">Crown Angle</td>
                                        <td className="px-2 py-1 text-sm text-white">{diamond.cr_ang}</td>
                                    </tr>
                                    <tr>
                                        <td className="px-2 py-1 text-sm text-gray-400"></td>
                                        <td className="px-2 py-1 text-sm text-white"></td>
                                        <td className="px-2 py-1 text-sm text-gray-400">Crown Height</td>
                                        <td className="px-2 py-1 text-sm text-white">{diamond.cr_ht}%</td>
                                    </tr>
                                    <tr>
                                        <td className="px-2 py-1 text-sm text-gray-400"></td>
                                        <td className="px-2 py-1 text-sm text-white"></td>
                                        <td className="px-2 py-1 text-sm text-gray-400">Pavilion Angle</td>
                                        <td className="px-2 py-1 text-sm text-white">{diamond.pv_ang}</td>
                                    </tr>
                                    <tr>
                                        <td className="px-2 py-1 text-sm text-gray-400"></td>
                                        <td className="px-2 py-1 text-sm text-white"></td>
                                        <td className="px-2 py-1 text-sm text-gray-400">Pavilion Height</td>
                                        <td className="px-2 py-1 text-sm text-white">{diamond.pv_ht}%</td>
                                    </tr>
                                    <tr>
                                        <td className="px-2 py-1 text-sm text-gray-400"></td>
                                        <td className="px-2 py-1 text-sm text-white"></td>
                                        <td className="px-2 py-1 text-sm text-gray-400">Ratio</td>
                                        <td className="px-2 py-1 text-sm text-white">{diamond.ratio}</td>
                                    </tr>
                                    <tr>
                                        <td className="px-2 py-1 text-sm text-gray-400"></td>
                                        <td className="px-2 py-1 text-sm text-white"></td>
                                        <td className="px-2 py-1 text-sm text-gray-400">Girdle Percent</td>
                                        <td className="px-2 py-1 text-sm text-white">{diamond.girdle_percent}%</td>
                                    </tr>
                                    <tr>
                                        <td className="px-2 py-1 text-sm text-gray-400"></td>
                                        <td className="px-2 py-1 text-sm text-white"></td>
                                        <td className="px-2 py-1 text-sm text-gray-400">Girdle Condition</td>
                                        <td className="px-2 py-1 text-sm text-white">{diamond.girdle_condition}</td>
                                    </tr>
                                    <tr>
                                        <td className="px-2 py-1 text-sm text-gray-400"></td>
                                        <td className="px-2 py-1 text-sm text-white"></td>
                                        <td className="px-2 py-1 text-sm text-gray-400">Culet</td>
                                        <td className="px-2 py-1 text-sm text-white">{diamond.culet}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
