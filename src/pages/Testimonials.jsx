import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Star, X, Upload, Loader } from 'lucide-react';
import { testimonialService, storageService } from '../lib/supabase';
import toast from 'react-hot-toast';
import DeleteModal from '../components/DeleteModal'; // <--- IMPORTANTE

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados Modal Edición
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [uploading, setUploading] = useState(false);

  // --- NUEVOS ESTADOS PARA BORRAR ---
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  // ---------------------------------

  const [formData, setFormData] = useState({
    name: '',
    rating: 5,
    comment: '',
    image: '',
    active: true
  });

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      const data = await testimonialService.getAll();
      setTestimonials(data);
    } catch (error) {
      toast.error('Error al cargar testimonios');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData(testimonial);
    setModalOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingTestimonial(null);
    setFormData({
      name: '',
      rating: 5,
      comment: '',
      image: '',
      active: true
    });
    setModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await storageService.uploadFile(file, 'testimonials');
      setFormData({ ...formData, image: url });
      toast.success('Foto cargada');
    } catch (error) {
      toast.error('Error al subir foto');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (uploading) return;
    setLoading(true);

    try {
      if (editingTestimonial) {
        await testimonialService.update(editingTestimonial.id, formData);
        toast.success('Testimonio actualizado');
      } else {
        await testimonialService.create(formData);
        toast.success('Testimonio creado');
      }
      setModalOpen(false);
      loadTestimonials();
    } catch (error) {
      toast.error('Error al guardar testimonio');
    } finally {
      setLoading(false);
    }
  };

  // --- LÓGICA DE BORRADO ---
  const handleClickDelete = (testimonial) => {
    setItemToDelete(testimonial);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      await testimonialService.delete(itemToDelete.id);
      toast.success('Testimonio eliminado');
      loadTestimonials();
    } catch (error) {
      toast.error('Error al eliminar');
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };
  // -------------------------

  return (
    <div className="space-y-6">
      {/* --- MODAL DE BORRADO --- */}
      <DeleteModal 
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="¿Eliminar testimonio?"
        message={`¿Estás seguro que deseas eliminar el comentario de "${itemToDelete?.name}"?`}
        isDeleting={isDeleting}
      />

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Testimonios</h1>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nuevo Testimonio
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                {testimonial.image ? (
                  <img src={testimonial.image} alt={testimonial.name} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500">
                    {testimonial.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < testimonial.rating ? 'fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button onClick={() => handleEdit(testimonial)} className="p-1.5 text-gray-500 hover:bg-gray-50 rounded-lg">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleClickDelete(testimonial)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-4">"{testimonial.comment}"</p>

            <div className="flex items-center justify-between text-xs">
              <span className={`px-2 py-1 rounded-full ${testimonial.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                {testimonial.active ? 'Visible' : 'Oculto'}
              </span>
              <span className="text-gray-400">
                {new Date(testimonial.created_at).toLocaleDateString()}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-lg shadow-xl"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-bold">
                  {editingTestimonial ? 'Editar Testimonio' : 'Nuevo Testimonio'}
                </h2>
                <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Cliente</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black/5 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Puntuación (1-5)</label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black/5 outline-none"
                  >
                    {[5, 4, 3, 2, 1].map(num => (
                      <option key={num} value={num}>{num} Estrellas</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Comentario</label>
                  <textarea
                    required
                    rows="3"
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black/5 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Foto del Cliente (Opcional)
                  </label>
                  
                  <div className="flex items-center gap-4">
                    {formData.image ? (
                      <div className="relative w-16 h-16 shrink-0">
                        <img 
                          src={formData.image} 
                          alt="Preview" 
                          className="w-full h-full object-cover rounded-full border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData({...formData, image: ''})}
                          className="absolute -top-1 -right-1 p-1 bg-white text-red-500 rounded-full shadow-sm hover:bg-red-50 border border-gray-200"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-16 h-16 shrink-0 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 border border-dashed border-gray-300">
                        <span className="text-xl">?</span>
                      </div>
                    )}

                    <label className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      {uploading ? (
                        <Loader className="w-5 h-5 animate-spin" />
                      ) : (
                        <Upload className="w-5 h-5 text-gray-500" />
                      )}
                      <span className="text-sm font-medium text-gray-600">
                        {uploading ? 'Subiendo...' : 'Seleccionar archivo'}
                      </span>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
                    />
                    <span className="font-semibold text-gray-700">Mostrar en la web</span>
                  </label>
                </div>

                <div className="flex gap-4 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 px-6 py-3 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading || uploading}
                    className="flex-1 px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 disabled:opacity-50 shadow-lg"
                  >
                    {loading ? 'Guardando...' : editingTestimonial ? 'Actualizar' : 'Crear'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Testimonials;