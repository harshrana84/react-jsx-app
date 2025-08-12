'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs = [{ title: 'Party Master List', href: '/stocks' }];

export default function PartiesIndex() {
    const { parties, success } = usePage().props;

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingParty, setEditingParty] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
    const [sortedParties, setSortedParties] = useState(parties || []);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        address: '',
        state: '',
        pan: '',
        gst: '',
    });

    useEffect(() => {
        setSortedParties(
            [...parties].sort((a, b) => {
                const aVal = a[sortConfig.key] || '';
                const bVal = b[sortConfig.key] || '';
                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            }),
        );
    }, [parties, sortConfig]);

    useEffect(() => {
        if (success) {
            toast.success(success, { duration: 3000 });
        }
    }, [success]);

    const openAddDialog = () => {
        setEditingParty(null);
        reset();
        setDialogOpen(true);
    };

    const openEditDialog = (party) => {
        setEditingParty(party);
        setData({
            name: party.name || '',
            address: party.address || '',
            state: party.state || '',
            pan: party.pan || '',
            gst: party.gst || '',
        });
        setDialogOpen(true);
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
        setSortConfig({ key, direction });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingParty) {
            put(`/parties/${editingParty.id}`, {
                onSuccess: () => {
                    toast.success('Party updated!');
                    setDialogOpen(false);
                },
                onError: () => toast.error('Failed to update'),
            });
        } else {
            post('/parties', {
                onSuccess: () => {
                    toast.success('Party created!');
                    setDialogOpen(false);
                },
                onError: () => toast.error('Failed to create'),
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure?')) {
            router.delete(`/parties/${id}`, {
                onSuccess: () => toast.success('Party deleted!'),
                onError: () => toast.error('Delete failed'),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Orders" />
            <div className="bg-background text-foreground min-h-screen p-6 transition-colors">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Party List</h1>
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="default" onClick={openAddDialog} className="flex cursor-pointer items-center">
                                <Plus size={16} className="mr-2" /> Add Party
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg sm:p-6">
                            <DialogHeader>
                                <DialogTitle>{editingParty ? 'Edit Party' : 'Add New Party'}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                                {[
                                    { id: 'name', label: 'Name *', required: true },
                                    { id: 'address', label: 'Address' },
                                    { id: 'state', label: 'State' },
                                    { id: 'pan', label: 'PAN' },
                                    { id: 'gst', label: 'GST' },
                                ].map(({ id, label, required }) => (
                                    <div key={id}>
                                        <label htmlFor={id} className="block text-sm leading-6 font-medium">
                                            {label}
                                        </label>
                                        <input
                                            id={id}
                                            type="text"
                                            value={data[id]}
                                            onChange={(e) => setData(id, e.target.value)}
                                            className="border-input bg-background text-foreground focus:border-primary focus:ring-primary/50 mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:ring"
                                            required={required}
                                            autoFocus={id === 'name'}
                                        />
                                        {errors[id] && <p className="mt-1 text-sm text-red-600">{errors[id]}</p>}
                                    </div>
                                ))}
                                <div className="flex justify-end gap-2">
                                    <DialogClose asChild>
                                        <Button type="button" variant="outline" disabled={processing}>
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button type="submit" disabled={processing}>
                                        {editingParty ? 'Update' : 'Save'}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            {['id', 'name', 'address', 'state'].map((key) => (
                                <TableHead key={key} className="cursor-pointer select-none" onClick={() => handleSort(key)}>
                                    {key.toUpperCase()}
                                    {sortConfig.key === key && (
                                        <span className="ml-1 inline-block text-xs">{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
                                    )}
                                </TableHead>
                            ))}
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {sortedParties.length ? (
                            sortedParties.map((party) => (
                                <TableRow key={party.id}>
                                    <TableCell>{party.id}</TableCell>
                                    <TableCell>{party.name}</TableCell>
                                    <TableCell>{party.address || '-'}</TableCell>
                                    <TableCell>{party.state || '-'}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" onClick={() => openEditDialog(party)}>
                                                Edit
                                            </Button>
                                            <Button variant="destructive" size="sm" onClick={() => handleDelete(party.id)}>
                                                Delete
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-muted-foreground text-center">
                                    No parties found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </AppLayout>
    );
}
