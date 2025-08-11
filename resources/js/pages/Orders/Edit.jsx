import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';

export default function Edit({ order }) {
  const [values, setValues] = useState({ ...order });
  console.log('Edit Order:', values);
  

  function handleChange(e) {
    setValues({ ...values, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    Inertia.put(`/orders/${order.id}`, values);
  }

  return (
    <div>
      <h1>Edit Order</h1>
      <form onSubmit={handleSubmit}>
        <input name="product" value={values.product} onChange={handleChange} placeholder="Product" /><br />
        <input name="quantity" value={values.quantity} onChange={handleChange} placeholder="Quantity" type="number" /><br />
        <input name="price" value={values.price} onChange={handleChange} placeholder="Price" type="number" step="0.01" /><br />
        <button type="submit">Update</button>
      </form>
    </div>
  );
}