import React, { useState } from 'react';
import axios from 'axios';
import { Contact } from '../types';

interface ContactFormProps {
    selectedContact: Contact | null;
    onClose: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ selectedContact, onClose }) => {
    const [name, setName] = useState<string>(selectedContact?.name || '');
    const [phone, setPhone] = useState<string>(selectedContact?.phone || '');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (selectedContact?.id != 0) {
                await axios.put(`http://localhost:8080/contacts/${selectedContact?.id}`, { name, phone });
            } else {
                await axios.post('http://localhost:8080/contacts', { name, phone });
            }
            onClose();
        } catch (error) {
            console.error('Error saving contact:', error);
        }
    };


    return (
        <div className="p-6 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">
                {selectedContact?.id != 0 ? 'Edit Contact' : 'Add Contact'}
            </h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Name</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Phone</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    Save
                </button>
                <button
                    type="button"
                    className="px-4 py-2 bg-gray-500 text-white rounded ml-2 hover:bg-gray-600"
                    onClick={onClose}
                >
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default ContactForm;
