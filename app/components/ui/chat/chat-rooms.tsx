import React, { useState } from 'react';
import { FaSave, FaEdit, FaTrash, FaTimes, FaSpinner } from 'react-icons/fa';

interface RoomListProps {
  rooms: { id: string; name: string }[];
  selectedRoom: string;
  newRoomName: string;
  editingRoomId: string | null;
  editingRoomName: string;
  handleRoomSelect: (room: { id: string; name: string }) => void;
  handleNewRoomNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  startEditing: (id: string, name: string) => void;
  cancelEditing: () => void;
  handleEditingRoomNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCreateRoom: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  saveEditedRoom: () => Promise<void>;
  handleEditRoom: (roomId: string, roomName: string) => Promise<void>;
  handleDeleteRoom: (roomId: string) => Promise<void>;
}

const RoomList: React.FC<RoomListProps> = ({
  rooms,
  selectedRoom,
  newRoomName,
  editingRoomId,
  editingRoomName,
  handleRoomSelect,
  handleNewRoomNameChange,
  handleCreateRoom,
  startEditing,
  cancelEditing,
  handleEditingRoomNameChange,
  saveEditedRoom,
  handleDeleteRoom,
  handleEditRoom,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleCreateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsCreating(true);
    handleCreateRoom(e).finally(() => setIsCreating(false));
  };

  const handleSave = () => {
    setIsEditing(editingRoomId);
    saveEditedRoom().finally(() => setIsEditing(null));
  };

  const handleDelete = (id: string) => {
    setIsDeleting(id);
    handleDeleteRoom(id).finally(() => setIsDeleting(null));
  };

  return (
    <div className="room-list flex flex-col bg-white shadow-lg p-6 rounded-lg h-full overflow-auto">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Rooms</h2>
      <form onSubmit={handleCreateSubmit} className="mb-4 flex flex-col gap-2">
        <input
          type="text"
          value={newRoomName}
          onChange={handleNewRoomNameChange}
          placeholder="New room name"
          className="p-2 border border-gray-300 rounded-lg w-full"
        />
        <button
          type="submit"
          className={`bg-blue-500 text-white p-2 rounded-lg w-full flex items-center justify-center ${isCreating ? 'bg-blue-600 cursor-not-allowed' : ''}`}
          disabled={isCreating}
        >
          {isCreating ? <FaSpinner className="animate-spin" /> : 'Create Room'}
        </button>
      </form>
      {rooms.map((room) => (
        <div
          key={room.id}
          className={`p-2 mb-2 rounded-lg cursor-pointer flex justify-between items-center ${selectedRoom === room.id ? 'bg-blue-300' : 'bg-gray-100'} hover:bg-gray-200`}
        >
          {editingRoomId === room.id ? (
            <div className="flex items-center w-full">
              <input
                type="text"
                value={editingRoomName}
                onChange={handleEditingRoomNameChange}
                className="p-1 border border-gray-300 rounded-lg w-2/3 mr-2"
              />
              <button
                onClick={handleSave}
                className={`bg-green-500 text-white p-1 rounded-lg flex items-center justify-center ${isEditing === room.id ? 'bg-green-600 cursor-not-allowed' : ''}`}
                disabled={isEditing === room.id}
              >
                {isEditing === room.id ? <FaSpinner className="animate-spin" /> : <FaSave />}
              </button>
              <button
                onClick={cancelEditing}
                className="bg-red-500 text-white p-1 rounded-lg ml-2 flex items-center justify-center"
              >
                <FaTimes />
              </button>
            </div>
          ) : (
            <span onClick={() => handleRoomSelect(room)} className="text-gray-800">{room.name}</span>
          )}
          <div className="flex space-x-2">
            {editingRoomId !== room.id && (
              <>
                <button
                  onClick={() => startEditing(room.id, room.name)}
                  className="bg-[#1877F2] text-white p-1 rounded-lg flex items-center justify-center"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(room.id)}
                  className={`bg-red-500 text-white p-1 rounded-lg flex items-center justify-center ${isDeleting === room.id ? 'bg-red-600 cursor-not-allowed' : ''}`}
                  disabled={isDeleting === room.id}
                >
                  {isDeleting === room.id ? <FaSpinner className="animate-spin" /> : <FaTrash />}
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoomList;
