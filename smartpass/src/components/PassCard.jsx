import { useState } from 'react';

export default function PassCard({ pass, onDeletePass, onTestNotification }) {
  const [showRaw, setShowRaw] = useState(false);
  const [showImage, setShowImage] = useState(false);

  const InfoItem = ({ label, value, icon, color = 'blue' }) => {
    if (!value || value === '-') return null;
    const colors = {
      blue: 'bg-blue-50 border-blue-200 text-blue-800',
      green: 'bg-green-50 border-green-200 text-green-800',
      orange: 'bg-orange-50 border-orange-200 text-orange-800',
      purple: 'bg-purple-50 border-purple-200 text-purple-800',
      red: 'bg-red-50 border-red-200 text-red-800',
      gray: 'bg-gray-50 border-gray-200 text-gray-700',
    };
    return (
      <div className={`rounded-lg border p-3 ${colors[color]}`}>
        <div className="text-xs font-medium opacity-70 mb-1">{icon} {label}</div>
        <div className="text-sm font-bold">{value}</div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 mb-6 transition-all hover:shadow-xl">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white p-5">
        <div className="flex justify-between items-start">
          <div>
            {pass.airline && (
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full mb-2 inline-block">
                {pass.airline}
              </span>
            )}
            <h3 className="text-xl font-bold mt-1">{pass.name || 'Passenger'}</h3>
            {pass.pnr && (
              <p className="text-blue-200 text-sm mt-1">PNR: <span className="text-white font-mono font-bold">{pass.pnr}</span></p>
            )}
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{pass.flight || '—'}</div>
            {pass.fare && <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{pass.fare}</span>}
          </div>
        </div>

        {/* Route */}
        {(pass.from || pass.to || pass.fromCity || pass.toCity) && (
          <div className="flex items-center justify-between mt-4 bg-white/10 rounded-xl p-3">
            <div className="text-center">
              <div className="text-2xl font-bold">{pass.from || '—'}</div>
              <div className="text-xs text-blue-200 mt-1">{pass.fromCity || 'Departure'}</div>
            </div>
            <div className="flex-1 flex items-center justify-center px-4">
              <div className="h-px bg-white/30 flex-1"></div>
              <span className="mx-2 text-lg">✈️</span>
              <div className="h-px bg-white/30 flex-1"></div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{pass.to || '—'}</div>
              <div className="text-xs text-blue-200 mt-1">{pass.toCity || 'Arrival'}</div>
            </div>
          </div>
        )}
      </div>

      {/* Details Grid */}
      <div className="p-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
          <InfoItem label="BOARDING" value={pass.boardingTime} icon="🕐" color="green" />
          <InfoItem label="DEPARTURE" value={pass.departureTime} icon="🛫" color="orange" />
          <InfoItem label="DATE" value={pass.date} icon="📅" color="blue" />
          <InfoItem label="GATE" value={pass.gate} icon="🚪" color="purple" />
          <InfoItem label="SEAT" value={pass.seat} icon="💺" color="red" />
          <InfoItem label="ZONE" value={pass.zone} icon="📍" color="gray" />
          <InfoItem label="SEQUENCE" value={pass.sequence} icon="🔢" color="gray" />
          <InfoItem label="CABIN BAG" value={pass.cabinBaggage} icon="🧳" color="blue" />
          <InfoItem label="CHECK-IN BAG" value={pass.checkinBaggage} icon="🎒" color="blue" />
          <InfoItem label="ADD ONS" value={pass.addOns} icon="➕" color="purple" />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mt-4">
          {/* Test Notification Button */}
          <button
            onClick={() => onTestNotification?.(pass)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-semibold transition-all active:scale-95"
          >
            🔔 Test Notification
          </button>

          {/* Show Original Image */}
          {pass.imageData && (
            <button
              onClick={() => setShowImage(!showImage)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-all"
            >
              {showImage ? '🙈 Hide' : '🖼️ Image'}
            </button>
          )}

          {/* Show Raw Text */}
          <button
            onClick={() => setShowRaw(!showRaw)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-all"
          >
            {showRaw ? '🙈 Hide' : '📝 OCR Text'}
          </button>

          {/* Delete */}
          <button
            onClick={() => onDeletePass(pass.id)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-medium transition-all"
          >
            🗑️
          </button>
        </div>

        {/* Expandable sections */}
        {showImage && pass.imageData && (
          <div className="mt-4 rounded-xl overflow-hidden border border-gray-200">
            <img src={pass.imageData} alt="Boarding Pass" className="w-full" />
          </div>
        )}

        {showRaw && pass.rawText && (
          <div className="mt-4 bg-gray-50 rounded-xl p-4 text-xs font-mono text-gray-600 max-h-48 overflow-y-auto whitespace-pre-wrap border border-gray-200">
            {pass.rawText}
          </div>
        )}
      </div>
    </div>
  );
}
