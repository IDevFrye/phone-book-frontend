import React, { useState } from 'react';
import ContactList from './components/ContactList';
import ContactForm from './components/ContactForm';
import TagsManager from './components/TagsManager';
import { Contact, Tag } from './types';

const App: React.FC = () => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [contactIdForTags, setContactIdForTags] = useState<number | null>(null);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);

  const handleEditContact = (contact: Contact | null) => {
    setSelectedContact(contact);
  };


  const handleManageTags = (contactId: number) => {
    setContactIdForTags(contactId);
  };

  const handleCloseContactForm = () => {
    setSelectedContact(null);
  };

  const handleTagSelect = (tag: Tag | null) => {
    setSelectedTag(tag);
  };

  return (
    <div className="App">
      {selectedContact ? (
        <ContactForm selectedContact={selectedContact} onClose={handleCloseContactForm} />
      ) : contactIdForTags ? (
        <TagsManager contactId={contactIdForTags} onClose={() => setContactIdForTags(null)} />
      ) : (
        <ContactList
          selectedTag={selectedTag}
          onEdit={handleEditContact}
          onManageTags={handleManageTags}
          onTagSelect={handleTagSelect}
        />
      )}
    </div>
  );
};

export default App;
