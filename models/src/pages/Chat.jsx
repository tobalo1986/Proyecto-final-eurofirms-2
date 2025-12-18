
// importamos useState para manejar estado local dentro del componente
import { useState } from "react";

// importamos el avatar que cambia segun la emocion
import Avatar from "../components/Avatar";

import "../index.css";

export default function Chat() {

    // Historial de mensajes del chat (usuario y sensei)
    // Cada mensaje será un objeto tipo: { sender: "user"|"sensei", text: "..." }
    const [messages, setMessages] = useState([]);

     // Emoción actual del avatar (neutral, thinking, etc.)
    const [emotion, setEmotion] = useState("neutral");

    // Texto del input controlado (lo que el usuario está escribiendo)
    const [text, setText] = useState("");

    // Función que se ejecuta al enviar el formulario
    // Es async porque hará una petición fetch (POST) al backend
    const sendMessage = async (e) => {
        e.preventDefault();

        // Si el texto está vacío o solo tiene espacios, no hace nada
        if (!text.trim()) return;

        // Añade el mensaje del usuario al historial de mensajes
        // Usamos "prev" para asegurarnos de partir del estado más reciente
        setMessages((prev) => [...prev, { sender: "user", text }]);

        // Guardamos el mensaje en una variable antes de limpiar el input
        const userMsg = text;

        // Limpiamos el input (porque es controlado por el estado "text")
        setText("");


        // Cambiamos la emoción del avatar para indicar que "está pensando"
        setEmotion("thinking");

        try {


            // Petición POST al backend
            // URL construida con variable de entorno de Vite: VITE_API_URL
            // Endpoint: api/sensei
            const res = await fetch(`${import.meta.env.VITE_API_URL}api/sensei`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                // Enviamos el mensaje del usuario en formato JSON
                body: JSON.stringify({ message: userMsg })
            });

            // Convertimos la respuesta a JSON
            const data = await res.json();
            console.log("Backend:", data);

            // Añadimos el mensaje de la sensei al historial
            // Si no llega data.text, mostramos un mensaje de error por defecto
            setMessages((prev) => [
                ...prev,
                { sender: "sensei", text: data.text || "Error al recibir respuesta." }
            ]);

            // Actualizamos emoción del avatar según lo que devuelve el backend
            // Si no llega emoción, volvemos a neutral
            setEmotion(data.emotion || "neutral");

        } catch (err) {
            // Si falla el fetch (red, backend caído, etc.) entramos aquí
            console.error(err);

            // Añadimos un mensaje de error al chat como si lo dijera la sensei
            setMessages((prev) => [

                //operador 
                ...prev,
                { sender: "sensei", text: "Error en el dojo." }
            ]);

            // Volvemos a neutral para no dejar al avatar "thinking" para siempre
            setEmotion("neutral");
        }
    };

    return (
        <div className="chat-page">


            <h1 className="title">Sensei IA</h1>

            <div className="chat-layout">

                {/* Avatar reacciona según el estado emotion */}
                <Avatar emotion={emotion} />

                <div className="chat-container">

                    <div className="chat-log">

                        
                        {messages.map((msg, i) => (
                            <div key={i} className={`msg ${msg.sender}`}>
                                {msg.text}
                            </div>
                        ))}
                    </div>

                    <form onSubmit={sendMessage} className="chat-form">
                        <input
                            type="text"
                            placeholder="Háblale a la sensei..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                        <button>Enviar</button>
                    </form>

                </div>

            </div>
        </div>
    );
}
