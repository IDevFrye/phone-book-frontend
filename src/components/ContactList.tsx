import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AxiosResponse } from 'axios';
import { Contact, Tag } from '../types';

interface ContactListProps {
    onEdit: (contact: Contact | null) => void;
    onManageTags: (contactId: number) => void;
    onTagSelect: (tag: Tag | null) => void;
    selectedTag: Tag | null;
}

const ContactList: React.FC<ContactListProps> = ({
    onEdit,
    onManageTags,
    onTagSelect,
    selectedTag,
}) => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [tagsMap, setTagsMap] = useState<Record<number, Tag[]>>({});
    const [tags, setTags] = useState<Tag[]>([]);
    const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState<string | null>(null);

    const pageSize = 8;

    useEffect(() => {
        fetchTags();
        fetchContacts();
    }, [selectedTag]);

    useEffect(() => {
        paginateContacts();
    }, [contacts, page]);

    const fetchTags = async () => {
        try {
            const response = await axios.get<Tag[]>('http://localhost:8080/tags');
            setTags(response.data);
        } catch (error) {
            console.error('Error fetching tags:', error);
        }
    };

    const fetchContacts = async () => {
        try {
            let response: AxiosResponse<Contact[]>;
            if (selectedTag == null) {
                response = await axios.get<Contact[]>('http://localhost:8080/contacts');
            } else {
                response = await axios.get<Contact[]>(`http://localhost:8080/contacts/${selectedTag?.id || 0}`);
            }

            if (Array.isArray(response.data)) {
                setContacts(response.data);
            } else {
                console.error('Expected an array of contacts, but got:', response.data);
            }
            fetchTagsForContacts(response.data);
        } catch (error) {
            console.error('Error fetching contacts:', error);
        }
    };

    const paginateContacts = () => {
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        setFilteredContacts(contacts.slice(startIndex, endIndex));
        setTotalPages(Math.ceil(contacts.length / pageSize));
    };

    const fetchTagsForContacts = async (contacts: Contact[]) => {
        try {
            const tagsResponse = await Promise.all(
                contacts.map((contact) =>
                    axios.get<Tag[]>(`http://localhost:8080/contacts/${contact.id}/tags`)
                )
            );
            const tagsData: Record<number, Tag[]> = {};
            contacts.forEach((contact, index) => {
                tagsData[contact.id] = tagsResponse[index].data;
            });
            setTagsMap(tagsData);
        } catch (error) {
            console.error('Error fetching tags for contacts:', error);
        }
    };

    const deleteContact = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this contact?')) return;

        try {
            await axios.delete(`http://localhost:8080/contacts/${id}`);
            fetchContacts();
        } catch (error) {
            console.error('Error deleting contact:', error);
        }
    };

    const getColorForTag = (tagId: number) => {
        const colors = ['bg-red-100 text-red-700', 'bg-blue-100 text-blue-700', 'bg-yellow-100 text-yellow-700', 'bg-purple-100 text-purple-700', 'bg-green-100 text-green-700', 'bg-gray-100 text-gray-700'];
        return colors[tagId % colors.length];
    };

    return (
        <div className="p-6 bg-gray-100 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Contacts</h2>
                <button
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    onClick={() => onEdit({ id: 0, name: '', phone: '' })}
                >
                    Add Contact
                </button>
            </div>
            <div className="flex space-x-2 mb-4">
                <button
                    className={`px-4 py-2 rounded ${!selectedTag ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                    onClick={() => onTagSelect(null)}
                >
                    All
                </button>
                {tags.map((tag) => (
                    <button
                        key={tag.id}
                        className={`px-4 py-2 rounded ${selectedTag?.name === tag.name ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                        onClick={() => onTagSelect(tag)}
                    >
                        {tag.name}
                    </button>
                ))}
            </div>
            <table className="table-auto w-full text-left bg-white rounded-lg shadow">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="p-3 border-b">Name</th>
                        <th className="p-3 border-b">Phone</th>
                        <th className="p-3 border-b">Tags</th>
                        <th className="p-3 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredContacts.map((contact) => (
                        <tr key={contact.id} className="hover:bg-gray-100">
                            <td className="p-3 border-b">{contact.name}</td>
                            <td className="p-3 border-b">{contact.phone}</td>
                            <td className="p-3 border-b">
                                {tagsMap[contact.id]?.map((tag) => (
                                    <span
                                        key={tag.id}
                                        className={`px-2 py-1 text-sm rounded-full ${getColorForTag(tag.id)} mr-1`}
                                    >
                                        {tag.name}
                                    </span>
                                )) || 'No tags'}
                            </td>
                            <td className="p-3 border-b">
                                <button
                                    className="px-4 py-2 bg-blue-500 text-white rounded mr-2 hover:bg-blue-600"
                                    onClick={() => onEdit(contact)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="px-4 py-2 bg-gray-500 text-white rounded mr-2 hover:bg-gray-600"
                                    onClick={() => onManageTags(contact.id)}
                                >
                                    Manage Tags
                                </button>
                                <button
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                    onClick={() => deleteContact(contact.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-between mt-4">
                <button
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                >
                    Previous
                </button>
                <span className="px-4 py-2">
                    Page {page} of {totalPages}
                </span>
                <button
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ContactList;
