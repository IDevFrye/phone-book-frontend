import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Tag } from '../types';

interface TagsManagerProps {
    contactId: number;
    onClose: () => void;
}

const TagsManager: React.FC<TagsManagerProps> = ({ contactId, onClose }) => {
    const [tags, setTags] = useState<Tag[]>([]);
    const [availableTags, setAvailableTags] = useState<Tag[]>([]);
    const [newTagId, setNewTagId] = useState<string>('');

    useEffect(() => {
        fetchTags();
        fetchAvailableTags();
    }, []);

    const fetchTags = async () => {
        try {
            const response = await axios.get<Tag[]>(`http://localhost:8080/contacts/${contactId}/tags`);
            setTags(response.data);
        } catch (error) {
            console.error('Error fetching tags:', error);
        }
    };

    const fetchAvailableTags = async () => {
        try {
            const response = await axios.get<Tag[]>('http://localhost:8080/tags');
            setAvailableTags(response.data);
        } catch (error) {
            console.error('Error fetching available tags:', error);
        }
    };

    const addTag = async () => {
        try {
            await axios.post(`http://localhost:8080/contacts/${contactId}/tags`, [parseInt(newTagId)]);
            fetchTags();
        } catch (error) {
            console.error('Error adding tag:', error);
        }
    };

    const removeTag = async (tagId: number) => {
        try {
            await axios.delete(`http://localhost:8080/contacts/${contactId}/tags/${tagId}`);
            fetchTags();
        } catch (error) {
            console.error('Error removing tag:', error);
        }
    };

    return (
        <div className="p-6 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Manage Tags</h2>
            <ul>
                {tags.map((tag) => (
                    <li key={tag.id} className="flex justify-between items-center mb-2">
                        {tag.name}
                        <button
                            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                            onClick={() => removeTag(tag.id)}
                        >
                            Remove
                        </button>
                    </li>
                ))}
            </ul>
            <select
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newTagId}
                onChange={(e) => setNewTagId(e.target.value)}
            >
                <option value="">Select a tag</option>
                {availableTags.map((tag) => (
                    <option key={tag.id} value={tag.id}>
                        {tag.name}
                    </option>
                ))}
            </select>
            <button
                className="mx-1 px-4 py-2 bg-blue-500 text-white rounded mt-2 hover:bg-blue-600"
                onClick={addTag}
            >
                Add Tag
            </button>
            <button
                className="px-4 py-2 bg-gray-500 text-white rounded mt-2 hover:bg-gray-600"
                onClick={onClose}
            >
                Close
            </button>
        </div>
    );
};

export default TagsManager;
