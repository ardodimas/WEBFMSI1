import { useContext, useState, useEffect } from "react";
import { Modal, Button, Spin, Form, Input, message, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { AuthContext } from "../../providers/AuthProvider";
import { editDataPrivatePut } from "../../utils/api";

import './Profile.css';
import React from 'react';

export default function Profile() {
  const { userProfile, isLoadingScreen } = useContext(AuthContext);
  const [address, setAddress] = useState('');
  const [isEditAddressModalOpen, setIsEditAddressModalOpen] = useState(false);
  const [editAddressForm] = Form.useForm();
  const [phone, setPhone] = useState('');
  const [isEditPhoneModalOpen, setIsEditPhoneModalOpen] = useState(false);
  const [editPhoneForm] = Form.useForm();
  
  // Load alamat dari localStorage berdasarkan user ID
  useEffect(() => {
    if (userProfile?.id) {
      const savedAddress = localStorage.getItem(`userAddress_${userProfile.id}`);
      if (savedAddress) {
        setAddress(savedAddress);
      } else {
        setAddress('Jalan Nuri GG 1 NO 2 Kaliuntu, di samping kober pelang Permata Salon');
      }
    }
  }, [userProfile?.id]);

  // Ambil nomor telepon dari backend (userProfile.phone)
  useEffect(() => {
    if (userProfile?.phone) {
      setPhone(userProfile.phone);
    } else {
      setPhone('');
    }
  }, [userProfile?.phone]);

  const handleEditAlamat = () => {
    editAddressForm.setFieldsValue({ address: address });
    setIsEditAddressModalOpen(true);
  };

  const handleSaveAddress = async () => {
    try {
      const values = await editAddressForm.validateFields();
      const newAddress = values.address;
      if (userProfile?.id) {
        localStorage.setItem(`userAddress_${userProfile.id}`, newAddress);
        setAddress(newAddress);
        setIsEditAddressModalOpen(false);
        message.success('Alamat berhasil diperbarui!');
      } else {
        message.error('User ID tidak ditemukan');
      }
    } catch (error) {
      console.error('Error saving address:', error);
      message.error('Gagal menyimpan alamat');
    }
  };

  const handleCancelEditAddress = () => {
    setIsEditAddressModalOpen(false);
    editAddressForm.resetFields();
  };
  
  const handleEditPhone = () => {
    editPhoneForm.setFieldsValue({ phone: phone });
    setIsEditPhoneModalOpen(true);
  };

  // Update nomor telepon ke backend
  const handleSavePhone = async () => {
    try {
      const values = await editPhoneForm.validateFields();
      const newPhone = values.phone;
      if (userProfile?.id) {
        await editDataPrivatePut(`/api/users/${userProfile.id}`, { phone: newPhone });
        setPhone(newPhone);
        setIsEditPhoneModalOpen(false);
        message.success('Nomor telepon berhasil diperbarui!');
        // Optional: reload halaman atau profile jika ingin update AuthContext
      } else {
        message.error('User ID tidak ditemukan');
      }
    } catch (error) {
      console.error('Error saving phone:', error);
      message.error('Gagal menyimpan nomor telepon');
    }
  };

  const handleCancelEditPhone = () => {
    setIsEditPhoneModalOpen(false);
    editPhoneForm.resetFields();
  };

  // Tampilkan loading jika masih memuat data
  if (isLoadingScreen) {
    return (
      <div className="profile-page">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Spin size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* Modal Edit Alamat */}
      <Modal
        title="Edit Alamat"
        open={isEditAddressModalOpen}
        onOk={handleSaveAddress}
        onCancel={handleCancelEditAddress}
        okText="Simpan"
        cancelText="Batal"
        width={500}
      >
        <Form
          form={editAddressForm}
          layout="vertical"
          onFinish={handleSaveAddress}
        >
          <Form.Item
            name="address"
            label="Alamat Lengkap"
            rules={[
              { required: true, message: 'Alamat tidak boleh kosong!' },
              { min: 10, message: 'Alamat minimal 10 karakter!' }
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Masukkan alamat lengkap Anda"
              maxLength={500}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Edit Nomor Telepon */}
      <Modal
        title="Edit Nomor Telepon"
        open={isEditPhoneModalOpen}
        onOk={handleSavePhone}
        onCancel={handleCancelEditPhone}
        okText="Simpan"
        cancelText="Batal"
        width={400}
      >
        <Form
          form={editPhoneForm}
          layout="vertical"
          onFinish={handleSavePhone}
        >
          <Form.Item
            name="phone"
            label="Nomor Telepon"
            rules={[
              { required: true, message: 'Nomor telepon tidak boleh kosong!' },
              { pattern: /^\d{10,15}$/, message: 'Nomor telepon harus 10-15 digit angka!' }
            ]}
          >
            <Input
              placeholder="Masukkan nomor telepon"
              maxLength={15}
            />
          </Form.Item>
        </Form>
      </Modal>

      <div className="profile-content">
        <Avatar 
          size={140} 
          icon={<UserOutlined />} 
          className="profile-avatar"
          style={{
            backgroundColor: '#a7374a',
            border: '4px solid #a7374a',
            fontSize: '60px'
          }}
        />
        <div className="profile-name">{userProfile?.name || 'User'}</div>
        <div className="profile-label">Email</div>
        <div className="profile-box">
          <a href={`mailto:${userProfile?.email || ''}`}>
            {userProfile?.email || 'Email tidak tersedia'}
          </a>
        </div>
        <div className="profile-label">Nomor Telepon</div>
        <div className="profile-box profile-box-phone">
          <span>{phone || 'Nomor telepon tidak tersedia'}</span>
          <span className="edit-addr phone-edit-icon" onClick={handleEditPhone} title="Edit nomor telepon">
            <svg width="20" height="20" viewBox="0 0 20 20">
              <path d="M14.85 2.85a1.2 1.2 0 0 1 1.7 1.7l-1.1 1.1-1.7-1.7 1.1-1.1zm-2 2 1.7 1.7-7.2 7.2c-.1.1-.2.2-.3.3l-2.1.6.6-2.1c.1-.1.2-.2.3-.3l7.2-7.2z" fill="#a7374a"/>
            </svg>
          </span>
        </div>
        <div className="profile-label">Alamat Lengkap</div>
        <div className="profile-box profile-box-alamat">
          {address || 'Alamat belum diisi'}
          <span className="edit-addr" onClick={handleEditAlamat} title="Edit alamat">
            <svg width="20" height="20" viewBox="0 0 20 20">
              <path d="M14.85 2.85a1.2 1.2 0 0 1 1.7 1.7l-1.1 1.1-1.7-1.7 1.1-1.1zm-2 2 1.7 1.7-7.2 7.2c-.1.1-.2.2-.3.3l-2.1.6.6-2.1c.1-.1.2-.2.3-.3l7.2-7.2z" fill="#a7374a"/>
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}
