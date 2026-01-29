import mongoose from 'mongoose';

// Hapus model lama jika ada konflik (untuk development)
mongoose.models = {};

const ServerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: String, default: 'ZILDJIAN' },
  node: { type: String, default: '20' }, // Node version
  ram: { type: String, default: '1GB' },
  status: { type: String, default: 'offline' },
  createdAt: { type: Date, default: Date.now }
});

export const Server = mongoose.model('Server', ServerSchema);
