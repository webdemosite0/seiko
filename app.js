const {useEffect,useMemo,useState}=React;
const html=htm.bind(React.createElement);

const SOURCE_W=941;
const SOURCE_H=1672;

const categories=[
  {name:'Automatic',tag:'Engineered for life',crop:{x:32,y:482,w:165,h:128}},
  {name:'Dress',tag:'Timeless elegance',crop:{x:208,y:482,w:164,h:128}},
  {name:'Diver',tag:'Built for adventure',crop:{x:383,y:482,w:164,h:128}},
  {name:'Classic',tag:'A lasting legacy',crop:{x:558,y:482,w:164,h:128}},
  {name:'Everyday',tag:'Exceptional daily',crop:{x:731,y:482,w:164,h:128}}
];

const products=[
  {id:'blue-auto',name:'Seiko 5 Automatic Blue Dial (SNXS Style)',price:279,rating:5,reviews:124,category:'Automatic',crop:{x:43,y:753,w:145,h:171}},
  {id:'black-auto',name:'Seiko 5 Automatic Black Dial',price:259,rating:5,reviews:92,category:'Automatic',crop:{x:218,y:753,w:145,h:171}},
  {id:'presage',name:'Seiko Presage Cocktail Time',price:450,rating:5,reviews:76,category:'Dress',crop:{x:392,y:753,w:145,h:171}},
  {id:'prospex',name:'Seiko Prospex Diver 200m (SRPD)',price:495,rating:5,reviews:98,category:'Diver',crop:{x:567,y:753,w:145,h:171}},
  {id:'field',name:'Seiko 5 Sports Field Series',price:295,rating:5,reviews:61,category:'Everyday',crop:{x:742,y:753,w:145,h:171}},
  {id:'classic-blue',name:'Seiko Classic Blue Automatic',price:325,rating:5,reviews:87,category:'Classic',crop:{x:43,y:753,w:145,h:171}},
  {id:'dress-silver',name:'Seiko Classic Silver Dress Watch',price:310,rating:4.8,reviews:53,category:'Classic',crop:{x:392,y:753,w:145,h:171}}
];

const iconPaths={
  search:['M21 21l-4.35-4.35','M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z'],
  user:['M20 21a8 8 0 0 0-16 0','M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z'],
  heart:['M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z'],
  bag:['M6 8h12l1 13H5L6 8Z','M9 8V6a3 3 0 0 1 6 0v2'],
  menu:['M4 7h16','M4 12h16','M4 17h16'],
  x:['M6 6l12 12','M18 6 6 18'],
  arrow:['M5 12h14','m14 0-5-5','m5 5-5 5'],
  truck:['M3 6h11v10H3z','M14 10h4l3 3v3h-7z','M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z','M18 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z'],
  shield:['M12 3 4 6v5c0 5 3.4 8.8 8 10 4.6-1.2 8-5 8-10V6l-8-3Z','m9 12 2 2 4-4'],
  box:['M4 7l8-4 8 4-8 4-8-4Z','M4 7v10l8 4 8-4V7','M12 11v10'],
  check:['M20 6 9 17l-5-5'],
  plus:['M12 5v14','M5 12h14'],
  minus:['M5 12h14'],
  gem:['M5 4h14l3 5-10 11L2 9l3-5Z','M2 9h20','m8-5 2 5 2-5','m7 0-3 5','M5 4l3 5']
};

function Icon({name,size=20,strokeWidth=1.8}){
  const paths=iconPaths[name]||iconPaths.arrow;
  return html`<svg width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width=${strokeWidth} stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths.map((d,i)=>html`<path key=${i} d=${d}></path>`)}</svg>`;
}

function CropImage({src,crop,alt='',className=''}){
  const aspect=`${crop.w}/${crop.h}`;
  if(!src) return html`<div className=${`crop ${className}`} style=${{aspectRatio:aspect}}><div className="crop-placeholder"></div></div>`;
  const width=(SOURCE_W/crop.w)*100;
  const left=-(crop.x/crop.w)*100;
  const top=-(crop.y/crop.h)*100;
  return html`<div className=${`crop ${className}`} style=${{aspectRatio:aspect}} role="img" aria-label=${alt}>
    <img src=${src} alt="" style=${{width:`${width}%`,left:`${left}%`,top:`${top}%`}} />
  </div>`;
}

function Brand(){
  return html`<a href="#top" className="brand" aria-label="Seiko store home"><strong>SEIKO</strong><small>SINCE 1881</small></a>`;
}

function ProductCard({product,source,onAdd,onQuick,wishlisted,onWish}){
  return html`<article className="product-card">
    <button className=${`wishlist ${wishlisted?'active':''}`} onClick=${()=>onWish(product.id)} aria-label=${wishlisted?'Remove from wishlist':'Add to wishlist'}><${Icon} name="heart" size=${15}/></button>
    <button className="product-image-button" onClick=${()=>onQuick(product)} aria-label=${`View ${product.name}`}>
      <${CropImage} src=${source} crop=${product.crop} alt=${product.name}/>
    </button>
    <div className="product-body">
      <div className="rating">★★★★★ <span>(${product.reviews})</span></div>
      <button onClick=${()=>onQuick(product)} style=${{border:0,background:'none',padding:0,color:'inherit'}}><div className="product-name">${product.name}</div></button>
      <div className="price">$${product.price}</div>
      <button className="add-btn" onClick=${()=>onAdd(product)}>Add to Cart</button>
    </div>
  </article>`;
}

function CartDrawer({open,onClose,items,source,onQty,onRemove,onCheckout}){
  if(!open) return null;
  const total=items.reduce((sum,item)=>sum+item.product.price*item.qty,0);
  return html`<>
    <div className="drawer-backdrop" onClick=${onClose}></div>
    <aside className="cart-drawer" aria-label="Shopping cart" aria-modal="true">
      <div className="drawer-head"><h3>Your Cart</h3><button className="close-btn" onClick=${onClose} aria-label="Close cart"><${Icon} name="x" size=${18}/></button></div>
      <div className="cart-items">
        ${items.length===0?html`<div className="cart-empty"><div><${Icon} name="bag" size=${34}/><p>Your cart is empty.</p></div></div>`:items.map(item=>html`<div className="cart-item" key=${item.product.id}>
          <div className="cart-thumb"><${CropImage} src=${source} crop=${item.product.crop} alt=${item.product.name}/></div>
          <div><h4>${item.product.name}</h4><div className="mini-price">$${item.product.price}</div><div className="qty"><button onClick=${()=>onQty(item.product.id,-1)} aria-label="Decrease quantity"><${Icon} name="minus" size=${12}/></button><span>${item.qty}</span><button onClick=${()=>onQty(item.product.id,1)} aria-label="Increase quantity"><${Icon} name="plus" size=${12}/></button></div></div>
          <button className="remove" onClick=${()=>onRemove(item.product.id)}>Remove</button>
        </div>`)}
      </div>
      <div className="drawer-foot"><div className="total-row"><span>Subtotal</span><span>$${total.toFixed(2)}</span></div><button className="checkout-btn" disabled=${!items.length} onClick=${onCheckout}>Proceed to Checkout</button></div>
    </aside>
  </>`;
}

function QuickView({product,source,onClose,onAdd,wishlisted,onWish}){
  if(!product) return null;
  return html`<div className="modal-backdrop" onClick=${onClose}>
    <div className="modal" onClick=${e=>e.stopPropagation()} role="dialog" aria-modal="true" aria-label=${product.name}>
      <button className="close-btn" onClick=${onClose} aria-label="Close"><${Icon} name="x" size=${18}/></button>
      <div className="quick-grid">
        <div className="quick-media"><${CropImage} src=${source} crop=${product.crop} alt=${product.name}/></div>
        <div className="quick-copy"><div className="eyebrow">${product.category} collection</div><h3>${product.name}</h3><div className="rating">★★★★★ <span>(${product.reviews} verified reviews)</span></div><p>Japanese watchmaking character with a refined everyday profile. Built for collectors who value reliable design and timeless proportions.</p><div className="quick-price">$${product.price}</div><div className="quick-actions"><button className="secondary-btn" onClick=${()=>onAdd(product)}>Add to Cart</button><button className="ghost-btn" onClick=${()=>onWish(product.id)}>${wishlisted?'Saved':'Save to Wishlist'}</button></div></div>
      </div>
    </div>
  </div>`;
}

function AccountModal({open,onClose,onSubmit}){
  if(!open) return null;
  return html`<div className="modal-backdrop" onClick=${onClose}><form className="modal account-modal" onClick=${e=>e.stopPropagation()} onSubmit=${onSubmit}><button type="button" className="close-btn" onClick=${onClose}><${Icon} name="x" size=${18}/></button><h3>Welcome back</h3><p>Sign in to view saved watches and order history.</p><div className="field"><label>Email</label><input type="email" required placeholder="you@example.com"/></div><div className="field"><label>Password</label><input type="password" required minLength="6" placeholder="••••••••"/></div><button className="secondary-btn" type="submit">Sign In</button></form></div>`;
}

function CheckoutModal({open,onClose,total,onComplete}){
  if(!open) return null;
  return html`<div className="modal-backdrop" onClick=${onClose}><form className="modal account-modal" onClick=${e=>e.stopPropagation()} onSubmit=${onComplete}><button type="button" className="close-btn" onClick=${onClose}><${Icon} name="x" size=${18}/></button><div className="eyebrow">Secure checkout</div><h3>Complete your order</h3><p>Demo checkout for this storefront. Payment provider can be connected next.</p><div className="field"><label>Full name</label><input required placeholder="Full name"/></div><div className="field"><label>Email</label><input type="email" required placeholder="you@example.com"/></div><div className="field"><label>Shipping address</label><input required placeholder="Street, city, country"/></div><div className="total-row"><span>Order total</span><span>$${total.toFixed(2)}</span></div><button className="secondary-btn" type="submit">Place Demo Order</button></form></div>`;
}

function App(){
  const [source,setSource]=useState('');
  const [activeCategory,setActiveCategory]=useState('All');
  const [search,setSearch]=useState('');
  const [mobileOpen,setMobileOpen]=useState(false);
  const [cartOpen,setCartOpen]=useState(false);
  const [accountOpen,setAccountOpen]=useState(false);
  const [quick,setQuick]=useState(null);
  const [checkout,setCheckout]=useState(false);
  const [notice,setNotice]=useState('');
  const [newsletter,setNewsletter]=useState('');
  const [formNote,setFormNote]=useState('');
  const [cart,setCart]=useState(()=>{try{return JSON.parse(localStorage.getItem('seiko-cart')||'[]')}catch{return []}});
  const [wishlist,setWishlist]=useState(()=>{try{return JSON.parse(localStorage.getItem('seiko-wishlist')||'[]')}catch{return []}});

  useEffect(()=>{
    let cancelled=false;
    Promise.all(['assets/mockup-0.txt','assets/mockup-1.txt'].map(p=>fetch(p).then(r=>{if(!r.ok)throw new Error('asset');return r.text()})))
      .then(parts=>{if(!cancelled){const url='data:image/webp;base64,'+parts.map(x=>x.trim()).join('');const img=new Image();img.onload=()=>setSource(url);img.src=url;}})
      .catch(()=>setNotice('Product imagery could not be loaded.'));
    return()=>{cancelled=true};
  },[]);

  useEffect(()=>localStorage.setItem('seiko-cart',JSON.stringify(cart)),[cart]);
  useEffect(()=>localStorage.setItem('seiko-wishlist',JSON.stringify(wishlist)),[wishlist]);
  useEffect(()=>{if(!notice)return;const t=setTimeout(()=>setNotice(''),2200);return()=>clearTimeout(t)},[notice]);

  const filtered=useMemo(()=>products.filter(p=>{
    const byCategory=activeCategory==='All'||p.category===activeCategory;
    const q=search.trim().toLowerCase();
    const bySearch=!q||`${p.name} ${p.category}`.toLowerCase().includes(q);
    return byCategory&&bySearch;
  }),[activeCategory,search]);

  const cartItems=cart.map(item=>({product:products.find(p=>p.id===item.id),qty:item.qty})).filter(x=>x.product);
  const cartCount=cart.reduce((sum,item)=>sum+item.qty,0);
  const total=cartItems.reduce((sum,item)=>sum+item.product.price*item.qty,0);

  const scrollCatalog=()=>document.getElementById('catalog')?.scrollIntoView({behavior:'smooth'});
  const chooseCategory=(name)=>{setActiveCategory(name);setSearch('');setMobileOpen(false);setTimeout(scrollCatalog,20)};
  const addToCart=(product)=>{setCart(current=>{const found=current.find(x=>x.id===product.id);return found?current.map(x=>x.id===product.id?{...x,qty:x.qty+1}:x):[...current,{id:product.id,qty:1}]});setNotice(`${product.name} added to cart`)};
  const changeQty=(id,delta)=>setCart(current=>current.map(x=>x.id===id?{...x,qty:Math.max(1,x.qty+delta)}:x));
  const remove=(id)=>setCart(current=>current.filter(x=>x.id!==id));
  const toggleWish=(id)=>{setWishlist(current=>current.includes(id)?current.filter(x=>x!==id):[...current,id]);setNotice(wishlist.includes(id)?'Removed from wishlist':'Saved to wishlist')};
  const submitNewsletter=(e)=>{e.preventDefault();if(!newsletter.includes('@')){setFormNote('Enter a valid email address.');return}localStorage.setItem('seiko-newsletter',newsletter);setFormNote('You’re on the list.');setNotice('Subscribed successfully');setNewsletter('')};
  const doSearch=(e)=>{if(e.key==='Enter')scrollCatalog()};
  const signIn=(e)=>{e.preventDefault();setAccountOpen(false);setNotice('Demo account sign-in complete')};
  const completeCheckout=(e)=>{e.preventDefault();setCheckout(false);setCart([]);setCartOpen(false);setNotice('Demo order placed successfully')};

  return html`<div className="site" id="top">
    <div className="announcement"><div className="container"><div className="announcement-left"><span>Free Shipping on All Orders</span><span>Authentic Seiko Watches</span><span>2 Year Warranty</span><span>Easy Returns</span></div><div className="announcement-right">A Higher Standard of Time — Since 1881</div></div></div>

    <header className="header"><div className="container header-row">
      <${Brand}/>
      <nav className="nav" aria-label="Main navigation"><button onClick=${()=>chooseCategory('All')}>Shop All</button>${categories.map(c=>html`<button key=${c.name} onClick=${()=>chooseCategory(c.name)}>${c.name}</button>`)}<a href="#footer">About</a></nav>
      <label className="search"><input value=${search} onInput=${e=>setSearch(e.target.value)} onKeyDown=${doSearch} placeholder="Search Seiko watches, collections..." aria-label="Search watches"/><${Icon} name="search" size=${18}/></label>
      <div className="header-actions"><button className="icon-action" onClick=${()=>setAccountOpen(true)}><${Icon} name="user" size=${20}/><span>Account</span></button><button className="icon-action" onClick=${()=>{setNotice(`${wishlist.length} saved watch${wishlist.length===1?'':'es'}`);scrollCatalog()}}><${Icon} name="heart" size=${20}/><span>Wishlist</span></button><button className="icon-action" onClick=${()=>setCartOpen(true)}><${Icon} name="bag" size=${20}/><span>Cart</span>${cartCount>0&&html`<b className="badge">${cartCount}</b>`}</button></div>
      <button className="mobile-toggle" onClick=${()=>setMobileOpen(v=>!v)} aria-label="Open menu"><${Icon} name=${mobileOpen?'x':'menu'} size=${22}/></button>
      ${mobileOpen&&html`<div className="mobile-nav"><label className="search mobile-search"><input value=${search} onInput=${e=>setSearch(e.target.value)} onKeyDown=${doSearch} placeholder="Search watches..."/><${Icon} name="search" size=${18}/></label><button onClick=${()=>chooseCategory('All')}>Shop All</button>${categories.map(c=>html`<button key=${c.name} onClick=${()=>chooseCategory(c.name)}>${c.name}</button>`)}</div>`}
    </div></header>

    <main>
      <section className="hero"><div className="container hero-inner"><div className="hero-copy"><div className="eyebrow">Discover timeless</div><h1>Seiko Watches</h1><div className="hero-sub">Japanese craftsmanship.<br/>Enduring style. A better tomorrow.</div><div className="hero-rule"></div><button className="primary-btn" onClick=${()=>chooseCategory('All')}>Shop All Watches <${Icon} name="arrow" size=${15}/></button><div className="hero-micro"><div className="hero-micro-item"><${Icon} name="gem" size=${24}/><span>Japanese craftsmanship</span></div><div className="hero-micro-item"><${Icon} name="check" size=${24}/><span>Built for a brighter tomorrow</span></div><div className="hero-micro-item"><${Icon} name="shield" size=${24}/><span>A legacy since 1881</span></div></div></div><div className="hero-visual"><${CropImage} src=${source} crop=${{x:470,y:150,w:320,h:318}} alt="Blue dial Seiko automatic watch" className="hero-watch"/><div className="hero-side-copy">More<br/>than time<i></i><small>A brighter<br/>tomorrow</small></div></div></div></section>

      <section className="categories" aria-label="Watch categories"><div className="container category-grid">${categories.map(c=>html`<button className=${`category-card ${activeCategory===c.name?'active':''}`} key=${c.name} onClick=${()=>chooseCategory(c.name)}><${CropImage} src=${source} crop=${c.crop} alt=${`${c.name} Seiko watch`}/><div className="category-info"><div><span className="category-name">${c.name}</span><span className="category-tag">${c.tag}</span></div><${Icon} name="arrow" size=${16}/></div></button>`)}</div></section>

      <section className="catalog" id="catalog"><div className="container"><div className="section-heading"><div><div className="eyebrow">Featured collection</div><h2>Popular Seiko Watches</h2></div><button className="view-all" onClick=${()=>{setActiveCategory('All');setSearch('')}}><span>View All Products</span><${Icon} name="arrow" size=${15}/></button></div>${(search||activeCategory!=='All')&&html`<div className="search-summary">Showing ${filtered.length} result${filtered.length===1?'':'s'}${activeCategory!=='All'?` in ${activeCategory}`:''}${search?` for “${search}”`:''}.</div>`}<div className="products">${filtered.length?filtered.map(p=>html`<${ProductCard} key=${p.id} product=${p} source=${source} onAdd=${addToCart} onQuick=${setQuick} wishlisted=${wishlist.includes(p.id)} onWish=${toggleWish}/>`):html`<div className="empty">No watches match your search. <button className="ghost-btn" onClick=${()=>{setSearch('');setActiveCategory('All')}}>Reset filters</button></div>`}</div></div></section>

      <section className="promo"><div className="container promo-inner"><div className="promo-copy"><div className="eyebrow">New arrivals</div><h2>A fresh perspective<br/>on time</h2><p>Discover the latest Seiko watches, where innovation meets enduring design.</p><button className="primary-btn" onClick=${()=>{setActiveCategory('All');scrollCatalog()}}>Shop New Arrivals <${Icon} name="arrow" size=${14}/></button></div><div className="promo-media"><${CropImage} src=${source} crop=${{x:350,y:1045,w:480,h:210}} alt="Close-up blue Seiko dial"/><div className="promo-side">Same<br/>values.<br/>A brighter<br/>tomorrow.<i></i></div></div></div></section>

      <section className="trust"><div className="container trust-grid"><div className="trust-item"><${Icon} name="truck" size=${29}/><div className="trust-copy"><strong>Free Shipping</strong><span>On all orders worldwide</span></div></div><div className="trust-item"><${Icon} name="shield" size=${29}/><div className="trust-copy"><strong>2 Year Warranty</strong><span>Peace of mind</span></div></div><div className="trust-item"><${Icon} name="box" size=${29}/><div className="trust-copy"><strong>Easy Returns</strong><span>30-day hassle free</span></div></div><div className="trust-item"><${Icon} name="check" size=${29}/><div className="trust-copy"><strong>Authentic Seiko</strong><span>100% genuine products</span></div></div></div></section>

      <section className="newsletter-wrap"><div className="story-image"><${CropImage} src=${source} crop=${{x:0,y:1322,w:515,h:150}} alt="Japan inspired Seiko brand landscape"/></div><div className="newsletter"><div className="eyebrow">Stay in the loop</div><h3>Be the First to Know</h3><p>Get exclusive access to new arrivals, special offers, and Seiko stories.</p><form className="subscribe-form" onSubmit=${submitNewsletter}><input type="email" value=${newsletter} onInput=${e=>setNewsletter(e.target.value)} placeholder="Enter your email address" aria-label="Email address"/><button type="submit">Subscribe</button></form><div className="form-note">${formNote}</div></div></section>
    </main>

    <footer className="footer" id="footer"><div className="container"><div className="footer-grid"><div className="footer-brand"><${Brand}/><p>Better Times Ahead.</p></div><div className="footer-col"><h4>Shop</h4><a href="#catalog" onClick=${()=>setActiveCategory('All')}>All Watches</a>${categories.map(c=>html`<a href="#catalog" key=${c.name} onClick=${()=>setActiveCategory(c.name)}>${c.name}</a>`)}</div><div className="footer-col"><h4>Customer Care</h4><a href="#footer">Help Center</a><a href="#footer">Shipping Information</a><a href="#footer">Returns & Exchanges</a><a href="#footer">Warranty</a><a href="#footer">Size Guide</a><a href="#footer">Contact Us</a></div><div className="footer-col"><h4>About Seiko</h4><a href="#footer">Our Story</a><a href="#footer">Innovation</a><a href="#footer">Sustainability</a><a href="#footer">News</a><a href="#footer">Careers</a></div><div className="footer-col"><h4>Follow Us</h4><div className="socials"><a className="social-btn" href="#footer" aria-label="Instagram">◎</a><a className="social-btn" href="#footer" aria-label="Facebook">f</a><a className="social-btn" href="#footer" aria-label="YouTube">▶</a></div><div className="eyebrow">A brighter tomorrow<br/>since 1881</div></div></div><div className="footer-bottom"><span>© 2026 Seiko Watches storefront concept.</span><div className="footer-links"><a href="#footer">Terms of Service</a><a href="#footer">Privacy Policy</a><a href="#footer">Cookie Settings</a><a href="#footer">Global⌄</a></div></div></div></footer>

    <${CartDrawer} open=${cartOpen} onClose=${()=>setCartOpen(false)} items=${cartItems} source=${source} onQty=${changeQty} onRemove=${remove} onCheckout=${()=>{setCartOpen(false);setCheckout(true)}}/>
    <${QuickView} product=${quick} source=${source} onClose=${()=>setQuick(null)} onAdd=${addToCart} wishlisted=${quick?wishlist.includes(quick.id):false} onWish=${toggleWish}/>
    <${AccountModal} open=${accountOpen} onClose=${()=>setAccountOpen(false)} onSubmit=${signIn}/>
    <${CheckoutModal} open=${checkout} onClose=${()=>setCheckout(false)} total=${total} onComplete=${completeCheckout}/>
    <div className=${`toast ${notice?'show':''}`} role="status" aria-live="polite">${notice}</div>
  </div>`;
}

ReactDOM.createRoot(document.getElementById('root')).render(html`<${App}/>`);
