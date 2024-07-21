import { useState, useCallback, useEffect } from "react";
import axiosInstance from "@/app/helper/axiosInstance";

// Define types for messages and responses
interface Message {
  id: string;
  content: string;
  role: "function" | "user" | "system" | "data" | "assistant" | "tool";
  createdAt?: Date;
  annotations?: any[];
}

interface Room {
  id: string;
  name: string;
}

interface UseCustomChat {
  messages: Message[];
  input: string;
  isLoading: boolean;
  rooms: Room[];
  selectedRoom: string | null;
  newRoomName: string;
  handleRoomSelect: (room: Room) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleNewRoomNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  reload: () => void;
  stop: () => void;
  startEditing: (roomId: string, roomName: string) => void;
  cancelEditing: () => void;
  handleEditingRoomNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  editingRoomId: string | null;
  editingRoomName: string;
  handleCreateRoom: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  saveEditedRoom: () => Promise<void>;
  handleEditRoom: (roomId: string, roomName: string) => Promise<void>;
  handleDeleteRoom: (roomId: string) => Promise<void>;
  setIsChatEdit: (isChatEdit: boolean) => void;
  isChatEdit: boolean;
}

export function useCustomChat(): UseCustomChat {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [newRoomName, setNewRoomName] = useState<string>("");
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [editingRoomName, setEditingRoomName] = useState<string>("");
  const [isChatEdit, setIsChatEdit] = useState<boolean>(false);

  const reload = useCallback(() => {
    window.location.reload();
  }, []);

  const stop = useCallback(() => {
    setIsLoading(false);
  }, []);

  const startEditing = useCallback((roomId: string, roomName: string) => {
    setEditingRoomId(roomId);
    setEditingRoomName(roomName);
  }, []);

  const cancelEditing = useCallback(() => {
    setEditingRoomId(null);
    setEditingRoomName("");
  }, []);

  const handleEditingRoomNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setEditingRoomName(event.target.value);
  }, []);

  const handleCreateRoom = useCallback(async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (!newRoomName.trim()) return;

    try {
      const response = await axiosInstance.post("chatmate/api/rooms/", { name: newRoomName });
      setRooms(prevRooms => [...prevRooms, response.data]);
      setNewRoomName("");
    } catch (error) {
      console.error("Error creating room:", error);
    }
  }, [newRoomName]);

  const handleEditRoom = useCallback(async (roomId: string, roomName: string): Promise<void> => {
    try {
      await axiosInstance.put(`chatmate/api/rooms/${roomId}/`, { name: roomName });
      setRooms(prevRooms => prevRooms.map(room => room.id === roomId ? { ...room, name: roomName } : room));
    } catch (error) {
      console.error("Error editing room:", error);
    }
  }, []);

  const handleDeleteRoom = useCallback(async (roomId: string): Promise<void> => {
    try {
      await axiosInstance.delete(`chatmate/api/rooms/${roomId}/`);
      setRooms(prevRooms => prevRooms.filter(room => room.id !== roomId));
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  }, []);

  const saveEditedRoom = useCallback(async (): Promise<void> => {
    if (editingRoomId && editingRoomName.trim()) {
      await handleEditRoom(editingRoomId, editingRoomName);
      cancelEditing();
    }
  }, [editingRoomId, editingRoomName, handleEditRoom, cancelEditing]);

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (!input.trim()) return;

    setIsLoading(true);

    try {
      const response = await axiosInstance.post('chatmate/api/query/process_chat/', {
        query: input,
        room: selectedRoom,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setMessages(prevMessages => [
        ...prevMessages,
        { id: response.data.body.id, content: response.data.body.query_text, createdAt: response.data.body.created_at, role: "user" },
        { id: response.data.body.id, content: response.data.body.response_text, createdAt: response.data.body.created_at, role: "system" },
      ]);

      setInput("");
    } catch (error) {
      console.error("Error submitting chat:", error);
    } finally {
      setIsLoading(false);
    }
  }, [input, selectedRoom]);


  // Fetch messages for the selected room
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedRoom) return;

      try {
        const res = await axiosInstance.get(`chatmate/api/query/${selectedRoom}/get_queries_by_room_id/`);
        const response = res.data;
        const fetchedMessages: Message[] = response.body.map((message: any) => ([
          {
            id: message.id,
            content: message.query_text,
            role: "user",
            createdAt: new Date(message.created_at),
          },
          {
            id: message.id,
            content: message.response_text,
            role: "system",
            createdAt: new Date(message.created_at),
          },
        ])).flat();

        setMessages(fetchedMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [selectedRoom, isChatEdit]);

  // Fetch room list
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axiosInstance.get("chatmate/api/rooms/");
        setRooms(response.data);
        if (response.data.length > 0) {
          setSelectedRoom(response.data[0].id); // Select the first room by default
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    fetchRooms();
  }, []);

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  }, []);

  const handleRoomSelect = useCallback((room: Room) => {
    setSelectedRoom(room.id);
    setMessages([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNewRoomNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setNewRoomName(event.target.value);
  }, []);

  return {
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
    startEditing,
    cancelEditing,
    handleEditingRoomNameChange,
    saveEditedRoom,
    handleEditRoom,
    handleDeleteRoom,
    editingRoomId,
    editingRoomName,
    setIsChatEdit,
    isChatEdit,
  };
}
