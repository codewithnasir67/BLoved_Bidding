import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import styles from '../../styles/styles'
import EventCard from "./EventCard";

const Events = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);

  return (
    <div>
      {
        !isLoading && (
          <div className={`${styles.section}`}>
            <div className={`${styles.heading}`}>
              <h1>Popular Events</h1>
            </div>

            <div className="w-full grid">
              {allEvents?.length === 0 && (
                <div className="w-full bg-gradient-to-br from-white via-white to-brand-teal/10 dark:from-gray-800 dark:via-gray-800 dark:to-brand-teal/20 rounded-2xl shadow-lg border border-brand-teal/10 dark:border-brand-teal/20 p-10 flex flex-col items-center justify-center min-h-[50vh] text-center relative overflow-hidden group">
                  {/* Decorative Glow */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-brand-teal/20 blur-3xl opacity-50 pointer-events-none"></div>

                  <div className="relative z-10 bg-white dark:bg-gray-700 p-6 rounded-full shadow-md mb-6">
                    <span className="text-4xl">🎉</span>
                  </div>

                  <h3 className="relative z-10 text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3 font-sans">
                    No Ongoing Events
                  </h3>
                  <p className="relative z-10 text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                    All our exclusive events have ended for now. Stay tuned! New exciting auctions and sales are coming very soon.
                  </p>
                </div>
              )}
            </div>

          </div>
        )
      }
    </div>
  )
}

export default Events