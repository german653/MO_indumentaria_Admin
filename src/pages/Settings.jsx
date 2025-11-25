import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Plus, Edit, Trash2 } from 'lucide-react';
import { supabase, categoryService } from '../lib/supabase';
import toast from 'react-hot-toast';

const Settings = () => {
  const [settings, setSettings] = useState({});
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState({ name: '', slug: '', description: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load settings
      const { data: settingsData } = await supabase
        .from('settings')
        .select('*');
      
      const settingsObj = {};
      settingsData?.forEach(item => {
        settingsObj[item.key] = item.value;
      });
      setSettings(settingsObj);

      // Load categories
      const categoriesData = await categoryService.getAll();
      setCategories(categoriesData);
    } catch (error) {
      toast.error('Error al cargar configuración');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update each setting
      for (const [key, value] of Object.entries(settings)) {
        await supabase
          .from('settings')
          .upsert({ key, value, type: 'text' });
      }

      toast.success('Configuración guardada');
    } catch (error) {
      toast.error('Error al guardar configuración');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    
    try {
      await categoryService.create(newCategory);
      toast.success('Categoría creada');
      setNewCategory({ name: '', slug: '', description: '' });
      loadData();
    } catch (error) {
      toast.error('Error al crear categoría');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta categoría?')) return;

    try {
      await categoryService.delete(id);
      toast.success('Categoría eliminada');
      loadData();
    } catch (error) {
      toast.error('Error al eliminar categoría');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-600 mt-1">Ajustes generales de tu tienda</p>
      </div>

      {/* General Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-sm"
      >
        <h2 className="text-xl font-semibold mb-6">Información General</h2>
        
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Site Name */}
            <div>
              <label className="block text-sm font-semibold mb-2">Nombre del Sitio</label>
              <input
                type="text"
                value={settings.site_name || ''}
                onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Contact Email */}
            <div>
              <label className="block text-sm font-semibold mb-2">Email de Contacto</label>
              <input
                type="email"
                value={settings.contact_email || ''}
                onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Contact Phone */}
            <div>
              <label className="block text-sm font-semibold mb-2">Teléfono</label>
              <input
                type="tel"
                value={settings.contact_phone || ''}
                onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Instagram */}
            <div>
              <label className="block text-sm font-semibold mb-2">Instagram URL</label>
              <input
                type="url"
                value={settings.instagram_url || ''}
                onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Free Shipping Threshold */}
            <div>
              <label className="block text-sm font-semibold mb-2">Umbral de Envío Gratis</label>
              <input
                type="number"
                value={settings.free_shipping_threshold || ''}
                onChange={(e) => setSettings({ ...settings, free_shipping_threshold: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Shipping Cost */}
            <div>
              <label className="block text-sm font-semibold mb-2">Costo de Envío</label>
              <input
                type="number"
                value={settings.shipping_cost || ''}
                onChange={(e) => setSettings({ ...settings, shipping_cost: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Site Description */}
          <div>
            <label className="block text-sm font-semibold mb-2">Descripción del Sitio</label>
            <textarea
              value={settings.site_description || ''}
              onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
              rows="3"
              className="w-full px-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </form>
      </motion.div>

      {/* Categories Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 shadow-sm"
      >
        <h2 className="text-xl font-semibold mb-6">Gestión de Categorías</h2>

        {/* Add Category Form */}
        <form onSubmit={handleAddCategory} className="mb-6 p-4 bg-gray-50 rounded-xl">
          <div className="grid md:grid-cols-4 gap-4">
            <input
              type="text"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              placeholder="Nombre"
              required
              className="px-4 py-3 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <input
              type="text"
              value={newCategory.slug}
              onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
              placeholder="Slug"
              required
              className="px-4 py-3 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <input
              type="text"
              value={newCategory.description}
              onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              placeholder="Descripción"
              className="px-4 py-3 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Agregar
            </button>
          </div>
        </form>

        {/* Categories List */}
        <div className="space-y-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div>
                <h3 className="font-semibold">{category.name}</h3>
                <p className="text-sm text-gray-600">/{category.slug}</p>
                {category.description && (
                  <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                )}
              </div>
              <button
                onClick={() => handleDeleteCategory(category.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Newsletter Subscribers Count */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 text-white shadow-lg"
      >
        <h2 className="text-xl font-semibold mb-2">Newsletter</h2>
        <p className="text-primary-100">
          Gestiona los suscriptores desde la base de datos de Supabase
        </p>
      </motion.div>
    </div>
  );
};

export default Settings;