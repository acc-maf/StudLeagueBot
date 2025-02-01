import React, { useState, useEffect } from 'react';
import { Calendar, Users, Coins, FileText, Tag } from 'lucide-react';

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        expand: () => void;
        ready: () => void;
        MainButton: {
          text: string;
          show: () => void;
          hide: () => void;
          onClick: (fn: () => void) => void;
        };
        close: () => void;
        sendData: (data: string) => void;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
          };
        };
      };
    };
  }
}

interface EventForm {
  identifier: string;
  title: string;
  description: string;
  date: string;
  participantLimit: number;
  price: number;
}

const inputStyles = {
  backgroundColor: 'var(--tg-theme-secondary-bg-color)',
  color: 'var(--tg-theme-text-color)',
  borderColor: 'var(--tg-theme-button-color)',
  borderWidth: '1px',
  borderStyle: 'solid'
};

function App() {
  const [formData, setFormData] = useState<EventForm>({
    identifier: '',
    title: '',
    description: '',
    date: '',
    participantLimit: 1,
    price: 0
  });

  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const dataToSend = {
        ...formData,
        user: window.Telegram.WebApp.initDataUnsafe.user
      };

      window.Telegram.WebApp.sendData(JSON.stringify(dataToSend));
      window.Telegram.WebApp.close();
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--tg-theme-secondary-bg-color)' }}>
      <div className="max-w-2xl mx-auto">
        <div className="rounded-2xl shadow-xl p-8" style={{ backgroundColor: 'var(--tg-theme-bg-color)' }}>
          <h1 className="text-3xl font-bold text-center mb-8" style={{ color: 'var(--tg-theme-text-color)' }}>
            Создание мероприятия
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="flex items-center text-sm font-medium" style={{ color: 'var(--tg-theme-text-color)' }}>
                <Tag className="w-5 h-5 mr-2" style={{ color: 'var(--tg-theme-button-color)' }} />
                Идентификатор
              </label>
              <input
                type="text"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg transition-colors"
                style={inputStyles}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="flex items-center text-sm font-medium" style={{ color: 'var(--tg-theme-text-color)' }}>
                <FileText className="w-5 h-5 mr-2" style={{ color: 'var(--tg-theme-button-color)' }} />
                Название
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg transition-colors"
                style={inputStyles}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="flex items-center text-sm font-medium" style={{ color: 'var(--tg-theme-text-color)' }}>
                <FileText className="w-5 h-5 mr-2 rotate-180" style={{ color: 'var(--tg-theme-button-color)' }} />
                Описание
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 rounded-lg transition-colors"
                style={inputStyles}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="flex items-center text-sm font-medium" style={{ color: 'var(--tg-theme-text-color)' }}>
                <Calendar className="w-5 h-5 mr-2" style={{ color: 'var(--tg-theme-button-color)' }} />
                Дата проведения
              </label>
              <input
                type="datetime-local"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg transition-colors"
                style={inputStyles}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="flex items-center text-sm font-medium" style={{ color: 'var(--tg-theme-text-color)' }}>
                  <Users className="w-5 h-5 mr-2" style={{ color: 'var(--tg-theme-button-color)' }} />
                  Лимит участников
                </label>
                <input
                  type="number"
                  name="participantLimit"
                  value={formData.participantLimit}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-2 rounded-lg transition-colors"
                  style={inputStyles}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="flex items-center text-sm font-medium" style={{ color: 'var(--tg-theme-text-color)' }}>
                  <Coins className="w-5 h-5 mr-2" style={{ color: 'var(--tg-theme-button-color)' }} />
                  Стоимость (₽)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 rounded-lg transition-colors"
                  style={inputStyles}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-6 rounded-lg transition-colors duration-200 font-medium"
              style={{
                backgroundColor: 'var(--tg-theme-button-color)',
                color: 'var(--tg-theme-button-text-color)'
              }}
            >
              Создать мероприятие
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;