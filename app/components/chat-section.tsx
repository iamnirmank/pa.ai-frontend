"use client";

import { useState } from "react";
import { useCustomChat } from "../helper/customUseChat";
import { ChatInput, ChatMessages } from "./ui/chat";
import RoomList from "./ui/chat/chat-rooms";
import './chat-section.css';
import { FaBars, FaTimes } from 'react-icons/fa';

export default function ChatSection() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const {
    messages,
    input,
    isLoading,
    rooms,
    selectedRoom,
    newRoomName,
    handleRoomSelect,
    handleSubmit,
    handleInputChange,
    handleNewRoomNameChange,
    handleCreateRoom,
    reload,
    stop,
    editingRoomId,
    editingRoomName,
    startEditing,
    cancelEditing,
    handleEditingRoomNameChange,
    saveEditedRoom,
    handleDeleteRoom,
    handleEditRoom,
    setIsChatEdit,
    isChatEdit,
  } = useCustomChat();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`sidebar transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-64' : 'w-0'} overflow-hidden`}>
        {sidebarOpen && (
          <RoomList
            rooms={rooms}
            selectedRoom={selectedRoom || ""}
            newRoomName={newRoomName}
            editingRoomId={editingRoomId}
            editingRoomName={editingRoomName}
            handleRoomSelect={handleRoomSelect}
            handleNewRoomNameChange={handleNewRoomNameChange}
            handleCreateRoom={handleCreateRoom}
            startEditing={startEditing}
            cancelEditing={cancelEditing}
            handleEditingRoomNameChange={handleEditingRoomNameChange}
            saveEditedRoom={saveEditedRoom}
            handleDeleteRoom={handleDeleteRoom}
            handleEditRoom={handleEditRoom}
          />
        )}
      </div>
      
      {/* Main Chat Section */}
      <div className={`chat-section flex-1 flex flex-col space-y-4 p-4 bg-white shadow-lg rounded-lg relative transition-all duration-300 ease-in-out ${sidebarOpen ? 'ml-100' : 'ml-0'} ${sidebarOpen ? 'pl-4' : 'pl-0'}`}>
        <button onClick={toggleSidebar} className="toggle-sidebar-button absolute top-1 right-4 bg-blue-500 text-white p-2 rounded-lg">
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
        <ChatMessages
          messages={messages || []}
          isLoading={isLoading}
          reload={reload}
          stop={stop}
          setIsChatEdit={setIsChatEdit}
          isChatEdit={isChatEdit}
        />
        <ChatInput
          input={input}
          handleSubmit={handleSubmit}
          handleInputChange={handleInputChange}
          isLoading={isLoading}
          multiModal={process.env.NEXT_PUBLIC_MODEL === "gpt-4-turbo"}
        />
      </div>
    </div>
  );
}
