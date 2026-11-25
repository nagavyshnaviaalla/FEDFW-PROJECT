
import React, { useState } from 'react';

function ProductCard({ name, price, image, addToCart }) {
  return (
    <div style={{
      backgroundColor: '#ffffff',
      padding: '20px',
      margin: '15px',
      borderRadius: '15px',
      width: '200px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      textAlign: 'center'
    }}>
      <img src={image} alt={name} width="150" />

      <h2 style={{ color: '#333' }}>{name}</h2>

      <p style={{ color: '#008080', fontWeight: 'bold' }}>
        Price: ₹{price}
      </p>

      <button
        onClick={addToCart}
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          padding: '10px 15px',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        Add to Cart
      </button>
    </div>
  );
}

function App() {
  const [cart, setCart] = useState(0);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #89f7fe, #66a6ff)',
      textAlign: 'center',
      padding: '20px'
    }}>

      <h1 style={{ color: '#172554', fontSize: '36px' }}>
        Online Shopping
      </h1>

      <h2 style={{ color: '#ffffff' }}>
        Cart Count: {cart}
      </h2>

      <div style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center'
      }}>

        <ProductCard
          name="Laptop"
          price="45000"
          image="public/l.jpg"
          addToCart={() => setCart(cart + 1)}
        />

        <ProductCard
          name="Mobile"
          price="15000"
          image="public/motoral.png"
          addToCart={() => setCart(cart + 1)}
        />

        <ProductCard
          name="Headphones"
          price="2000"
          image="public/Screenshot 2026-08-01 101758.png"
          addToCart={() => setCart(cart + 1)}
        />

        <ProductCard
          name="Watch"
          price="3000"
          image="public/watch.jpg"
          addToCart={() => setCart(cart + 1)}
        />

      </div>
    </div>
  );
}

export default App;
