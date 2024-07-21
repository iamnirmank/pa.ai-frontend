"use client";

import React, { useEffect, useState } from 'react';
import axiosInstance from '@/app/helper/axiosInstance';
import { FaEdit, FaTrash, FaUpload, FaSave, FaTimes, FaSpinner } from 'react-icons/fa';

interface Document {
  id: number;
  title: string;
  file: string;
  link: string | null;
  uploaded_at: string;
}

const DocumentManager: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileOrUrl, setFileOrUrl] = useState<'file' | 'url'>('file'); 
  const [url, setUrl] = useState('');
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedFile, setEditedFile] = useState<File | null>(null);
  const [editUrl, setEditUrl] = useState('');

  const [isUploading, setIsUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axiosInstance.get('chatmate/api/document/')
      .then(response => setDocuments(response.data))
      .catch(error => console.error("Error fetching documents:", error));
  }, [isEditing, loading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || (fileOrUrl === 'file' && !selectedFile) || (fileOrUrl === 'url' && !url)) return;

    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('title', newTitle);
    formData.append('link', fileOrUrl);

    if (fileOrUrl === 'file' && selectedFile) {
      formData.append('file', selectedFile);
    } else if (fileOrUrl === 'url') {
      formData.append('link', url);
    }

    axiosInstance.post('chatmate/api/document/upload_file/', formData)
      .then(response => {
        setDocuments([...documents, response.data]);
        setNewTitle('');
        setSelectedFile(null);
        setUrl('');
        setFileOrUrl('file');
        setIsUploading(false);
        setLoading(!loading);
      })
      .catch(error => {
        setUploadError("Error uploading document.");
        setIsUploading(false);
      });
  };

  const handleEditClick = (doc: Document) => {
    setEditingDocument(doc);
    setEditedTitle(doc.title);
    setEditedFile(null);
    setEditUrl('');
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(e.target.value);
  };

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setEditedFile(e.target.files[0]);
    }
  };

  const handleEditUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditUrl(e.target.value);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDocument) return;

    setIsEditing(true);
    setEditError(null);

    const formData = new FormData();
    formData.append('title', editedTitle);

    if (fileOrUrl === 'file' && editedFile) {
      formData.append('file', editedFile);
    } else if (fileOrUrl === 'url') {
      formData.append('link', editUrl);
    }

    axiosInstance.put(`chatmate/api/document/${editingDocument.id}/update_document/`, formData)
      .then(response => {
        setDocuments([]);
        setEditingDocument(null);
        setEditedTitle('');
        setEditedFile(null);
        setEditUrl('');
        setIsEditing(false);
      })
      .catch(error => {
        setEditError("Error updating document.");
        setIsEditing(false);
      });
  };

  const handleCancelEdit = () => {
    setEditingDocument(null);
    setEditedTitle('');
    setEditedFile(null);
    setEditUrl('');
  };

  const handleDelete = (id: number) => {
    axiosInstance.delete(`chatmate/api/document/${id}/`)
      .then(() => setDocuments(documents.filter(doc => doc.id !== id)))
      .catch(error => console.error("Error deleting document:", error));
  };

  return (
    <div className="document-manager p-4 bg-white shadow-md mt-4">
      <h2 className="text-xl font-semibold mb-4 text-[#1877F2]">Documents</h2>
      <form onSubmit={handleUpload} className="mb-4 flex flex-col space-y-2">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Document title"
          className="p-2 border border-gray-300 rounded-lg"
        />
        <div className="flex items-center mb-2">
          <label className="mr-2">
            <input
              type="radio"
              value="file"
              checked={fileOrUrl === 'file'}
              onChange={() => setFileOrUrl('file')}
              className="mr-1"
            />
            File
          </label>
          <label>
            <input
              type="radio"
              value="url"
              checked={fileOrUrl === 'url'}
              onChange={() => setFileOrUrl('url')}
              className="mr-1"
            />
            URL
          </label>
        </div>
        {fileOrUrl === 'file' ? (
          <input
            type="file"
            onChange={handleFileChange}
            className="border border-gray-300 rounded-lg"
          />
        ) : (
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Document URL"
            className="p-2 border border-gray-300 rounded-lg"
          />
        )}
        <button
          type="submit"
          className={`bg-[#EF5B2A] text-white p-2 rounded-lg flex items-center ${isUploading ? 'bg-[#e04b2a] cursor-not-allowed' : ''}`}
          disabled={isUploading}
        >
          {isUploading ? <FaSpinner className="animate-spin mr-2" /> : <FaUpload className="mr-2" />}
          {isUploading ? 'Uploading...' : 'Upload Document'}
        </button>
        {uploadError && <p className="text-red-500">{uploadError}</p>}
      </form>
      <div className="document-list">
        {documents.map(doc => (
          <div key={doc.id} className="document-item p-2 mb-2 flex justify-between items-center bg-[#FFFFFF] shadow-sm rounded-lg">
            {editingDocument?.id === doc.id && editingDocument ? (
              <form onSubmit={handleSaveEdit} className="flex items-center w-full">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={handleEditChange}
                  className="p-1 border border-gray-300 rounded-lg w-2/3 mr-2"
                />
                <div className="flex flex-col mr-2">
                  {fileOrUrl === 'file' ? (
                    <>
                      {editedFile ? (
                        <span className="text-gray-500 text-sm">{editedFile.name}</span>
                      ) : (
                        <span className="text-gray-500 text-sm">Current file: <a href={doc.file} target="_blank" rel="noopener noreferrer" className="text-[#1877F2] hover:underline">{doc.file}</a></span>
                      )}
                      <input
                        type="file"
                        onChange={handleEditFileChange}
                        className="border border-gray-300 rounded-lg"
                      />
                    </>
                  ) : (
                    <input
                      type="text"
                      value={editUrl}
                      onChange={handleEditUrlChange}
                      placeholder="Document URL"
                      className="p-2 border border-gray-300 rounded-lg"
                    />
                  )}
                </div>
                <button
                  type="submit"
                  className={`bg-[#1877F2] text-white p-1 rounded-lg flex items-center ${isEditing ? 'bg-[#125bb2] cursor-not-allowed' : ''}`}
                  disabled={isEditing}
                >
                  {isEditing ? <FaSpinner className="animate-spin mr-2" /> : <FaSave />}
                  {isEditing ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-red-500 text-white p-1 rounded-lg ml-2 flex items-center"
                >
                  <FaTimes />
                </button>
                {editError && <p className="text-red-500 ml-2">{editError}</p>}
              </form>
            ) : (
              <>
                <div>
                  <h3 className="text-lg font-semibold text-[#1877F2]">{doc.title}</h3>
                  <p className="text-sm text-gray-600">Uploaded at: {new Date(doc.uploaded_at).toLocaleString()}</p>
                  {doc.link ? (
                    <p className="text-sm text-gray-600">Link: <a href={doc.link} target="_blank" rel="noopener noreferrer" className="text-[#1877F2] hover:underline">{doc.link}</a></p>
                  ) : (
                    <p className="text-sm text-gray-600">File: <a href={doc.file} target="_blank" rel="noopener noreferrer" className="text-[#1877F2] hover:underline">{doc.file}</a></p>
                  )}
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => handleEditClick(doc)}
                    className="bg-[#1877F2] text-white p-2 rounded-lg mr-2 flex items-center"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="bg-red-500 text-white p-2 rounded-lg flex items-center"
                  >
                    <FaTrash />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentManager;
