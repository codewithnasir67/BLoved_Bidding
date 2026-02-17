import React from 'react';
import { useDispatch } from 'react-redux';
import { acceptOrRejectBid } from '../redux/actions/bidActions';

const BidHistory = ({ bids, isSeller, productId }) => {
  const dispatch = useDispatch();

  const handleDecision = (bidId, decision) => {
    dispatch(acceptOrRejectBid(productId, bidId, decision));
  };

  return (
    <div>
      <h3>Bid History</h3>
      <ul>
        {bids.map((bid) => (
          <li key={bid._id}>
            ${bid.amount} - User: {bid.user.name}
            {isSeller && (
              <>
                <button onClick={() => handleDecision(bid._id, 'accept')}>Accept</button>
                <button onClick={() => handleDecision(bid._id, 'reject')}>Reject</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BidHistory;
