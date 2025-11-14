'use client';
import { useState } from 'react';

export default function TestAIPage() {
    const [conversationHistory, setConversationHistory] = useState([]);

    async function handleUserMessage(message) {
        const response = await fetch('/api/ai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.HARDCODED_PASSWORD}`,
            },
            body: JSON.stringify({ message, conversationHistory: conversationHistory }),
        });

        const data = await response.json();
        setConversationHistory([...conversationHistory, { role: 'user', content: message }, { role: 'ai', content: data.message }]);
    }

    return (
        <div className="w-90">
            <h1>Test AI Page</h1>
            <input type="text" placeholder="Type your message here" />
            <button onClick={() => handleUserMessage(document.querySelector('input').value)}>Send Message</button>
            {conversationHistory.map((msg, index) => (
                <div key={index} style={{ textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                    <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong> {msg.content}
                </div>
            ))}
        </div>
    );
} 