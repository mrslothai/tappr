import { useState, useEffect, useRef } from 'react';
import Scanner from './components/Scanner';
import PassCard from './components/PassCard';
import { getAllPasses, savePass, deletePass } from './utils/storage';
import { scheduleNotifications, requestNotificationPermission } from './utils/notifications';

function App() {
  const [passes, setPasses] = useState([]);
  const [notificationTimeouts, setNotificationTimeouts] = useState({});
  const [toast, setToast] = useState(null);
  const passListRef = useRef(null);

  useEffect(() => {
    const loadedPasses = getAllPasses();
    setPasses(loadedPasses);
    requestNotificationPermission();

    loadedPasses.forEach((pass) => {
      if (pass.boardingTime && pass.date) {
        const timeouts = scheduleNotifications(pass);
        setNotificationTimeouts((prev) => ({ ...prev, [pass.id]: timeouts }));
      }
    });
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handlePassScanned = (passData) => {
    const savedPass = savePass(passData);
    setPasses((prev) => [...prev, savedPass]);

    if (savedPass.boardingTime && savedPass.date) {
      const timeouts = scheduleNotifications(savedPass);
      setNotificationTimeouts((prev) => ({ ...prev, [savedPass.id]: timeouts }));
    }

    showToast(`✈️ Boarding pass saved! ${savedPass.flight ? `Flight ${savedPass.flight}` : ''} ${savedPass.from && savedPass.to ? `${savedPass.from} → ${savedPass.to}` : ''}`);

    setTimeout(() => {
      passListRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  const handleDeletePass = (id) => {
    if (confirm('Delete this boarding pass?')) {
      if (notificationTimeouts[id]) {
        notificationTimeouts[id].forEach((t) => clearTimeout(t));
        setNotificationTimeouts((prev) => { const u = { ...prev }; delete u[id]; return u; });
      }
      deletePass(id);
      setPasses((prev) => prev.filter((p) => p.id !== id));
      showToast('Boarding pass deleted', 'info');
    }
  };

  const handleTestNotification = (pass) => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission().then((perm) => {
        if (perm === 'granted') sendTestNotification(pass);
        else showToast('❌ Notifications blocked. Enable in browser settings.', 'error');
      });
    } else {
      sendTestNotification(pass);
    }
  };

  const sendTestNotification = (pass) => {
    const notif = new Notification(`✈️ ${pass.flight || 'Flight'} - Test`, {
      body: `${pass.from || ''} → ${pass.to || ''}\nBoarding: ${pass.boardingTime || 'N/A'} | Gate: ${pass.gate || 'TBA'} | Seat: ${pass.seat || 'N/A'}`,
      icon: '/icon-192.png',
      tag: 'smartpass-test',
    });
    notif.onclick = () => window.focus();
    showToast('🔔 Test notification sent! Check your notifications.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-indigo-100">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg text-white text-sm font-medium animate-bounce-in ${
          toast.type === 'error' ? 'bg-red-500' : toast.type === 'info' ? 'bg-gray-700' : 'bg-green-500'
        }`}>
          {toast.message}
        </div>
      )}

      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="text-5xl mb-2">✈️</div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
            SmartPass
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Scan your boarding pass. Get smart reminders.
          </p>
          <div className="flex justify-center gap-2 mt-3">
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">📱 Offline-First</span>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">🔒 100% Private</span>
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">🤖 AI-Powered</span>
          </div>
        </header>

        {/* Notification Permission */}
        {typeof Notification !== 'undefined' && Notification.permission === 'default' && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
            <span className="text-2xl">🔔</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800">Enable notifications</p>
              <p className="text-xs text-yellow-600">Get alerts before your flight</p>
            </div>
            <button
              onClick={() => requestNotificationPermission()}
              className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 rounded-lg text-sm font-bold transition-all"
            >
              Enable
            </button>
          </div>
        )}

        {/* Scanner */}
        <Scanner onPassScanned={handlePassScanned} />

        {/* Pass List */}
        <div ref={passListRef}>
          {passes.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                🎫 Your Boarding Passes
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{passes.length}</span>
              </h2>
              {passes.map((pass) => (
                <PassCard
                  key={pass.id}
                  pass={pass}
                  onDeletePass={handleDeletePass}
                  onTestNotification={handleTestNotification}
                />
              ))}
            </div>
          )}

          {passes.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <div className="text-5xl mb-3">🎫</div>
              <p className="font-medium">No boarding passes yet</p>
              <p className="text-sm mt-1">Upload a photo or PDF above</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-xs text-gray-400 pb-8">
          <p>SmartPass • Works offline • Data stays on your device</p>
          <p className="mt-1">Built with ❤️ by Team Sloth</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
