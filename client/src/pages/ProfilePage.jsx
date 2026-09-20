import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);

  // Address form
  const [newAddress, setNewAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    streetAddress: '',
    city: '',
    state: 'Karnataka',
    postalCode: '',
    landmark: '',
    isDefault: false,
  });

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone);
      setAddresses(user.addresses || []);
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setUpdatingProfile(true);
      const res = await api.put('/auth/profile', { name, phone });
      if (res.data.success) {
        updateUser(res.data.data.user);
        alert('Profile details updated successfully');
      } else {
        alert(res.data.message || 'Profile update failed');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating profile');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/address', newAddress);
      if (res.data.success) {
        setAddresses(res.data.data.addresses);
        updateUser({ addresses: res.data.data.addresses });
        setShowAddressModal(false);
        setNewAddress({
          fullName: user?.name || '',
          phone: user?.phone || '',
          streetAddress: '',
          city: '',
          state: 'Karnataka',
          postalCode: '',
          landmark: '',
          isDefault: false,
        });
      } else {
        alert(res.data.message || 'Failed to save address');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving address');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Delete this saved address?')) return;
    try {
      const res = await api.delete(`/auth/address/${addressId}`);
      if (res.data.success) {
        setAddresses(res.data.data.addresses);
        updateUser({ addresses: res.data.data.addresses });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting address');
    }
  };

  return (
    <div className="py-6 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          My Account & Saved Addresses
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your personal information and delivery locations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Profile Details Form */}
        <div className="md:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <User className="w-4 h-4 text-teal-600" />
            <span>Personal Details</span>
          </h2>

          <form onSubmit={handleUpdateProfile} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-600 mb-1 font-medium">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-slate-600 mb-1 font-medium">Email Address</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full bg-slate-100 border border-slate-200 rounded-lg p-2.5 text-slate-500 cursor-not-allowed"
              />
              <span className="text-[10px] text-slate-400">Email cannot be changed</span>
            </div>

            <div>
              <label className="block text-slate-600 mb-1 font-medium">Phone Number</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <button
              type="submit"
              disabled={updatingProfile}
              className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition"
            >
              {updatingProfile ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>

        {/* Address Book */}
        <div className="md:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-600" />
              <span>Saved Delivery Addresses</span>
            </h2>
            <button
              onClick={() => setShowAddressModal(true)}
              className="text-xs font-bold text-teal-600 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Address
            </button>
          </div>

          {addresses.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">
              No delivery addresses saved yet. Add one for quick checkout!
            </p>
          ) : (
            <div className="space-y-3">
              {addresses.map((addr) => (
                <div
                  key={addr._id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <span>{addr.fullName}</span>
                      {addr.isDefault && (
                        <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-1.5 py-0.2 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="text-slate-600">{addr.streetAddress}</div>
                    <div className="text-slate-600">
                      {addr.city}, {addr.state} - <strong>{addr.postalCode}</strong>
                    </div>
                    <div className="text-slate-500 pt-0.5">Phone: {addr.phone}</div>
                  </div>

                  <button
                    onClick={() => handleDeleteAddress(addr._id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                    title="Delete address"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Modal / Form to add address */}
          {showAddressModal && (
            <form onSubmit={handleAddAddress} className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <h3 className="text-xs font-bold text-slate-900">Add New Address</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newAddress.fullName}
                    onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-900"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-slate-600 mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    value={newAddress.streetAddress}
                    onChange={(e) => setNewAddress({ ...newAddress, streetAddress: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Postal PIN Code</label>
                  <input
                    type="text"
                    required
                    pattern="^[1-9][0-9]{5}$"
                    placeholder="e.g. 560034"
                    value={newAddress.postalCode}
                    onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-900"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-teal-600 text-white hover:bg-teal-700"
                >
                  Save Address
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
