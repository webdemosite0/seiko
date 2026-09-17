const {useEffect,useMemo,useState}=React;
const html=htm.bind(React.createElement);

const IMG={
  blue:'https://www.seikowatches.com/us-en/-/media/Images/Product--Image/All/Seiko/2025/08/19/21/10/SRPL55K1/SRPL55K1.png?mh=3840&mw=3840',
  black:'https://www.seikowatches.com/middleeast-en/-/media/Images/Product--Image/All/Seiko/2022/02/20/02/14/SRPD55K1/SRPD55K1.png?mh=3840&mw=3840',
  presage:'https://www.seikowatches.com/us-en/-/media/Images/Product--Image/America/Seiko/presage/SRPB43J1/SRPB43J1.png?mh=3840&mw=3840',
  prospex:'https://www.seikowatches.com/ph-en/-/media/Images/Product--Image/All/Seiko/2022/02/20/00/49/SPB143J1/SPB143J1.png?mh=3840&mw=3840',
  field:'https://www.seikowatches.com/middleeast-en/-/media/Images/Product--Image/All/Seiko/2022/02/20/02/37/SRPG33K1/SRPG33K1.png?mh=3840&mw=3840'
};

const products=[
  {id:'srpl55',name:'Seiko 5 Sports SNXS SRPL55',price:415,category:'Automatic',rating:4.9,reviews:124,image:IMG.blue,badge:'Featured'},
  {id:'srpd55',name:'Seiko 5 Sports SRPD55',price:350,category:'Diver',rating:4.9,reviews:98,image:IMG.black,badge:'Best Seller'},
  {id:'srpb43',name:'Seiko Presage Cocktail Time SRPB43',price:450,category:'Dress',rating:4.8,reviews:76,image:IMG.presage,badge:'Classic'},
  {id:'spb143',name:'Seiko Prospex SPB143',price:1200,category:'Diver',rating:4.9,reviews:89,image:IMG.prospex,badge:'Prospex'},
  {id:'srpg33',name:'Seiko 5 Sports Field SRPG33',price:300,category:'Field',rating:4.8,reviews:61,image:IMG.field,badge:'Field'}
];

const categories=[
  {name:'Automatic',tag:'Engineered for everyday life',image:IMG.blue},
  {name:'Dress',tag:'Japanese elegance',image:IMG.presage},
  {name:'Diver',tag:'Built for adventure',image:IMG.prospex},
  {name:'Field',tag:'Ready for anywhere',image:IMG.field},
  {name:'Sports',tag:'Performance by design',image:IMG.black}
];

const icons={
  search:['M21 21l-4.3-4.3','M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z'],
  user:['M20 21a8 8 0 0 0-16 0','M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z'],
  heart:['M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z'],
  bag:['M6 8h12l1 13H5L6 8Z','M9 8V6a3 3 0 0 1 6 0v2'],
  menu:['M4 7h16','M4 12h16','M4 17h16'],
  x:['M6 6l12 12','M18 6 6 18'],
  arrow:['M5 12h14','m14 0-5-5','m5 5-5 5'],
  truck:['M3 6h11v10H3z','M14 10h4l3 3v3h-7z','M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z','M18 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z'],
  shield:['M12 3 4 6v5c0 5 3.4 8.8 8 10 4.6-1.2 8-5 8-10V6l-8-3Z','m9 12 2 2 4-4'],
  box:['M4 7l8-4 8 4-8 4-8-4Z','M4 7v10l8 4 8-4V7','M12 11v10'],
  plus:['M12 5v14','M5 12h14'],
  minus:['M5 12h14']
};

function Icon({name,size=20}){
  return html`<svg width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${(icons[name]||icons.arrow).map((d,i)=>html`<path key=${i} d=${d}></path>`)}</svg>`;
}

function WatchImage({src,alt='',className='',priority=false}){
  const [failed,setFailed]=useState(false);
  if(failed) return html`<div className=${`image-fallback ${className}`}><span>SEIKO</span></div>`;
  return html`<img className=${`watch-img ${className}`} src=${src} alt=${alt} loading=${priority?'eager':'lazy'} decoding="async" fetchpriority=${priority?'high':'auto'} onError=${()=>setFailed(true)} />`;
}

function Brand(){
  return html`<a className="brand" href="#top" aria-label="Home"><strong>SEIKO</strong><span>SINCE 1881</span></a>`;
}

function ProductCard({product,onAdd,onQuick,wished,onWish}){
  return html`<article className="product-card">
    <div className="product-media">
      <span className="product-badge">${product.badge}</span>
      <button className=${`wish-btn ${wished?'active':''}`} onClick=${()=>onWish(product.id)} aria-label="Wishlist"><${Icon} name="heart" size=${18}/></button>
      <button className="image-button" onClick=${()=>onQuick(product)} aria-label=${`Open ${product.name}`}><${WatchImage} src=${product.image} alt=${product.name}/></button>
    </div>
    <div className="product-info">
      <div className="product-category">${product.category}</div>
      <button className="name-button" onClick=${()=>onQuick(product)}>${product.name}</button>
      <div className="rating"><span>★★★★★</span> <small>${product.rating} (${product.reviews})</small></div>
      <div className="product-bottom"><strong>$${product.price.toLocaleString()}</strong><button onClick=${()=>onAdd(product)}>Add to Cart</button></div>
    </div>
  </article>`;
}

function QuickView({product,onClose,onAdd,wished,onWish}){
  if(!product)return null;
  return html`<div className="overlay" onClick=${onClose}><section className="quick-modal" onClick=${e=>e.stopPropagation()} role="dialog" aria-modal="true">
    <button className="modal-close" onClick=${onClose}><${Icon} name="x" size=${20}/></button>
    <div className="quick-image"><${WatchImage} src=${product.image} alt=${product.name} priority=${true}/></div>
    <div className="quick-copy"><div className="eyebrow">${product.category} Collection</div><h2>${product.name}</h2><div className="rating"><span>★★★★★</span> <small>${product.rating} (${product.reviews} reviews)</small></div><p>Authentic Seiko watchmaking with refined finishing, reliable performance and a design made to last beyond trends.</p><div className="quick-price">$${product.price.toLocaleString()}</div><div className="quick-actions"><button className="primary" onClick=${()=>onAdd(product)}>Add to Cart</button><button className="secondary" onClick=${()=>onWish(product.id)}>${wished?'Saved to Wishlist':'Save to Wishlist'}</button></div></div>
  </section></div>`;
}

function CartDrawer({open,onClose,items,onQty,onRemove,onCheckout}){
  if(!open)return null;
  const total=items.reduce((s,x)=>s+x.product.price*x.qty,0);
  return html`<><div className="drawer-backdrop" onClick=${onClose}></div><aside className="cart-drawer">
    <div className="drawer-header"><h3>Your Cart</h3><button onClick=${onClose}><${Icon} name="x"/></button></div>
    <div className="drawer-body">${items.length===0?html`<div className="empty-cart"><${Icon} name="bag" size=${34}/><p>Your cart is empty.</p></div>`:items.map(item=>html`<div className="cart-line" key=${item.product.id}><div className="cart-thumb"><${WatchImage} src=${item.product.image} alt=${item.product.name}/></div><div className="cart-meta"><h4>${item.product.name}</h4><strong>$${item.product.price.toLocaleString()}</strong><div className="qty"><button onClick=${()=>onQty(item.product.id,-1)}><${Icon} name="minus" size=${12}/></button><span>${item.qty}</span><button onClick=${()=>onQty(item.product.id,1)}><${Icon} name="plus" size=${12}/></button></div></div><button className="remove" onClick=${()=>onRemove(item.product.id)}>Remove</button></div>`)}</div>
    <div className="drawer-footer"><div><span>Subtotal</span><strong>$${total.toLocaleString()}</strong></div><button className="primary" disabled=${!items.length} onClick=${onCheckout}>Checkout</button></div>
  </aside></>`;
}

function Checkout({open,onClose,total,onDone}){
  if(!open)return null;
  return html`<div className="overlay" onClick=${onClose}><form className="checkout-modal" onClick=${e=>e.stopPropagation()} onSubmit=${onDone}><button type="button" className="modal-close" onClick=${onClose}><${Icon} name="x"/></button><div className="eyebrow">Secure checkout</div><h2>Complete your order</h2><label>Full name<input required placeholder="Full name"/></label><label>Email<input required type="email" placeholder="you@example.com"/></label><label>Shipping address<input required placeholder="Street, city, country"/></label><div className="checkout-total"><span>Total</span><strong>$${total.toLocaleString()}</strong></div><button className="primary" type="submit">Place Demo Order</button><small>Demo checkout only. Connect your payment provider for live orders.</small></form></div>`;
}

function App(){
  const [query,setQuery]=useState('');
  const [filter,setFilter]=useState('All');
  const [menuOpen,setMenuOpen]=useState(false);
  const [cartOpen,setCartOpen]=useState(false);
  const [quick,setQuick]=useState(null);
  const [checkout,setCheckout]=useState(false);
  const [notice,setNotice]=useState('');
  const [email,setEmail]=useState('');
  const [cart,setCart]=useState(()=>{try{return JSON.parse(localStorage.getItem('seiko-cart-v2')||'[]')}catch{return []}});
  const [wishlist,setWishlist]=useState(()=>{try{return JSON.parse(localStorage.getItem('seiko-wishlist-v2')||'[]')}catch{return []}});

  useEffect(()=>localStorage.setItem('seiko-cart-v2',JSON.stringify(cart)),[cart]);
  useEffect(()=>localStorage.setItem('seiko-wishlist-v2',JSON.stringify(wishlist)),[wishlist]);
  useEffect(()=>{if(!notice)return;const t=setTimeout(()=>setNotice(''),2200);return()=>clearTimeout(t)},[notice]);

  const filtered=useMemo(()=>products.filter(p=>{
    const q=query.trim().toLowerCase();
    const f=filter==='All'||p.category===filter||(filter==='Sports'&&p.category==='Automatic');
    return f&&(!q||`${p.name} ${p.category}`.toLowerCase().includes(q));
  }),[query,filter]);

  const items=cart.map(x=>({product:products.find(p=>p.id===x.id),qty:x.qty})).filter(x=>x.product);
  const count=cart.reduce((s,x)=>s+x.qty,0);
  const total=items.reduce((s,x)=>s+x.product.price*x.qty,0);

  const add=p=>{setCart(c=>{const found=c.find(x=>x.id===p.id);return found?c.map(x=>x.id===p.id?{...x,qty:x.qty+1}:x):[...c,{id:p.id,qty:1}]});setNotice(`${p.name} added to cart`)};
  const wish=id=>{setWishlist(w=>w.includes(id)?w.filter(x=>x!==id):[...w,id]);setNotice(wishlist.includes(id)?'Removed from wishlist':'Saved to wishlist')};
  const qty=(id,d)=>setCart(c=>c.map(x=>x.id===id?{...x,qty:Math.max(1,x.qty+d)}:x));
  const remove=id=>setCart(c=>c.filter(x=>x.id!==id));
  const choose=name=>{setFilter(name);setMenuOpen(false);setTimeout(()=>document.getElementById('catalog')?.scrollIntoView({behavior:'smooth'}),20)};
  const newsletter=e=>{e.preventDefault();if(!email.includes('@')){setNotice('Enter a valid email address');return}setNotice('You are on the list');setEmail('')};
  const done=e=>{e.preventDefault();setCheckout(false);setCart([]);setCartOpen(false);setNotice('Demo order placed successfully')};

  return html`<div id="top">
    <div className="announcement"><div className="shell"><span>Free Shipping on All Orders</span><span>Authentic Seiko Watches</span><span>2 Year Warranty</span><span>Easy Returns</span></div></div>
    <header className="site-header"><div className="shell header-inner">
      <button className="mobile-menu" onClick=${()=>setMenuOpen(v=>!v)}><${Icon} name=${menuOpen?'x':'menu'}/></button>
      <${Brand}/>
      <nav className=${menuOpen?'open':''}><button onClick=${()=>choose('All')}>Shop All</button><button onClick=${()=>choose('Automatic')}>Automatic</button><button onClick=${()=>choose('Dress')}>Dress</button><button onClick=${()=>choose('Diver')}>Diver</button><button onClick=${()=>choose('Field')}>Field</button></nav>
      <div className="header-search"><${Icon} name="search" size=${18}/><input value=${query} onInput=${e=>setQuery(e.target.value)} onFocus=${()=>document.getElementById('catalog')?.scrollIntoView({behavior:'smooth'})} placeholder="Search Seiko watches..."/></div>
      <div className="header-actions"><button title="Account"><${Icon} name="user"/></button><button title="Wishlist" onClick=${()=>setNotice(`${wishlist.length} saved watch${wishlist.length===1?'':'es'}`)}><${Icon} name="heart"/></button><button className="cart-button" title="Cart" onClick=${()=>setCartOpen(true)}><${Icon} name="bag"/><b>${count}</b></button></div>
    </div></header>

    <main>
      <section className="hero"><div className="hero-noise"></div><div className="shell hero-grid">
        <div className="hero-copy"><div className="eyebrow">Discover timeless</div><h1>Seiko Watches</h1><p>Japanese craftsmanship. Enduring style. A better tomorrow.</p><button className="hero-cta" onClick=${()=>choose('All')}>Shop All Watches <${Icon} name="arrow" size=${17}/></button><div className="hero-points"><span>Japanese Craftsmanship</span><span>Built to Last</span><span>Since 1881</span></div></div>
        <div className="hero-watch"><div className="hero-glow"></div><${WatchImage} src=${IMG.blue} alt="Seiko 5 Sports blue dial watch" priority=${true}/><div className="hero-label"><span>More than time</span><strong>A brighter tomorrow</strong></div></div>
      </div></section>

      <section className="category-strip"><div className="shell category-grid">${categories.map(cat=>html`<button className="category-card" key=${cat.name} onClick=${()=>choose(cat.name)}><div className="category-image"><${WatchImage} src=${cat.image} alt=${cat.name}/></div><div><strong>${cat.name}</strong><span>${cat.tag}</span></div><${Icon} name="arrow" size=${16}/></button>`)}</div></section>

      <section className="catalog" id="catalog"><div className="shell">
        <div className="section-heading"><div><div className="eyebrow dark">Featured collection</div><h2>Popular Seiko Watches</h2></div><div className="filter-pills">${['All','Automatic','Dress','Diver','Field'].map(f=>html`<button className=${filter===f?'active':''} onClick=${()=>setFilter(f)}>${f}</button>`)}</div></div>
        ${query&&html`<div className="search-note">Showing results for “${query}”</div>`}
        <div className="product-grid">${filtered.map(p=>html`<${ProductCard} key=${p.id} product=${p} onAdd=${add} onQuick=${setQuick} wished=${wishlist.includes(p.id)} onWish=${wish}/>`)}${filtered.length===0&&html`<div className="no-results">No watches match your search.</div>`}</div>
      </div></section>

      <section className="campaign"><div className="shell campaign-grid"><div className="campaign-copy"><div className="eyebrow">New arrivals</div><h2>A fresh perspective on time.</h2><p>Discover the latest Seiko collections where innovation meets enduring Japanese design.</p><button className="light-btn" onClick=${()=>choose('All')}>Shop New Arrivals <${Icon} name="arrow" size=${16}/></button></div><div className="campaign-watch"><div className="campaign-circle"></div><${WatchImage} src=${IMG.blue} alt="Seiko blue dial watch"/></div></div></section>

      <section className="benefits"><div className="shell benefit-grid"><div><${Icon} name="truck" size=${26}/><span><strong>Free Shipping</strong><small>On all orders worldwide</small></span></div><div><${Icon} name="shield" size=${26}/><span><strong>2 Year Warranty</strong><small>Peace of mind</small></span></div><div><${Icon} name="box" size=${26}/><span><strong>Easy Returns</strong><small>30-day hassle free</small></span></div><div><${Icon} name="shield" size=${26}/><span><strong>Authentic Seiko</strong><small>Genuine product imagery</small></span></div></div></section>

      <section className="newsletter"><div className="shell newsletter-grid"><div className="story"><div className="eyebrow">Japan inspires</div><h2>A brighter tomorrow moves us forward.</h2><p>Precision, purpose and timeless craft.</p></div><form onSubmit=${newsletter}><div className="eyebrow dark">Stay in the loop</div><h2>Be the First to Know</h2><p>Get new arrivals, collection drops and special offers.</p><div className="email-row"><input value=${email} onInput=${e=>setEmail(e.target.value)} type="email" placeholder="Enter your email address"/><button>Subscribe</button></div></form></div></section>
    </main>

    <footer><div className="shell footer-grid"><div><${Brand}/><p>Better Times Ahead.</p></div><div><h4>Shop</h4><button onClick=${()=>choose('All')}>All Watches</button><button onClick=${()=>choose('Automatic')}>Automatic</button><button onClick=${()=>choose('Dress')}>Dress</button><button onClick=${()=>choose('Diver')}>Diver</button></div><div><h4>Customer Care</h4><a href="#">Shipping Information</a><a href="#">Returns & Exchanges</a><a href="#">Warranty</a><a href="#">Contact Us</a></div><div><h4>About</h4><a href="#">Our Story</a><a href="#">Innovation</a><a href="#">Sustainability</a></div></div><div className="shell footer-bottom"><span>© 2026 Seiko ecommerce concept.</span><span>Responsive React storefront.</span></div></footer>

    <${CartDrawer} open=${cartOpen} onClose=${()=>setCartOpen(false)} items=${items} onQty=${qty} onRemove=${remove} onCheckout=${()=>setCheckout(true)}/>
    <${QuickView} product=${quick} onClose=${()=>setQuick(null)} onAdd=${add} wished=${quick?wishlist.includes(quick.id):false} onWish=${wish}/>
    <${Checkout} open=${checkout} onClose=${()=>setCheckout(false)} total=${total} onDone=${done}/>
    ${notice&&html`<div className="toast">${notice}</div>`}
  </div>`;
}

ReactDOM.createRoot(document.getElementById('root')).render(html`<${App}/>`);
