import React, { useState } from 'react'
import { Bell } from 'lucide-react'

function AdminHeader({ notificationCount = 0, notifications = [], onNotificationClick }) {
  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <div className="bg-white border-b px-8 py-4">
      <div className="flex items-center justify-between">

        {/* Right Side */}
        <div className="flex items-center gap-4 ml-auto">
          
          {/* Notifications */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-gray-100 rounded-xl transition-all"
            >
              <Bell className="w-6 h-6 text-gray-600" />
              {notificationCount > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border z-50">
                <div className="p-4 border-b">
                  <h3 className="font-black text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-auto">
                  {notifications.length === 0 && (
                    <div className="p-4 text-sm text-gray-500">No recent notifications.</div>
                  )}
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                        notif.unread ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => {
                        if (onNotificationClick) {
                          onNotificationClick(notif)
                        }
                        setShowNotifications(false)
                      }}
                    >
                      <p className="text-sm font-medium text-gray-900">{notif.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                    </div>
                  ))}
                </div>
                <div className="p-3 text-center border-t">
                  <button className="text-sm text-emerald-600 font-bold hover:text-emerald-700">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminHeader