import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('❌ Faltan las variables de entorno de Supabase en el archivo .env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ==========================================
// PRODUCTS SERVICE
// ==========================================
export const productService = {
  // Obtener todos los productos (admin ve todos, tienda solo activos)
  async getAll(onlyActive = false) {
    let query = supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (onlyActive) {
      query = query.eq('active', true);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  // Obtener producto por slug
  async getBySlug(slug) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .eq('active', true)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Obtener producto por ID
  async getById(id) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Obtener productos destacados
  async getFeatured() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .eq('featured', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Obtener productos por categoría
  async getByCategory(categoryName) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .eq('category_name', categoryName)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Crear producto
  async create(product) {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Actualizar producto
  async update(id, updates) {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Eliminar producto
  async delete(id) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  // Actualizar stock
  async updateStock(id, quantity) {
    const { data, error } = await supabase
      .from('products')
      .update({ stock: quantity })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Toggle active/inactive
  async toggleActive(id, active) {
    const { data, error } = await supabase
      .from('products')
      .update({ active })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// ==========================================
// CATEGORIES SERVICE
// ==========================================
export const categoryService = {
  async getAll() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  async getBySlug(slug) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(category) {
    const { data, error } = await supabase
      .from('categories')
      .insert([category])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};

// ==========================================
// ORDERS SERVICE
// ==========================================
export const orderService = {
  async getAll() {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(order) {
    const { data, error } = await supabase
      .from('orders')
      .insert([order])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateStatus(id, status) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};

// ==========================================
// TESTIMONIALS SERVICE
// ==========================================
export const testimonialService = {
  async getAll(onlyActive = false) {
    let query = supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (onlyActive) {
      query = query.eq('active', true);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async create(testimonial) {
    const { data, error } = await supabase
      .from('testimonials')
      .insert([testimonial])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('testimonials')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  async toggleActive(id, active) {
    const { data, error } = await supabase
      .from('testimonials')
      .update({ active })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// ==========================================
// NEWSLETTER SERVICE
// ==========================================
export const newsletterService = {
  async getAll() {
    const { data, error } = await supabase
      .from('newsletter')
      .select('*')
      .order('subscribed_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async subscribe(email) {
    const { data, error } = await supabase
      .from('newsletter')
      .insert([{ email }])
      .select()
      .single();
    
    if (error) {
      if (error.code === '23505') { // Duplicate email
        throw new Error('Este email ya está suscrito');
      }
      throw error;
    }
    return data;
  },

  async unsubscribe(email) {
    const { error } = await supabase
      .from('newsletter')
      .delete()
      .eq('email', email);
    
    if (error) throw error;
    return true;
  }
};

// ==========================================
// SETTINGS SERVICE
// ==========================================
export const settingsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('settings')
      .select('*');
    
    if (error) throw error;
    
    // Convert array to object
    const settings = {};
    data?.forEach(item => {
      settings[item.key] = item.value;
    });
    
    return settings;
  },

  async get(key) {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', key)
      .single();
    
    if (error) throw error;
    return data?.value;
  },

  async set(key, value, type = 'text') {
    const { data, error } = await supabase
      .from('settings')
      .upsert({ key, value, type })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async setMultiple(settings) {
    const updates = Object.entries(settings).map(([key, value]) => ({
      key,
      value: String(value),
      type: 'text'
    }));

    const { data, error } = await supabase
      .from('settings')
      .upsert(updates)
      .select();
    
    if (error) throw error;
    return data;
  }
};

// ==========================================
// STATS SERVICE
// ==========================================
export const statsService = {
  async getStats() {
    const { data, error } = await supabase
      .from('admin_stats')
      .select('*')
      .single();
    
    if (error) throw error;
    return data;
  }
};

// ==========================================
// REALTIME SUBSCRIPTIONS
// ==========================================
export const subscribeToProducts = (callback) => {
  return supabase
    .channel('products-channel')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'products' },
      callback
    )
    .subscribe();
};

export const subscribeToOrders = (callback) => {
  return supabase
    .channel('orders-channel')
    .on('postgres_changes',
      { event: '*', schema: 'public', table: 'orders' },
      callback
    )
    .subscribe();
};

// Helper para desuscribirse
export const unsubscribe = (channel) => {
  supabase.removeChannel(channel);
};

export const storageService = {
  async uploadFile(file, folder = 'general') {
    // 1. Crear un nombre único para el archivo (para no sobrescribir)
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}_${Math.random()}.${fileExt}`;

    // 2. Subir el archivo al bucket 'images'
    const { error: uploadError } = await supabase.storage
      .from('images') // Asegurate que tu bucket se llame 'images'
      .upload(fileName, file);

    if (uploadError) {
      console.error('Error subiendo imagen:', uploadError);
      throw uploadError;
    }

    // 3. Obtener la URL pública para guardarla en la base de datos
    const { data } = supabase.storage
      .from('images')
      .getPublicUrl(fileName);

    return data.publicUrl;
  },

  // (Opcional) Borrar imagen si borras el producto
  async deleteFile(url) {
    if (!url) return;
    // Extraer el path del archivo desde la URL
    const path = url.split('/storage/v1/object/public/images/')[1];
    if (path) {
      await supabase.storage.from('images').remove([path]);
    }
  }
};