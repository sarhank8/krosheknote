const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '20mb' }));

// Admin Password (stored safely server-side, NOT exposed to frontend JS)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ishrat28';
let activeAdminTokens = new Set();

// Configure Multer storage for image uploads
const uploadDir = path.join(__dirname, '../public/images');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname) || '.jpg';
    const uniqueName = `product_${Date.now()}_${Math.floor(Math.random() * 1000)}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage: storage });

// In-memory + file-persisted data store
const DATA_FILE = path.join(__dirname, 'data.json');

const INITIAL_PRODUCTS = [
  {
    id: '1',
    slug: 'bonbon-the-bunny',
    name: 'Bonbon the Bunny',
    category: 'Plushies',
    categorySlug: 'plushies',
    price: 1299,
    originalPrice: 1499,
    image: '/images/bonbon-bunny.jpg',
    description: 'Extra-soft cotton plush bunny handcrafted with hypoallergenic polyfill. Features a hand-stitched blush heart on its chest and cute floppy ears.',
    inStock: true,
    craftingNotice: 'Handmade in small batches — please allow 5–7 days for your piece to ship.',
    specifications: [
      { label: 'Materials', value: '100% Combed Cotton Yarn, Hypoallergenic Polyester Filling' },
      { label: 'Height', value: '22 cm (8.6 inches)' },
      { label: 'Care', value: 'Spot clean or gentle hand wash in cold water with mild soap. Lay flat to dry.' },
      { label: 'Safety', value: 'Safety eyes securely attached with inner lock washers' }
    ]
  },
  {
    id: '2',
    slug: 'rosie-granny-cardigan',
    name: 'Rosie Granny Cardigan',
    category: 'Wearables',
    categorySlug: 'wearables',
    price: 3499,
    originalPrice: 3899,
    image: '/images/rosie-cardigan.jpg',
    description: 'Handcrafted blush pink and cream granny square cardigan with delicate scallop edging and custom wooden buttons. Cozy, breathable, and timeless.',
    inStock: true,
    craftingNotice: 'Handmade to order — please allow 7–10 days for custom stitching.',
    specifications: [
      { label: 'Materials', value: '100% Soft Cotton Cord Yarn' },
      { label: 'Fit', value: 'Relaxed oversized fit with dropped shoulders' },
      { label: 'Sizes Available', value: 'S (36"), M (40"), L (44"), XL (48")' },
      { label: 'Care', value: 'Hand wash cold, dry flat in shade. Do not tumble dry or hang while wet.' }
    ]
  },
  {
    id: '3',
    slug: 'everyday-market-bag',
    name: 'Everyday Market Bag',
    category: 'Wearables',
    categorySlug: 'wearables',
    price: 899,
    originalPrice: 1099,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800',
    description: 'Sturdy open-weave cream cotton cord tote bag. Lightweight yet stretchable, designed to comfortably carry up to 8 kg of groceries, books, or essentials.',
    inStock: true,
    craftingNotice: 'Handmade in small batches — ready to ship in 2–3 days.',
    specifications: [
      { label: 'Materials', value: 'Double-stranded 100% Organic Cotton Cord' },
      { label: 'Capacity', value: 'Holds up to 8 kg (17.6 lbs)' },
      { label: 'Dimensions', value: '38 cm x 40 cm (Handle drop: 28 cm)' },
      { label: 'Care', value: 'Machine washable in delicate mesh bag at 30°C.' }
    ]
  },
  {
    id: '4',
    slug: 'little-lamb-booties',
    name: 'Little Lamb Booties',
    category: 'For Baby',
    categorySlug: 'baby',
    price: 749,
    originalPrice: 899,
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&q=80&w=800',
    description: 'Soft baby-safe cotton booties with plush textured lamb cuffs and non-slip blush pink soles. Gentle ankle ribs keep them securely on tiny feet.',
    inStock: true,
    craftingNotice: 'Handmade in small batches — please allow 3–5 days to ship.',
    specifications: [
      { label: 'Materials', value: '100% Ultra-Soft Baby Cotton Yarn' },
      { label: 'Size', value: 'Fits 0–6 Months (Sole length: 9.5 cm)' },
      { label: 'Safety', value: 'Zero hard buttons or loose beads' },
      { label: 'Care', value: 'Hand wash gently in lukewarm water.' }
    ]
  },
  {
    id: '5',
    slug: 'heart-coaster-set',
    name: 'Heart Coaster Set',
    category: 'Home',
    categorySlug: 'home',
    price: 499,
    originalPrice: 599,
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800',
    description: 'Set of 4 double-thick crochet heart coasters in baby pink and cream. Comes with a matching drawstring cotton gift pouch.',
    inStock: true,
    craftingNotice: 'In stock — ready to ship within 24 hours.',
    specifications: [
      { label: 'Quantity', value: 'Set of 4 coasters (2 Pink, 2 Cream)' },
      { label: 'Materials', value: '100% Recycled Cotton Thread' },
      { label: 'Size', value: '12 cm x 11 cm per coaster' },
      { label: 'Heat Resistance', value: 'Protects wooden and glass tables up to 100°C' }
    ]
  },
  {
    id: '6',
    slug: 'blush-scrunchie-trio',
    name: 'Blush Scrunchie Trio',
    category: 'Wearables',
    categorySlug: 'wearables',
    price: 399,
    originalPrice: 499,
    image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&q=80&w=800',
    description: 'Trio of handcrafted crochet hair scrunchies in Blush Pink, Warm Cream, and Dusty Rose. Snag-free elastic core preserves hair health.',
    inStock: true,
    craftingNotice: 'In stock — ready to ship within 24 hours.',
    specifications: [
      { label: 'Quantity', value: '3 Scrunchies (Blush, Cream, Rose)' },
      { label: 'Materials', value: 'Soft Microfiber Plush Yarn & Strong Elastic' },
      { label: 'Care', value: 'Hand wash or gentle machine wash' }
    ]
  }
];

const INITIAL_CATEGORIES = [
  { name: 'All', slug: 'all' },
  { name: 'Plushies', slug: 'plushies' },
  { name: 'Wearables', slug: 'wearables' },
  { name: 'Home', slug: 'home' },
  { name: 'For Baby', slug: 'baby' }
];

let db = {
  products: INITIAL_PRODUCTS,
  categories: INITIAL_CATEGORIES
};

// Load saved data if available
if (fs.existsSync(DATA_FILE)) {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    db = { ...db, ...parsed };
    if (!db.categories || db.categories.length === 0) {
      db.categories = INITIAL_CATEGORIES;
    }
  } catch (err) {
    console.error('Error loading data file, using defaults:', err.message);
  }
}

function saveData() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
  } catch (err) {
    console.error('Error saving data:', err.message);
  }
}

// Admin Authentication Middleware
const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized. Please login to admin panel.' });
  }

  const token = authHeader.split(' ')[1];
  if (!activeAdminTokens.has(token)) {
    return res.status(401).json({ success: false, message: 'Admin session expired or invalid token.' });
  }

  next();
};

// PUBLIC API ROUTES

// 1. GET /api/products
app.get('/api/products', (req, res) => {
  const { category, search, sort } = req.query;
  let result = [...db.products];

  if (category && category.toLowerCase() !== 'all') {
    result = result.filter(
      p => p.categorySlug.toLowerCase() === category.toLowerCase() ||
           p.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (search) {
    const term = search.toLowerCase();
    result = result.filter(
      p => p.name.toLowerCase().includes(term) ||
           p.description.toLowerCase().includes(term)
    );
  }

  if (sort === 'price-low') {
    result.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-high') {
    result.sort((a, b) => b.price - a.price);
  }

  res.json({
    success: true,
    count: result.length,
    products: result
  });
});

// 2. GET /api/products/:slug
app.get('/api/products/:slug', (req, res) => {
  const { slug } = req.params;
  const product = db.products.find(p => p.slug === slug || p.id === slug);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  res.json({ success: true, product });
});

// 3. GET /api/categories
app.get('/api/categories', (req, res) => {
  const categoriesWithCounts = db.categories.map(cat => ({
    ...cat,
    count: cat.slug === 'all'
      ? db.products.length
      : db.products.filter(p => p.categorySlug.toLowerCase() === cat.slug.toLowerCase()).length
  }));

  res.json({ success: true, categories: categoriesWithCounts });
});

// SECURE ADMIN API ROUTES

// Admin Login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;

  if (password === ADMIN_PASSWORD) {
    const token = 'admin_session_' + crypto.randomBytes(16).toString('hex');
    activeAdminTokens.add(token);
    return res.json({
      success: true,
      message: 'Admin authentication successful',
      token
    });
  }

  res.status(401).json({
    success: false,
    message: 'Incorrect admin password'
  });
});

// Admin Image Upload
app.post('/api/admin/upload', verifyAdmin, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No image file uploaded' });
  }

  const imageUrl = `/images/${req.file.filename}`;
  res.json({
    success: true,
    message: 'Image uploaded successfully',
    imageUrl
  });
});

// Admin Add Product
app.post('/api/admin/products', verifyAdmin, (req, res) => {
  const { name, category, price, originalPrice, description, craftingNotice, image, specifications } = req.body;

  if (!name || !category || !price || !description || !image) {
    return res.status(400).json({ success: false, message: 'Missing required product fields.' });
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const categorySlug = category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const newProduct = {
    id: `prod_${Date.now()}`,
    slug,
    name,
    category,
    categorySlug,
    price: Number(price),
    originalPrice: originalPrice ? Number(originalPrice) : null,
    image,
    description,
    inStock: true,
    craftingNotice: craftingNotice || 'Handmade in small batches — please allow 5–7 days for your piece to ship.',
    specifications: specifications || []
  };

  db.products.unshift(newProduct);

  // Auto add category if not present
  const catExists = db.categories.some(c => c.slug.toLowerCase() === categorySlug);
  if (!catExists) {
    db.categories.push({ name: category, slug: categorySlug });
  }

  saveData();

  res.status(201).json({
    success: true,
    message: 'New product added to catalog successfully!',
    product: newProduct
  });
});

// Admin Delete Product
app.delete('/api/admin/products/:id', verifyAdmin, (req, res) => {
  const { id } = req.params;
  const initialCount = db.products.length;
  db.products = db.products.filter(p => p.id !== id && p.slug !== id);

  if (db.products.length === initialCount) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  saveData();
  res.json({ success: true, message: 'Product removed from catalog.' });
});

// Admin Add Category
app.post('/api/admin/categories', verifyAdmin, (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ success: false, message: 'Category name is required' });
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const exists = db.categories.some(c => c.slug.toLowerCase() === slug);
  if (exists) {
    return res.status(400).json({ success: false, message: 'Category already exists' });
  }

  const newCategory = { name, slug };
  db.categories.push(newCategory);
  saveData();

  res.status(201).json({
    success: true,
    message: 'Category added successfully',
    category: newCategory
  });
});

// Admin Delete Category
app.delete('/api/admin/categories/:slug', verifyAdmin, (req, res) => {
  const { slug } = req.params;

  if (slug.toLowerCase() === 'all') {
    return res.status(400).json({ success: false, message: 'Cannot remove default "All" category.' });
  }

  const initialCount = db.categories.length;
  db.categories = db.categories.filter(c => c.slug.toLowerCase() !== slug.toLowerCase());

  if (db.categories.length === initialCount) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }

  saveData();
  res.json({ success: true, message: 'Category removed successfully.' });
});

// Serve static frontend build files
app.use(express.static(path.join(__dirname, '../dist')));

// Fallback route for SPA
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    const indexPath = path.join(__dirname, '../dist/index.html');
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }
  }
  next();
});

app.listen(PORT, () => {
  console.log(`krosheknote backend server running at http://localhost:${PORT}`);
});
