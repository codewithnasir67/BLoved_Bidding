import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import EventCard from "../components/Events/EventCard";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";
import { getAllEvents } from "../redux/actions/event";

const EventsPage = () => {
  const dispatch = useDispatch();
  const { allEvents, isLoading } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(getAllEvents());
  }, [dispatch]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Header activeHeading={4} />
          <br />
          <br />
          <div className={`w-11/12 mx-auto`}>
            <div className="pt-8 mb-6">
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white capitalize font-sans leading-tight">
                Active Events
              </h1>
            </div>
            {allEvents && allEvents.length > 0 ? (
              <EventCard active={true} data={allEvents[0]} />
            ) : (
              <div className="w-full bg-gradient-to-br from-white via-white to-brand-teal/10 dark:from-gray-800 dark:via-gray-800 dark:to-brand-teal/20 rounded-2xl shadow-lg border border-brand-teal/10 dark:border-brand-teal/20 p-10 flex flex-col items-center justify-center min-h-[50vh] text-center relative overflow-hidden group mb-12">
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
      )}
    </>
  );
};

export default EventsPage;
