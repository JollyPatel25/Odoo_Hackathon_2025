import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PendingRequests = () => {
  const [view, setView] = useState('pending'); // 'pending' or 'sent'
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/user/requests?type=${view}`, {
            headers: { Authorization: `Bearer ${token}` },
            });

        setRequests(res.data);
      } catch (err) {
        console.error('Error fetching requests:', err);
      }
      setLoading(false);
    };

    fetchRequests();
  }, [view]);

  return (
    <div className="p-4">
      <div className="flex justify-center gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${view === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setView('pending')}
        >
          Pending Received
        </button>
        <button
          className={`px-4 py-2 rounded ${view === 'sent' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setView('sent')}
        >
          Sent Requests
        </button>
      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="grid gap-4">
          {requests.length === 0 ? (
            <p className="text-center text-gray-600">No {view} requests</p>
          ) : (
            requests.map((req) => (
              <div
                key={req._id}
                className="border rounded p-4 shadow flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{view === 'pending' ? req.sender.name : req.receiver.name}</p>
                  <p className="text-sm text-gray-600">
                    Offered: {req.skillOffered} | Wanted: {req.skillWanted}
                  </p>
                </div>
                <span className="text-yellow-600 font-medium">Pending</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default PendingRequests;
